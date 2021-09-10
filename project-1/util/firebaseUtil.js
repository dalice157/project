import firebase from 'firebase/app';
import '@firebase/messaging';
import config from '../config/config';

console.log('firebase:', config.firebase);

const firebaseConfig = {
  messagingSenderId: config.firebase.message_sender_id, // 884439017905
};

export const initFirebase = () => {
  if (firebase.messaging.isSupported()) {
    console.log('init firebase');
    firebase.initializeApp(firebaseConfig);
  } else {
    console.log('messaging not support');
  }
};
