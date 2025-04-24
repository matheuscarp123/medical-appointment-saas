import * as admin from 'firebase-admin';

// Carregar variáveis de ambiente
require('dotenv').config();

const serviceAccount = {
  "type": "service_account",
  "project_id": "mediflow-fa8bd",
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  "client_email": "firebase-adminsdk-fbsvc@mediflow-fa8bd.iam.gserviceaccount.com",
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": `https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40mediflow-fa8bd.iam.gserviceaccount.com`
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    });
    console.log('Firebase Admin SDK inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar Firebase Admin SDK:', error);
  }
}

export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
export default admin;
