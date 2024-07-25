import { initializeApp } from 'firebase/app'

import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDW26YK9fh3B7Nx0FjDX0bWrIWWqCZhseU",
    authDomain: "creche2-cc099.firebaseapp.com",
    projectId: "creche2-cc099",
    storageBucket: "creche2-cc099.appspot.com",
    messagingSenderId: "354439772531",
    appId: "1:354439772531:web:14610901854db27adfed06"
}

const initializeFirebase = initializeApp(firebaseConfig)

const db = getFirestore(initializeFirebase)
const auth = getAuth(initializeFirebase)
const storage = getStorage(initializeFirebase)

export { db, auth, storage }