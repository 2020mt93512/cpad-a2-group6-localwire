import type { Unsubscribe } from '@firebase/database';
import type { SegmentChangeEventDetail } from '@ionic/core';
import { isPlatform } from '@ionic/core';
import {
  IonPage,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  useIonViewWillEnter,
} from '@ionic/react';
import { addOutline, flashOffOutline, flashOutline } from 'ionicons/icons';
import { Map, Marker, Overlay } from 'pigeon-maps';
import { maptiler } from 'pigeon-maps/providers';
import React from 'react';

import AddEventModal from '../../components/AddEventModal';
import CurrentPointOverlay from '../../components/CurrentPointOverlay';
import { MapOverlay } from '../../components/MapOverlay';
import { useAuth } from '../../context/AuthContext';
import type { EventEntry, EventTag } from '../../models';
import dbServiceImpl from '../../services/DbServiceImpl';
import { getLocation } from '../../utils/location';
// eslint-disable-next-line import/order
import type { LocationCoords } from '../../utils/location';

import './MapView.css';
import { colorPallete as tagColorPallete } from '../../utils/tagColors';

// const maptilerProvider = maptiler('d5JQJPLLuap8TkJJlTdJ', 'streets');
const maptilerProvider = maptiler('Hb9xbbx1tFh4lDt0IHU6', 'streets');

type MapClickHandler = ({
  event,
  latLng,
  pixel,
}: {
  event: MouseEvent;
  latLng: [number, number];
  pixel: [number, number];
}) => void;

type MarkerClickHandler = (
  {
    event: HTMLMouseEvent,
    anchor: Point,
    payload: any,
  }: {
    event: any;
    anchor: any;
    payload: any;
  },
  eventId: string
) => void;

const MapView: React.FC = () => {
  const web = isPlatform('mobile' || 'mobileweb' || 'pwa' || 'desktop');
  const { user } = useAuth();

  const [currentPoint, setCurrentPoint] = React.useState<LocationCoords | null>(null);
  const [events, setEvents] = React.useState<EventEntry[]>([]);
  const [eventTags, setEventTags] = React.useState<EventTag[]>([]);
  const [filterTag, setFilterTag] = React.useState<EventTag | null>(null);
  const [showCurrentPointInfo, setShowCurrentPointInfo] = React.useState<boolean>(false);
  const [moveMode, setMoveMode] = React.useState<boolean>(false);
  const [showAddEventModal, setShowAddEventModal] = React.useState<boolean>(false);
  const [showInfoById, setShowInfoById] = React.useState<Record<string, boolean>>({});
  const currentEventSub = React.useRef<Unsubscribe | null>(null);

  const toggleShowCurrentPointInfo = React.useCallback(() => {
    setShowCurrentPointInfo((currentValue) => !currentValue);
  }, []);

  const hideAllMarkerInfos = React.useCallback(() => {
    setShowInfoById((currentShowInfoById) =>
      Object.keys(currentShowInfoById).reduce((acc, eventId) => {
        acc[eventId] = false;
        return acc;
      }, {} as Record<string, boolean>)
    );
    setShowCurrentPointInfo(false);
  }, []);

  const showMarkerInfo: MarkerClickHandler = React.useCallback(
    (_, eventId) => {
      hideAllMarkerInfos();
      setShowInfoById((currentShowInfoById) => ({ ...currentShowInfoById, [eventId]: true }));
    },
    [hideAllMarkerInfos]
  );

  const handleMapClick: MapClickHandler = React.useCallback(
    (e) => {
      if (moveMode) {
        const clickedPoint = e.latLng;
        setCurrentPoint({ latitude: clickedPoint[0], longitude: clickedPoint[1] });
        setMoveMode(false);
      } else {
        hideAllMarkerInfos();
      }
    },
    [moveMode, hideAllMarkerInfos]
  );

  const presentAddEventModal = React.useCallback(() => {
    setShowAddEventModal(true);
  }, []);

  const dismissAddEventModal = React.useCallback(() => {
    setShowAddEventModal(false);
  }, []);

  const handleSelectTag = React.useCallback(
    (event: CustomEvent<SegmentChangeEventDetail>) => {
      const tagItem = eventTags.find((item) => item.name === event.detail.value);
      setFilterTag(tagItem ?? null);
    },
    [eventTags]
  );

  React.useEffect(() => {
    const getCurrentLocation = async () => {
      const fetchedLocation = await getLocation();
      return fetchedLocation;
    };

    // get current location and the list of events around that location once during mount
    getCurrentLocation().then((currentLocation) => {
      setCurrentPoint(currentLocation);
      currentEventSub.current = dbServiceImpl.setupOnEventValueChange(currentLocation, setEvents);
    });

    // get list of tags for filtering during mount
    dbServiceImpl.getEventTags().then((newTags) => {
      setEventTags(newTags);
    });

    return () => {
      currentEventSub.current?.();
    };
  }, []);

  React.useEffect(() => {
    // get list of events around the chosen location for each update
    if (currentPoint) {
      currentEventSub.current = dbServiceImpl.setupOnEventValueChange(currentPoint, setEvents);
    }

    return () => {
      currentEventSub.current?.();
    };
  }, [currentPoint]);

  const filteredEventsList = React.useMemo(
    () => (filterTag ? events.filter((eventItem) => eventItem.tags.includes(filterTag.uid)) : events),
    [events, filterTag]
  );

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="overlay-tag-filters" style={{ marginTop: web ? '3.5rem' : '0.5rem' }}>
          <IonSegment scrollable value={filterTag?.name ?? 'All'} onIonChange={handleSelectTag}>
            <IonSegmentButton value="All">All</IonSegmentButton>
            {eventTags.map((eventTagItem) => (
              <IonSegmentButton key={eventTagItem.uid} value={eventTagItem.name}>
                <IonLabel style={{ color: tagColorPallete[eventTagItem.uid] }}>{eventTagItem.name}</IonLabel>
              </IonSegmentButton>
            ))}
          </IonSegment>
        </div>

        {currentPoint && (
          <Map
            defaultCenter={[currentPoint.latitude, currentPoint.longitude]}
            center={[currentPoint.latitude, currentPoint.longitude]}
            defaultZoom={13}
            provider={maptilerProvider}
            touchEvents={true}
            onClick={handleMapClick}
          >
            <Marker
              color="red"
              width={50}
              anchor={[currentPoint.latitude, currentPoint.longitude]}
              onClick={toggleShowCurrentPointInfo}
            />

            {filteredEventsList.map((eventItem, index) => {
              return (
                <Marker
                  onClick={(e) => showMarkerInfo(e, eventItem.uid)}
                  key={index}
                  color={
                    filterTag
                      ? tagColorPallete[filterTag.uid]
                      : eventItem.tags.length > 0
                      ? tagColorPallete[eventItem.tags[0]]
                      : '#3578e5'
                  }
                  width={50}
                  anchor={[eventItem.lat, eventItem.long]}
                />
              );
            })}

            {filteredEventsList
              .map((eventItem, index) => {
                if (showInfoById[eventItem.uid]) {
                  return (
                    <Overlay key={index} anchor={[eventItem.lat, eventItem.long]} offset={[95, 304]}>
                      <MapOverlay
                        eventItem={eventItem}
                        currentLocation={currentPoint}
                        isEditable={eventItem.createdBy === user?.uid}
                        tags={eventTags.filter((item) => eventItem.tags.includes(item.uid)).map((item) => item.name)}
                      />
                    </Overlay>
                  );
                }
                return null;
              })
              .filter(Boolean)}

            {showCurrentPointInfo && (
              <Overlay anchor={[currentPoint.latitude, currentPoint.longitude]} offset={[95, 153]}>
                <CurrentPointOverlay />
              </Overlay>
            )}
          </Map>
        )}
        <IonFab vertical="bottom" horizontal="start" slot="fixed" onClick={() => setMoveMode(!moveMode)}>
          <IonFabButton>
            <IonIcon icon={moveMode ? flashOffOutline : flashOutline} />
          </IonFabButton>
        </IonFab>
        <IonFab vertical="bottom" horizontal="end" slot="fixed" onClick={presentAddEventModal}>
          <IonFabButton>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        {currentPoint && (
          <AddEventModal
            isVisible={showAddEventModal}
            dismissModal={dismissAddEventModal}
            onDidDismiss={dismissAddEventModal}
            currentRegion={currentPoint}
            eventTags={eventTags}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default MapView;
