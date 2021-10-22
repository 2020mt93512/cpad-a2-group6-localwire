import * as firebase from '@firebase/app';
import type { FirebaseOptions, FirebaseApp } from '@firebase/app';

const firebaseConfigOptions: FirebaseOptions = {
  apiKey: 'AIzaSyDrfxACSBlVYGiT43kpLj_APQBo-0WjqxE',
  authDomain: 'localwire-cpad-a2-g6.firebaseapp.com',
  projectId: 'localwire-cpad-a2-g6',
  storageBucket: 'localwire-cpad-a2-g6.appspot.com',
  messagingSenderId: '538953225091',
  appId: '1:538953225091:web:b1ee8e402e72ab34105cb6',
  measurementId: 'G-2MR57RQTYH',
  databaseURL: "https://localwire-cpad-a2-g6-default-rtdb.firebaseio.com",
};

const initializeFirebaseApp = (): FirebaseApp | null => {
  try {
    // check if firebase app is already initialized
    if (!firebase.getApps().length) {
      return firebase.initializeApp(firebaseConfigOptions);
    }
    // return the default app
    return firebase.getApp();
  } catch (err) {
    return null;
  }
};

const firebaseConfig = {
  initializeFirebaseApp,
};

export default firebaseConfig;
const app = firebase.initializeApp(firebaseConfigOptions);



