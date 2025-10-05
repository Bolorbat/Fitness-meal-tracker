// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import {initializeAuth, getReactNativePersistence} from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAV_Ia26XYpP5kR1n2EARUr10egQNB-bjs",
    authDomain: "fittly-ef299.firebaseapp.com",
    projectId: "fittly-ef299",
    storageBucket: "fittly-ef299.firebasestorage.app",
    messagingSenderId: "321341679216",
    appId: "1:321341679216:web:95ba9dd5d18add298ab6b5",
    measurementId: "G-13CM7R6S3T"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize auth
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize db
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
