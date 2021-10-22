import firebase from 'firebase/app';
import * as firestore from '@firebase/firestore';

export interface Event {
  id: string;
  date: string;
  title: string;
  pictureUrl: string;
  description: string;
}

export function toEntry(doc: firestore.DocumentSnapshot): Event {
  return { id: doc.id, ...doc.data() } as Event;
}
