import { firebase } from '@firebase/app';
import '@firebase/firestore'
import '@firebase/auth';



const firebaseConfig = {
  apiKey: "AIzaSyDx_ETfPCZ2PkeJQnw-pthQgvCYhlyLNZA",
  authDomain: "ryckymorty-e46bb.firebaseapp.com",
  projectId: "ryckymorty-e46bb",
  storageBucket: "ryckymorty-e46bb.appspot.com",
  messagingSenderId: "323108275658",
  appId: "1:323108275658:web:11a677a1d37deee4ddbb33",
  measurementId: "G-KG9F6S1L9T"
};


firebase.initializeApp(firebaseConfig);

let db= firebase.firestore().collection("favs")

export function getFavs(uid){
  return db.doc(uid).get()
    .then(snap=>{
      return snap.data().array
    })
}

export function updateDB(array,uid) {
  db.doc(uid).set({array})
}

export function singOutGoogle(){
  firebase.auth().signOut()
}

export function loginWithGoogle(){
    let provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider)
        .then(snap=>snap.user)
}