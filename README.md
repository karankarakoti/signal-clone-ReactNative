## Firebase 
Create a file named firebase.js in src directory and add your credentials over there initialize firebaseapp and export

import firebase from 'firebase'

const firebaseConfig = {
    your credentials
};

let app;

if(firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig)
}else{
    app = firebase.app()
}

const db = app.firestore()
const auth = firebase.auth()

export default firebase
export { db, auth}