import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  browserLocalPersistence, 
  setPersistence,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBj9WjbEiAD5pZaLqoE-Z-K1zKRF-OriD4",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "medical-appointment-saas.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "medical-appointment-saas",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "medical-appointment-saas.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1094136023505",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:1094136023505:web:23bea7e0722a9ce81be3e1",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-WG49YMNRNY"
};

// Log da configuração utilizada
console.log('Carregando Firebase com configuração:', { 
  apiKey: firebaseConfig.apiKey?.substring(0, 5) + '...',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId
});

// Verificar se a configuração mínima está disponível
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
  throw new Error('Configuração do Firebase incompleta. Verifique as variáveis de ambiente.');
}

// Inicializar Firebase, garantindo que apenas uma instância seja criada
let firebaseApp;
if (!getApps().length) {
  console.log('Inicializando nova instância do Firebase');
  firebaseApp = initializeApp(firebaseConfig);
} else {
  console.log('Usando instância existente do Firebase');
  firebaseApp = getApp();
}

// Configuração de serviços Firebase
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const analytics = getAnalytics(firebaseApp);

// Configuração do provedor Google
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ 
  prompt: 'select_account',
  login_hint: 'matheuscontato.c@gmail.com'
});
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

// Configurar persistência
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Persistência de autenticação configurada com sucesso');
  })
  .catch((error) => {
    console.error('Erro ao configurar persistência:', error);
  });

// Monitorar estado de autenticação
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Usuário logado:', { 
      uid: user.uid, 
      email: user.email,
      displayName: user.displayName
    });
  } else {
    console.log('Usuário deslogado');
  }
});

// Exportação dos serviços
export { firebaseApp as app, auth, db, storage, googleProvider, analytics };

// Interface para dados do usuário
export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}