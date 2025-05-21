import { 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  getIdToken
} from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types/entities';

const usersRef = collection(db, 'users');

/**
 * Obtém o usuário atual do Firebase
 */
export const getCurrentFirebaseUser = () => {
  return auth.currentUser;
};

/**
 * Obtém o token atual do usuário
 */
export const getCurrentUserToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    const token = await getIdToken(user, true);
    return token;
  } catch (error) {
    console.error('Erro ao obter token:', error);
    return null;
  }
};

/**
 * Verifica se o token está expirado
 */
export const isTokenExpired = async (): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) return true;
  
  try {
    // Força a renovação do token se estiver expirado
    await getIdToken(user, true);
    return false;
  } catch (error) {
    console.error('Erro ao verificar expiração do token:', error);
    return true;
  }
};

/**
 * Login com Google
 */
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
      login_hint: 'matheuscontato.c@gmail.com'
    });
    
    // Força a renovação do token
    const userCredential = await signInWithPopup(auth, provider);
    const firebaseUser = userCredential.user;
    
    if (!firebaseUser.email) {
      throw new Error('Email não disponível após autenticação com Google');
    }
    
    // Verificar se usuário já existe no Firestore
    const q = query(usersRef, where('email', '==', firebaseUser.email));
    const querySnapshot = await getDocs(q);
    
    let userId: string;
    let userData: any;
    
    if (querySnapshot.empty) {
      // Criar novo usuário no Firestore
      const newUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || '',
        role: 'patient',
        photoURL: firebaseUser.photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        status: 'active',
        paymentStatus: 'pending'
      };
      
      const docRef = await addDoc(usersRef, newUser);
      userId = docRef.id;
      userData = newUser;
    } else {
      // Atualizar dados do usuário existente
      userId = querySnapshot.docs[0].id;
      userData = querySnapshot.docs[0].data();
      
      const userDocRef = doc(usersRef, userId);
      await setDoc(userDocRef, {
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp(),
        email: firebaseUser.email,
        name: firebaseUser.displayName || userData.name,
        photoURL: firebaseUser.photoURL || userData.photoURL
      }, { merge: true });
    }
    
    return {
      id: userId,
      ...userData,
      email: firebaseUser.email
    };
  } catch (error) {
    console.error('Erro durante login com Google:', error);
    throw new Error('Falha ao fazer login com Google. Por favor, tente novamente.');
  }
};

/**
 * Cria um link de pagamento para o usuário
 */
export const createPaymentLink = async (email: string): Promise<string> => {
  try {
    // Aqui você implementaria a lógica para criar um link de pagamento
    // Por exemplo, usando Stripe ou outro serviço de pagamento
    return 'https://seu-servico-de-pagamento.com/payment';
  } catch (error) {
    console.error('Erro ao criar link de pagamento:', error);
    throw new Error('Erro ao criar link de pagamento');
  }
};

/**
 * Logout
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw new Error('Erro ao fazer logout');
  }
};