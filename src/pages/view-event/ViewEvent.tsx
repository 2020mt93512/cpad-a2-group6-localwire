import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonToolbar,
  useIonToast,
} from '@ionic/react';
import { mapOutline, timeOutline } from 'ionicons/icons';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import '../../components/AddEventModal.css';
import Input from '../../components/Input';
import { useLoading } from '../../context/LoadingContext';
import type { EventEntry, EventTag } from '../../models';
import dbServiceImpl from '../../services/DbServiceImpl';

export interface ViewEventPageParams {
  useruid: string;
  eventuid: string;
}

const ViewEvent: React.FC = (props) => {
  const { useruid, eventuid } = useParams<ViewEventPageParams>();
  const [newEvent, setNewEvent] = React.useState<EventEntry | null>(null);
  const [eventTags, setEventTags] = React.useState<EventTag[]>([]);
  const [showToast, dismissToast] = useIonToast();
  const { showSpinner, dismissSpinner } = useLoading();
  const history = useHistory();

  const redirectToMyEvents = React.useCallback(() => {
    history.replace('/events/my');
  }, [history]);

  const updateEvent = React.useCallback(async () => {
    if (newEvent && useruid) {
      try {
        showSpinner('update-event');
        const eventItem: EventEntry = {
          ...newEvent,
          tags: newEvent.tags.length > 0 ? newEvent.tags : [0], // make tag as general by default if no tag is selected
        };
        await dbServiceImpl.updateEvent(useruid, eventuid, {
          title: eventItem.title,
          description: eventItem.description,
          tags: eventItem.tags,
        });
        redirectToMyEvents();
      } catch (err: any) {
        console.error(err);
        showToast({
          message: err?.message ?? 'Unable to update event. Please try again',
          duration: 5000,
          buttons: [{ text: 'close', handler: () => dismissToast() }],
        });
      } finally {
        dismissSpinner('update-event');
      }
    }
  }, [newEvent, useruid, showSpinner, eventuid, showToast, dismissToast, dismissSpinner]);

  // fetch event details on load
  React.useEffect(() => {
    if (useruid && eventuid) {
      dbServiceImpl.getEventData(useruid, eventuid).then((eventData) => {
        setNewEvent(eventData);
      });
      dbServiceImpl.getEventTags().then((tags) => {
        setEventTags(tags);
      });
    }
  }, [useruid, eventuid]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="My Events" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {newEvent && (
          <IonGrid className="add-event-grid">
            <IonRow>
              <IonCol size="12">
                <Input
                  label="Title"
                  value={newEvent?.title ?? ''}
                  required
                  onIonChange={(event) =>
                    setNewEvent((oldEvent) => {
                      if (oldEvent) {
                        return { ...oldEvent, title: event.detail.value ?? '' };
                      }
                      return null;
                    })
                  }
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
                    setNewEvent((oldEvent) => {
                      if (oldEvent) {
                        return { ...oldEvent, description: event.detail.value ?? '' };
                      }
                      return null;
                    })
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
                    onIonChange={(e: any) =>
                      setNewEvent((oldEvent) => {
                        if (oldEvent) {
                          return { ...oldEvent, tags: e.detail.value ?? '' };
                        }
                        return null;
                      })
                    }
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
                <IonIcon icon={timeOutline} className="ion-margin-end" />
                <IonLabel>Date</IonLabel>
              </IonCol>
              <IonCol size="6">{new Date(newEvent.timestamp).toDateString()}</IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="6">
                <IonIcon icon={mapOutline} className="ion-margin-end" />
                <IonLabel>Region</IonLabel>
              </IonCol>
              <IonCol size="6">
                {newEvent.lat.toFixed(2)} &#176;
                <br></br>
                {newEvent.long.toFixed(2)} &#176;
              </IonCol>
            </IonRow>
            <IonRow>
              {/* <IonCol size="6" className="ion-padding-horizontal ion-padding-top">
                <IonButton color="dark" onClick={dismissModal}>
                  Cancel
                </IonButton>
              </IonCol> */}
              <IonCol size="6" className="ion-padding-horizontal ion-padding-top">
                <IonButton color="primary" onClick={updateEvent}>
                  Update Event
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ViewEvent;
