import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use the provisioned database ID or default
const databaseId = firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== '(default)'
  ? firebaseConfigJson.firestoreDatabaseId
  : undefined;

export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Auth Functions
export async function loginWithFirebaseGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.warn('Google Popup Auth encountered issue, trying alternative flow:', error);
    // If popup was blocked or unsupported in iframe, fall back to anonymous session with google email metadata
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      const anonResult = await signInAnonymously(auth);
      return anonResult.user;
    }
    throw error;
  }
}

export async function loginWithFirebaseEmail(email: string, password: string, displayName?: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-login-credentials') {
      // Auto-register on first attempt if password is valid
      const createResult = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName && createResult.user) {
        await updateProfile(createResult.user, { displayName });
      }
      return createResult.user;
    }
    throw error;
  }
}

export async function registerWithFirebaseEmail(email: string, password: string, displayName?: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && result.user) {
    await updateProfile(result.user, { displayName });
  }
  return result.user;
}

export async function logoutFirebase() {
  return signOut(auth);
}

// User Document in Firestore
export interface FirestoreUserData {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  profileType: string;
  avatar?: string;
  stats?: {
    readingHours: number;
    materialsConverted: number;
    quizAverage: number;
    tactileDiagramsExplored: number;
  };
  updatedAt?: any;
  createdAt?: any;
}

export async function saveUserToFirestore(userData: FirestoreUserData) {
  try {
    const userRef = doc(db, 'users', userData.id);
    await setDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Error saving user to Firestore:', err);
    return false;
  }
}

export async function getUserFromFirestore(userId: string): Promise<FirestoreUserData | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as FirestoreUserData;
    }
    return null;
  } catch (err) {
    console.warn('Error reading user from Firestore:', err);
    return null;
  }
}

// Materials Document in Firestore
export async function saveMaterialToFirestore(material: any, userId?: string) {
  try {
    const matRef = doc(db, 'materials', material.id);
    await setDoc(matRef, {
      ...material,
      userId: userId || 'anonymous',
      updatedAt: serverTimestamp(),
      createdAt: material.dateAdded || new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Error saving material to Firestore:', err);
    return false;
  }
}

export async function getMaterialsFromFirestore(userId?: string): Promise<any[]> {
  try {
    const materialsCol = collection(db, 'materials');
    const snap = await getDocs(materialsCol);
    const results: any[] = [];
    snap.forEach((d) => {
      const data = d.data();
      if (!userId || data.userId === userId || data.userId === 'anonymous') {
        results.push({ id: d.id, ...data });
      }
    });
    return results;
  } catch (err) {
    console.warn('Error reading materials from Firestore:', err);
    return [];
  }
}

// User Settings in Firestore
export async function saveSettingsToFirestore(userId: string, settings: any) {
  try {
    const settingsRef = doc(db, 'userSettings', userId);
    await setDoc(settingsRef, {
      ...settings,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Error saving settings to Firestore:', err);
    return false;
  }
}

export async function getSettingsFromFirestore(userId: string): Promise<any | null> {
  try {
    const settingsRef = doc(db, 'userSettings', userId);
    const snap = await getDoc(settingsRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.warn('Error reading settings from Firestore:', err);
    return null;
  }
}
