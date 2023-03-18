// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD5w2nnPeFzwK9L-d2D4lrwD8IMsksENj4",
    authDomain: "map-compare-f9233.firebaseapp.com",
    projectId: "map-compare-f9233",
    storageBucket: "map-compare-f9233.appspot.com",
    messagingSenderId: "67341305393",
    appId: "1:67341305393:web:cffbb0b6756032121c3710",
    measurementId: "G-XFW4PG8KRW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);