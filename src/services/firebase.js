import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCoPRlQs_JnJyc072op5VMEG1BvJY7Kp1w",
    authDomain: "instagram-clone-react-81d5d.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-81d5d.firebaseio.com",
    projectId: "instagram-clone-react-81d5d",
    storageBucket: "instagram-clone-react-81d5d.appspot.com",
    messagingSenderId: "713883017397",
    appId: "1:713883017397:web:b5117a9f8d142249599efc",
    measurementId: "G-SFVH0NG6N4",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
