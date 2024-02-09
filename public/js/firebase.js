// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXRdOuuBPG_wClOAToLRkHuJDMuuae1I8",
  authDomain: "guts-69f13.firebaseapp.com",
  projectId: "guts-69f13",
  storageBucket: "guts-69f13.appspot.com",
  messagingSenderId: "392222533387",
  appId: "1:392222533387:web:aafab92c7d4d1472ffe40e",
  measurementId: "G-48M89LS3FK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);