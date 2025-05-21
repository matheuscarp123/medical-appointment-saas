import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  type User,
  type UserCredential 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc,
  type DocumentData,
  type DocumentReference 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDjH_sEYATXIPjNH-ylQh-9xMwZIUGZ9gE",
  authDomain: "mediflow-fa8bd.firebaseapp.com",
  projectId: "mediflow-fa8bd",
  storageBucket: "mediflow-fa8bd.firebasestorage.app",
  messagingSenderId: "393894556791",
  appId: "1:393894556791:web:a72047c4bb877d25e5c272",
  measurementId: "G-WG49YMNRNY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Constants
export const MASTER_EMAIL = 'matheuscontato.c@gmail.com';

// Types
export interface UserData {
  email: string | null;
  name: string | null;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin: string;
  subscriptionStatus: 'active' | 'pending';
}

export interface SignInResult {
  type: 'admin' | 'existing_user' | 'new_user';
  status?: 'active' | 'pending';
}

// Helper Functions
const createUserDocument = async (
  userRef: DocumentReference,
  user: User,
  role: 'admin' | 'user' = 'user',
  subscriptionStatus: 'active' | 'pending' = 'pending'
): Promise<void> => {
  await setDoc(userRef, {
    email: user.email,
    name: user.displayName,
    role,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    subscriptionStatus
  }, { merge: true });
};

// Main Functions
export const signInWithGoogle = async (): Promise<SignInResult> => {
  try {
    const result: UserCredential = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const userRef = doc(db, 'users', user.uid);

    if (user.email === MASTER_EMAIL) {
      await createUserDocument(userRef, user, 'admin', 'active');
      return { type: 'admin' };
    }

    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserData;
      await setDoc(userRef, {
        lastLogin: new Date().toISOString()
      }, { merge: true });
      
      return { 
        type: 'existing_user', 
        status: userData.subscriptionStatus
      };
    }

    await createUserDocument(userRef, user);
    return { type: 'new_user' };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Payment and Access Control
export const createPaymentLink = async (): Promise<string> => {
  // TODO: Implement real Stripe integration
  return '/payment-success';
};

export const checkUserAccess = async (userId: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data() as UserData;
    return userData?.role === 'admin' || userData?.subscriptionStatus === 'active';
  } catch (error) {
    console.error('Error checking user access:', error);
    return false;
  }
};

export default app;