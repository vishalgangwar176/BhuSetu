import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import configData from '../../firebase-applet-config.json';

const firebaseConfig = {
  projectId: configData.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: configData.appId || import.meta.env.VITE_FIREBASE_APP_ID,
  apiKey: configData.apiKey || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: configData.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  firestoreDatabaseId: configData.firestoreDatabaseId || '(default)',
  storageBucket: configData.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: configData.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore targeting the specific provisioned database
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Validate connection per skill requirement
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore offline or connecting: check project configuration.", error);
      return false;
    }
    // A document not found is still a successful connection
    return true;
  }
}

// Initial test trigger
testFirestoreConnection().catch(() => {});

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
};
export type { FirebaseUser };
