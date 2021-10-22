import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
  isPlatform,
} from '@ionic/react';
import { getFirestore,collection, addDoc, getDoc, doc } from "firebase/firestore"; 
import { title } from 'process';
import React, { useState, useEffect, useRef } from 'react';

import { withAuth } from '../../hooks/withAuth';
import './Home.css';


const Home: React.FC = () => {
  const [eventDesc, setEventDesc] = useState<any | null>(null);
  const [tags, setTags] = useState<any | null>(null);
  const [regions, setRegions] = useState<any | null>(null);

  const insertData = async () :  Promise<Event | null> => {
    try {
      const docRef = await addDoc(collection(db, "events"), {
        content: eventDesc,
        tags: [tags],
        regionIds: [regions]
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    return null;
  }

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
        <IonItem>
            <IonLabel position="stacked">Event</IonLabel>
            <IonInput value={eventDesc}
              onIonChange={(event) => setEventDesc(event.detail.value)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">tags</IonLabel>
            <IonInput value={tags}
              onIonChange={(event) => setTags(event.detail.value)}
            />
          </IonItem>
        
          <IonItem>
            <IonLabel position="stacked">regions</IonLabel>
            <IonTextarea value={regions}
              onIonChange={(event) => setRegions(event.detail.value)}
            />
          </IonItem>
        </IonList>
        <IonButton expand="block" onClick={insertData}>Save</IonButton>
    </IonContent>
    
  </IonPage>
);
  };

export default withAuth(Home);
const db = getFirestore();
