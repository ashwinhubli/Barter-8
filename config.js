import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyDRYyoR3vnzEU5QatxlJ_YSoEPKiIOANF0",
  authDomain: "barter-bd5b3.firebaseapp.com",
  databaseURL: "https://barter-bd5b3.firebaseio.com",
  projectId: "barter-bd5b3",
  storageBucket: "barter-bd5b3.appspot.com",
  messagingSenderId: "526520470274",
  appId: "1:526520470274:web:e85ce83266eba6d98f101b",
  measurementId: "G-39JMNT2VW2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
