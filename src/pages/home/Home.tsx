import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import React, { useState } from 'react';

import EventItemCard from '../../components/EventItemCard';
import { withAuth } from '../../hooks/withAuth';
import type { EventEntry } from '../../models';
import dbServiceImpl from '../../services/DbServiceImpl';

import './Home.css';

const Home: React.FC = () => {
  const [events, setEntries] = useState<EventEntry[]>([]);

  const [isAddEventModalVisible, setAddEventModalVisibility] = React.useState<boolean>(false);

  const showAddEventModal = React.useCallback(() => {
    setAddEventModalVisibility(true);
  }, []);

  const hideAddEventModal = React.useCallback(() => {
    setAddEventModalVisibility(false);
  }, []);

  // React.useEffect(() => {
  //   // setup listener for events db ref value change on mount
  //   const unsubscribeEventValueChange = dbServiceImpl.setupOnEventValueChange(setEntries);

  //   return () => {
  //     unsubscribeEventValueChange();
  //   };
  // }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>LocalWire</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">LocalWire</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {events.map((eventEntry) => (
            <IonItem button key={eventEntry.uid}>
              <EventItemCard event={eventEntry} />
            </IonItem>
          ))}
        </IonList>
        {/* {isAddEventModalVisible && (
          <AddEventModal
            isVisible={isAddEventModalVisible}
            onDidDismiss={hideAddEventModal}
            dismissModal={hideAddEventModal}
          />
        )} */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed" color="secondary">
          <IonFabButton onClick={showAddEventModal}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default withAuth(Home);
