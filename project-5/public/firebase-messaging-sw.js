// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts("https://www.gstatic.com/firebasejs/9.9.4/firebase-app-compat.js");
// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')
importScripts("https://www.gstatic.com/firebasejs/9.9.4/firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyBYd_XwrH9nJZvl3rch8Yhw59GmaxDTTs8",
    authDomain: "talkodbackendweb.firebaseapp.com",
    projectId: "talkodbackendweb",
    storageBucket: "talkodbackendweb.appspot.com",
    messagingSenderId: "162148005192",
    appId: "1:162148005192:web:7f6e17346eb417cbacef7d",
};

// const firebaseConfig = {
//     apiKey: "AIzaSyCxYK9Mu9WizBTpCh9WW6pq2dCXPDNOz7E",
//     authDomain: "testweb-ee700.firebaseapp.com",
//     projectId: "testweb-ee700",
//     storageBucket: "testweb-ee700.appspot.com",
//     messagingSenderId: "1023216795133",
//     appId: "1:1023216795133:web:e6eed28abda4ba51c8ed94"
// };

const firebaseApp = firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging(firebaseApp);

messaging.onBackgroundMessage((payLoad) => {
    console.log("背景", payLoad);
    const title = payLoad.data.Title;
    const body = payLoad.data.Body;
    const image = payLoad.data.image;
    console.log("背景 self", self);
    self.registration.showNotification(title, { body, icon: image });
});

// messaging.onBackgroundMessage(({ notification: { title, body } }) => {
//     console.log('背景', title, body)
//     // self.registration.showNotification(title, { body, icon: image || '../src/assets/logo.png' });
// })

// const isSupported = firebase.messaging.isSupported();
// if (isSupported) {
//     const messaging = firebase.messaging();
//     // messaging.onBackgroundMessage((payLoad) => {
//     //     // console.log(payLoad);
//     // });
//     // messaging.onBackgroundMessage(({ notification: { title, body, image } }) => {
//     //     console.log(title);
//     //     registration.showNotification(title, { body, icon: image || '/assets/icons/icon-72x72.png' });
//     // });
// }
