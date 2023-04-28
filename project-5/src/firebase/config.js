import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBYd_XwrH9nJZvl3rch8Yhw59GmaxDTTs8",
  authDomain: "talkodbackendweb.firebaseapp.com",
  projectId: "talkodbackendweb",
  storageBucket: "talkodbackendweb.appspot.com",
  messagingSenderId: "162148005192",
  appId: "1:162148005192:web:7f6e17346eb417cbacef7d"
};



// const firebaseConfig = {
//   apiKey: "AIzaSyCxYK9Mu9WizBTpCh9WW6pq2dCXPDNOz7E",
//   authDomain: "testweb-ee700.firebaseapp.com",
//   projectId: "testweb-ee700",
//   storageBucket: "testweb-ee700.appspot.com",
//   messagingSenderId: "1023216795133",
//   appId: "1:1023216795133:web:e6eed28abda4ba51c8ed94"
// };

initializeApp(firebaseConfig)

const messaging = getMessaging()

export {
    messaging
}
// const fcmPublicKey = 'BAbr9GyZ2S-NcHo-NHKzprKYjLDqnKXW59b-QzcwXctYafs4_qb35YpCVoX8SXVWaOdp5Jte86tAPfMB0AegcPg';

// getToken(messaging, { vapidKey: fcmPublicKey }).then((currentToken) => {
//   if (currentToken) {
//     // Send the token to your server and update the UI if necessary
//     // ...
//   } else {
//     // Show permission request UI
//     console.log('No registration token available. Request permission to generate one.');
//     // ...
//   }
// }).catch((err) => {
//   console.log('An error occurred while retrieving token. ', err);
//   // ...
// });