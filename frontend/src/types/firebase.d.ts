import { User as FirebaseUser } from 'firebase/auth';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

declare module 'firebase' {
  export * from '@firebase/app';
  export * from '@firebase/auth';
  export * from '@firebase/firestore';
  export * from '@firebase/functions';
  export * from '@firebase/analytics';
}

declare module '@firebase/app' {
  export interface FirebaseApp {}
  export function initializeApp(config: any): FirebaseApp;
  export function getApp(): FirebaseApp;
}

declare module '@firebase/auth' {
  export interface User extends FirebaseUser {
    uid: string;
  }
  export interface Auth {}
  export function getAuth(): Auth;
  export function signInWithPopup(auth: Auth, provider: any): Promise<any>;
  export function GoogleAuthProvider(): any;
}

declare module '@firebase/firestore' {
  export interface Firestore {}
  export function getFirestore(): Firestore;
  export function collection(firestore: Firestore, path: string): any;
  export function doc(firestore: Firestore, path: string): any;
  export function getDoc(docRef: any): Promise<any>;
  export function setDoc(docRef: any, data: any): Promise<void>;
  export interface QueryDocumentSnapshot<T = DocumentData> {
    id: string;
    data(): T;
    exists(): boolean;
  }
}

declare module '@firebase/functions' {
  export interface Functions {}
  export function getFunctions(): Functions;
  export function httpsCallable(functions: Functions, name: string): Function;
}

declare module '@firebase/analytics' {
  export interface Analytics {}
  export function getAnalytics(app: any): Analytics;
  export function logEvent(analytics: Analytics, name: string, params?: any): void;
} 