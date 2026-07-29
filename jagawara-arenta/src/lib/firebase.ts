import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDOkcTideSN4lTS5V31c57v7_bVzZ_aQxQ",
  authDomain: "web-jagawara-arenta-26.firebaseapp.com",
  projectId: "web-jagawara-arenta-26",
  storageBucket: "web-jagawara-arenta-26.firebasestorage.app",
  messagingSenderId: "73580441803",
  appId: "1:73580441803:web:215a2b2b3e9196018bab4e"
};

const app = initializeApp(firebaseConfig);
let messaging: any = null;
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            messaging = getMessaging(app);
        }
    });
}

export { messaging, getToken, onMessage };