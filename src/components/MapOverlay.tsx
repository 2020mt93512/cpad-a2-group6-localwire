import { IonBadge, IonButton, IonCardSubtitle, IonCol, IonIcon, IonNote, IonRow, useIonToast } from '@ionic/react';
import {
  navigateOutline,
  pencilOutline,
  thumbsDown,
  thumbsDownOutline,
  thumbsUp,
  thumbsUpOutline,
} from 'ionicons/icons';
import moment from 'moment';
import React from 'react';

import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import type { EventEntry } from '../models';
import dbServiceImpl from '../services/DbServiceImpl';
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
  console.log(eventItem);
  const verifiedPercent = React.useMemo(() => {
    const totalVotes = eventItem.verifiedBy.length + eventItem.unverifiedBy.length;
    if (totalVotes > 0) {
      return (eventItem.verifiedBy.length * 100) / totalVotes;
    }
    return 0;
  }, []);

  const verificationColorRange = React.useMemo(() => {
    if (verifiedPercent >= 75) {
      return 'success';
    } else if (verifiedPercent >= 50) {
      return 'warning';
    }
    return 'danger';
  }, [verifiedPercent]);

  const { user } = useAuth();
  const [showToast, dismissToast] = useIonToast();
  const { showSpinner, dismissSpinner } = useLoading();

  const handleThumbsDownClick = React.useCallback(async () => {
    if (user) {
      try {
        showSpinner('unverify-event');
        if (eventItem.unverifiedBy.includes(user.uid)) {
          await dbServiceImpl.cancelUnverifyEvent(eventItem.createdBy, user.uid, eventItem.uid);
        } else {
          await dbServiceImpl.unverifyEvent(eventItem.createdBy, user.uid, eventItem.uid);
        }
      } catch (err: any) {
        console.error(err);
        showToast({
          message: err?.message ?? 'Unable to update event. Please try again',
          duration: 5000,
          buttons: [{ text: 'close', handler: () => dismissToast() }],
        });
      } finally {
        dismissSpinner('unverify-event');
      }
    }
  }, [user, eventItem]);

  const handleThumbsUpClick = React.useCallback(async () => {
    if (user) {
      try {
        showSpinner('verify-event');
        if (eventItem.verifiedBy.includes(user.uid)) {
          await dbServiceImpl.cancelVerifyEvent(eventItem.createdBy, user.uid, eventItem.uid);
        } else {
          await dbServiceImpl.verifyEvent(eventItem.createdBy, user.uid, eventItem.uid);
        }
      } catch (err: any) {
        console.error(err);
        showToast({
          message: err?.message ?? 'Unable to update event. Please try again',
          duration: 5000,
          buttons: [{ text: 'close', handler: () => dismissToast() }],
        });
      } finally {
        dismissSpinner('verify-event');
      }
    }
  }, [user, eventItem]);

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
      <IonBadge color={verificationColorRange}>{verifiedPercent}% verified</IonBadge>
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

      {isEditable ? (
        <>
          <IonRow className="ion-no-padding ion-no-margin ion-margin-top">
            <IonCol size="6" className="ion-no-padding ion-no-margin" style={{ color: '#2dd36f' }}>
              {eventItem.verifiedBy.length} &nbsp; <IonIcon icon={thumbsUp} />
            </IonCol>
            <IonCol size="6" className="ion-no-padding ion-no-margin" style={{ color: '#eb445a' }}>
              {eventItem.unverifiedBy.length} &nbsp; <IonIcon icon={thumbsDown} />
            </IonCol>
          </IonRow>
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
        </>
      ) : (
        <IonRow className="ion-no-padding ion-no-margin ion-margin-top">
          <IonCol size="6" className="ion-no-padding ion-no-margin">
            <IonButton color="primary" fill="outline" size="small" expand="block" onClick={handleThumbsDownClick}>
              <IonIcon icon={user && eventItem.unverifiedBy.includes(user.uid) ? thumbsDown : thumbsDownOutline} />
            </IonButton>
          </IonCol>
          <IonCol size="6" className="ion-no-padding ion-no-margin">
            <IonButton color="primary" fill="outline" size="small" expand="block" onClick={handleThumbsUpClick}>
              <IonIcon icon={user && eventItem.verifiedBy.includes(user.uid) ? thumbsUp : thumbsUpOutline} />
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
