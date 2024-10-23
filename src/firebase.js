// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDkkPk-59tJTRKl4N0HvqtrQmDmeugoDXA',
  authDomain: 'depot-es-ambo.firebaseapp.com',
  projectId: 'depot-es-ambo',
  storageBucket: 'depot-es-ambo.appspot.com',
  messagingSenderId: '545687064222',
  appId: '1:545687064222:web:77cd36b359a1a76d43358f',
  measurementId: 'G-5KCSZTCV6J',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

window.auth = auth;
