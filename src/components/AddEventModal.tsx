import {
  useIonToast,
  IonButton,
  IonModal,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonItem,
} from '@ionic/react';
import { mapOutline } from 'ionicons/icons';
import React from 'react';

import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import type { EventEntry, EventTag } from '../models';
import dbService from '../services/DbServiceImpl';
import type { LocationCoords } from '../utils/location';
import { getGeohashForLocationCoords } from '../utils/location';

import './AddEventModal.css';
import Input from './Input';

export interface AddEventModalProps {
  isVisible: boolean;
  dismissModal: () => void;
  onDidDismiss: () => void;
  currentRegion: LocationCoords;
  eventTags: EventTag[];
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  isVisible,
  dismissModal,
  onDidDismiss,
  currentRegion,
  eventTags,
}) => {
  const { user } = useAuth();

  const [newEvent, setNewEvent] = React.useState({
    title: '',
    description: '',
    tags: [],
  });
  const [showToast, dismissToast] = useIonToast();
  const { showSpinner, dismissSpinner } = useLoading();

  const addNewEvent = React.useCallback(async () => {
    if (newEvent && user) {
      try {
        showSpinner('add-event');
        const eventItem: EventEntry = {
          ...newEvent,
          verifiedBy: [],
          unverifiedBy: [],
          uid: '',
          createdBy: user.uid,
          timestamp: Date.now(),
          lat: currentRegion.latitude,
          long: currentRegion.longitude,
          geohash: getGeohashForLocationCoords(currentRegion),
          tags: newEvent.tags.length > 0 ? newEvent.tags : [0], // make tag as general by default if no tag is selected
        };
        await dbService.addEvent(eventItem, user.uid);
        dismissModal();
        setNewEvent({ title: '', description: '', tags: [] });
      } catch (err: any) {
        console.error(err);
        showToast({
          message: err?.message ?? 'Unable to add event. Please try again',
          duration: 5000,
          buttons: [{ text: 'close', handler: () => dismissToast() }],
        });
      } finally {
        dismissSpinner('add-event');
      }
    }
  }, [currentRegion, user, dismissModal, dismissSpinner, dismissToast, newEvent, showSpinner, showToast]);

  return (
    <IonModal
      showBackdrop
      isOpen={isVisible}
      swipeToClose
      cssClass="add-event-modal-container"
      onDidDismiss={onDidDismiss}
    >
      <IonGrid fixed className="add-event-grid">
        <IonRow>
          <IonCol size="12">
            <Input
              label="Title"
              value={newEvent?.title ?? ''}
              required
              onIonChange={(event) => setNewEvent((oldEvent) => ({ ...oldEvent, title: event.detail.value ?? '' }))}
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="12">
            <Input
              label="Description"
              value={newEvent?.description ?? ''}
              required
              onIonChange={(event) =>
                setNewEvent((oldEvent) => ({ ...oldEvent, description: event.detail.value ?? '' }))
              }
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="12">
            <IonItem>
              <IonLabel position="fixed">Tags</IonLabel>
              <IonSelect
                style={{ minWidth: '100px' }}
                value={newEvent?.tags ?? ''}
                multiple={true}
                cancelText="Cancel"
                okText="OK"
                onIonChange={(e: any) => setNewEvent((oldEvent) => ({ ...oldEvent, tags: e.detail.value ?? '' }))}
              >
                {eventTags.map((eventTagItem) => (
                  <IonSelectOption key={eventTagItem.uid} value={eventTagItem.uid}>
                    {eventTagItem.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="6">
            <IonIcon icon={mapOutline} className="ion-margin-end" />
            <IonLabel>Region</IonLabel>
          </IonCol>
          <IonCol size="6">
            {currentRegion.latitude.toFixed(2)} &#176;
            <br></br>
            {currentRegion.longitude.toFixed(2)} &#176;
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="6" className="ion-padding-horizontal ion-padding-top">
            <IonButton color="dark" onClick={dismissModal}>
              Cancel
            </IonButton>
          </IonCol>
          <IonCol size="6" className="ion-padding-horizontal ion-padding-top">
            <IonButton color="primary" onClick={addNewEvent}>
              Add New Event
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonModal>
  );
};

export default AddEventModal;
