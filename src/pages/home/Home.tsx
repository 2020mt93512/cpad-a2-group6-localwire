import * as firebase from '@firebase/app';
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
import { getFirestore,collection, addDoc, getDocs, doc, onSnapshot, query, where  } from "firebase/firestore"; 
import { title } from 'process';
import React, { useState, useEffect, useRef } from 'react';

import firebaseApp from '../../config/firebase';
import { withAuth } from '../../hooks/withAuth';
import type { EventEntry } from '../../models';
import './Home.css';


const Home: React.FC = () => {
  const [eventDesc, setEventDesc] = useState<any | null>(null);
  const [tags, setTags] = useState<any | null>(null);
  const [regions, setRegions] = useState<any | null>(null);
  const [eventEntry, setEntry] = useState<EventEntry>();
  const [events, setEntries] = useState<EventEntry[]>([]);

 const getData =  async() : Promise<Event | null > => {
    const eventList : EventEntry[] = [];
    const eventsListInDb = await getDocs(collection(db, "events"));
    eventsListInDb.forEach((doc) => {
      
      console.log(doc.id, " => ", doc.data());
      const eventEnt : EventEntry = {
        id: doc.get("id"),
       description:  doc.get("content"),
       regions:  doc.get("regionIds"),
      tags: doc.get("tags")
      };
      
      const size = eventList.push(eventEnt);
      console.log("Size of array now " + size);
    });
    setEntries(eventList);
    return null;
 }

  const search = async() : Promise<Event | null > => {
    const eventsCollectionRef = collection(db, 'events');

    if(regions != null) {
      const q = query(eventsCollectionRef, where("regionIds", "array-contains", regions));
      //, where("tags", "array-contains", tags), where("content", "array-contains", eventDesc)
      
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
    };

    return null;
  }

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
        <IonButton expand="block" onClick={search}>Search</IonButton>
        <IonButton expand="block" onClick={getData}>Get</IonButton>
        <IonList>
          {events.map((eventEntry) =>
            <IonItem button key={eventEntry.id}
              routerLink={`/my/entries/view/${eventEntry.id}`}>
          
          <IonLabel>
                <h2>{eventEntry.description}</h2></IonLabel>

                <IonLabel> 
                <h3>{eventEntry.tags}</h3></IonLabel>
                <IonLabel>
                <h3>{eventEntry.regions}</h3>
              </IonLabel>
            </IonItem>
          )}
        </IonList>
    </IonContent>
    <IonContent className="ion-padding">
        <h2>{eventEntry?.description}</h2>
        <p>{eventEntry?.tags}</p>
        <p>{eventEntry?.regions}</p>
      </IonContent>
    
  </IonPage>
);
  };

export default withAuth(Home);
const db = getFirestore();
const app = firebaseApp;

