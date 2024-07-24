import { initializeApp } from 'firebase/app'

import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCqguX-z7ojmdGz-q6RRWUzA1gITv7IhrI",
    authDomain: "creche-e443b.firebaseapp.com",
    projectId: "creche-e443b",
    storageBucket: "creche-e443b.appspot.com",
    messagingSenderId: "254007847017",
    appId: "1:254007847017:web:6adfc45688a28318041af8",
    measurementId: "G-NR04PCGMRR"
};

const initializeFirebase = initializeApp(firebaseConfig)

const db = getFirestore(initializeFirebase)
const auth = getAuth(initializeFirebase)
const storage = getStorage(initializeFirebase)

export { db, auth, storage }