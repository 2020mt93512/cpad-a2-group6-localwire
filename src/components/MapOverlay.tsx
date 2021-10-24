import { IonBadge, IonButton, IonCardSubtitle, IonCol, IonIcon, IonNote, IonRow } from '@ionic/react';
import { navigateOutline, pencilOutline } from 'ionicons/icons';
import moment from 'moment';
import React from 'react';

import type { EventEntry } from '../models';
import type { LocationCoords } from '../utils/location';
import { distanceBetween } from '../utils/location';
import { colorPallete as tagColors } from '../utils/tagColors';

import './MapOverlay.css';

export interface MapOverlayProps {
  eventItem: EventEntry;
  currentLocation: LocationCoords;
  isEditable: boolean;
  tags: string[];
}

export const MapOverlay: React.FC<MapOverlayProps> = ({ eventItem, currentLocation, isEditable, tags }) => {
  const distanceInKm = React.useMemo(
    () => distanceBetween({ latitude: eventItem.lat, longitude: eventItem.long }, currentLocation),
    [currentLocation, eventItem.lat, eventItem.long]
  );

  const durationAgo = React.useMemo(() => moment(new Date(eventItem.timestamp)).fromNow(), []);

  return (
    <div className="overlay-container">
      <IonCardSubtitle style={{ fontSize: '16px' }}>{eventItem.title}</IonCardSubtitle>
      <IonRow>
        <IonCol>
          <IonNote style={{ fontSize: '14px' }} color="medium">
            {eventItem.description}
          </IonNote>
        </IonCol>
        <IonCol>
          <IonNote style={{ fontSize: '12px' }} color="medium">
            {durationAgo}
          </IonNote>
        </IonCol>
      </IonRow>
      <div className="overlay-tags">
        {eventItem.tags.map((tagItem, tagIdx) => (
          <IonBadge key={tagItem} style={{ background: tagColors[tagItem] }}>
            {tags[tagIdx]}
          </IonBadge>
        ))}
      </div>

      <p style={{ fontSize: '12px' }}>
        <IonIcon icon={navigateOutline} />
        &nbsp;
        {Math.round(distanceInKm) > 0
          ? `${Math.round(distanceInKm)} km away`
          : `${Math.round(distanceInKm * 1000)} m away`}
      </p>

      {isEditable && (
        <IonRow className="ion-no-padding ion-no-margin ion-margin-top">
          <IonCol size="12" className="ion-no-padding ion-no-margin">
            <IonButton
              color="primary"
              fill="solid"
              size="small"
              expand="block"
              routerLink={`/events/${eventItem.createdBy}/${eventItem.uid}`}
            >
              Edit &nbsp;
              <IonIcon icon={pencilOutline} />
            </IonButton>
          </IonCol>
        </IonRow>
      )}

      {/* <IonRow className="ion-no-padding ion-no-margin">
        <IonCol size="12" className="ion-no-padding ion-no-margin">
          <IonButton color="primary" fill="outline" size="small" expand="block">
            <IonIcon icon={navigateOutline} />
          </IonButton>
        </IonCol>
      </IonRow> */}
    </div>
  );
};
