// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import type { FirebaseOptions, FirebaseApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyDrfxACSBlVYGiT43kpLj_APQBo-0WjqxE',
  authDomain: 'localwire-cpad-a2-g6.firebaseapp.com',
  projectId: 'localwire-cpad-a2-g6',
  storageBucket: 'localwire-cpad-a2-g6.appspot.com',
  messagingSenderId: '538953225091',
  appId: '1:538953225091:web:b1ee8e402e72ab34105cb6',
  measurementId: 'G-2MR57RQTYH',
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

export { app };
