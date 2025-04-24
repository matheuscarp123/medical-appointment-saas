import { defineConfig } from 'cypress';
import * as firebase from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    setupNodeEvents(on, config) {
      // Configuração para autenticação com cypress-firebase
      on('task', {
        async 'db:seed'() {
          // Função para semear o banco de dados de teste
          return null;
        },
        
        // Inicializar o Firebase Admin para testes
        async 'firebase:auth:signIn'({ email, password }) {
          try {
            // Importar a configuração do Firebase
            const firebaseConfig = {
              apiKey: process.env.FIREBASE_API_KEY,
              authDomain: process.env.FIREBASE_AUTH_DOMAIN,
              projectId: process.env.FIREBASE_PROJECT_ID,
              storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
              messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
              appId: process.env.FIREBASE_APP_ID
            };
            
            // Inicializar o Firebase apenas uma vez
            const firebaseApp = firebase.initializeApp(firebaseConfig);
            const auth = firebaseAuth.getAuth(firebaseApp);
            
            // Fazer login
            const signInResult = await firebaseAuth.signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            
            // Obter token para usar como cookie
            const token = await signInResult.user.getIdToken();
            return { token, user: signInResult.user };
          } catch (error) {
            console.error('Erro ao fazer login:', error);
            return null;
          }
        }
      });
      
      return config;
    },
  },
  
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
  },
  
  env: {
    apiUrl: 'http://localhost:3000/api',
    testEnv: true,
  },
  
  viewportWidth: 1280,
  viewportHeight: 720,
  
  // Definindo tempos de espera
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
}); 