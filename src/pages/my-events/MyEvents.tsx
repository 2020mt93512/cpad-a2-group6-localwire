import type { User } from '@firebase/auth';
import type { Unsubscribe } from '@firebase/util';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonNote,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { navigateOutline, pencilOutline, timeOutline } from 'ionicons/icons';
import moment from 'moment';
import React from 'react';

import { useAuth } from '../../context/AuthContext';
import type { EventEntry, EventTag } from '../../models';
import dbServiceImpl from '../../services/DbServiceImpl';
import type { LocationCoords } from '../../utils/location';
import { getLocation, distanceBetween } from '../../utils/location';

import './MyEvents.css';

const MyEvents: React.FC = () => {
  const [currentLocation, setCurrentLocation] = React.useState<LocationCoords | null>(null);
  const [events, setEvents] = React.useState<EventEntry[]>([]);
  const [eventTags, setEventTags] = React.useState<EventTag[]>([]);
  const currentEventSub = React.useRef<Unsubscribe | null>(null);
  const { user } = useAuth();

  const getDistanceInKm = (eventItem: EventEntry) =>
    currentLocation ? distanceBetween({ latitude: eventItem.lat, longitude: eventItem.long }, currentLocation) : NaN;

  useIonViewWillEnter(() => {
    const getCurrentLocation = async () => {
      const fetchedLocation = await getLocation();
      return fetchedLocation;
    };

    // get current location and the list of events around that location once during mount
    getCurrentLocation().then((currentLocation) => {
      setCurrentLocation(currentLocation);
      dbServiceImpl.getMyEvents((user as User).uid).then((myEvents) => {
        setEvents(myEvents);
      });
    });

    // get list of tags for filtering during mount
    dbServiceImpl.getEventTags().then((newTags) => {
      setEventTags(newTags);
    });
  });

  const getVerificationColorRange = (verifiedPercent: number) => {
    if (verifiedPercent >= 75) {
      return 'success';
    } else if (verifiedPercent >= 50) {
      return 'warning';
    }
    return 'danger';
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Events</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">My Events</IonTitle>
          </IonToolbar>
        </IonHeader>

        {user && events && events.length > 0 ? (
          events.map((eventItem) => {
            const distanceString =
              Math.round(getDistanceInKm(eventItem)) > 0
                ? `${Math.round(getDistanceInKm(eventItem))} km away`
                : `${Math.round(getDistanceInKm(eventItem) * 1000)} m away`;

            const durationAgo = moment(new Date(eventItem.timestamp)).fromNow();
            const totalVotes = eventItem.verifiedBy.length + eventItem.unverifiedBy.length;

            const verifiedPercent = totalVotes > 0 ? (eventItem.verifiedBy.length * 100) / totalVotes : 0;
            const verificationBadgeColor = getVerificationColorRange(verifiedPercent);

            return (
              <IonCard key={eventItem.uid} routerLink={`/events/${user.uid}/${eventItem.uid}`}>
                <IonCardHeader>
                  <IonCardSubtitle>{eventItem.title}</IonCardSubtitle>
                  <IonNote color="medium">{eventItem.description}</IonNote>

                  <IonRow className="ion-justify-content-between ion-align-items-center">
                    <IonText color="primary">
                      <p>
                        <IonIcon icon={navigateOutline} />
                        {distanceString}
                      </p>
                      <p>
                        <IonIcon icon={timeOutline} />
                        {durationAgo}
                      </p>
                    </IonText>

                    <IonBadge color={verificationBadgeColor}>{verifiedPercent}% verified</IonBadge>
                    <IonButton size="small" color="primary">
                      <IonIcon icon={pencilOutline} />
                    </IonButton>
                  </IonRow>
                </IonCardHeader>
              </IonCard>
            );
          })
        ) : (
          <div className="no-items-placeholder">
            <IonCardSubtitle style={{ fontSize: '20px' }}>No events found</IonCardSubtitle>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MyEvents;
