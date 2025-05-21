import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, deleteDoc, Timestamp, DocumentData } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types/entities';

export interface DBUser {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'admin' | 'doctor';
  photoURL: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLogin?: Timestamp;
  status?: 'active' | 'inactive';
  paymentStatus?: 'pending' | 'paid' | 'failed';
}

const COLLECTION = 'users';
const usersCollection = collection(db, COLLECTION);

// Função para converter DBUser para User
export const convertDBUserToUser = (dbUser: DBUser): User => {
  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role,
    photoURL: dbUser.photoURL,
    createdAt: dbUser.createdAt.toDate(),
    updatedAt: dbUser.updatedAt.toDate(),
    lastLogin: dbUser.lastLogin?.toDate() || new Date(),
    status: dbUser.status || 'active',
    paymentStatus: dbUser.paymentStatus || 'pending'
  };
};

export const createUser = async (user: Omit<User, 'id'>): Promise<string> => {
  try {
    const dbUser: Omit<DBUser, 'id'> = {
      email: user.email,
      name: user.name,
      role: user.role,
      photoURL: user.photoURL || '',
      createdAt: Timestamp.fromDate(user.createdAt),
      updatedAt: Timestamp.fromDate(user.updatedAt),
      lastLogin: Timestamp.fromDate(user.lastLogin),
      status: user.status
    };
    
    const docRef = await addDoc(usersCollection, dbUser);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw new Error('Falha ao criar usuário. Por favor, tente novamente.');
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    // Verificar se o email está definido
    if (!email) {
      console.error('Email não fornecido para getUserByEmail');
      return null;
    }

    console.log('Buscando usuário por email:', email);
    
    const q = query(usersCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('Usuário não encontrado para o email:', email);
      return null;
    }

    const docData = querySnapshot.docs[0].data() as DocumentData;
    console.log('Dados do usuário encontrados:', docData);
    
    // Construir o objeto dbUser com validações para cada campo
    const dbUser: DBUser = {
      id: querySnapshot.docs[0].id,
      email: docData.email || email, // Usar email da query se o do documento não estiver definido
      name: docData.name || 'Usuário',
      role: docData.role || 'patient',
      photoURL: docData.photoURL || '',
      createdAt: docData.createdAt || Timestamp.now(),
      updatedAt: docData.updatedAt || Timestamp.now(),
      lastLogin: docData.lastLogin || Timestamp.now(),
      status: docData.status || 'active',
      paymentStatus: docData.paymentStatus || 'pending'
    };
    
    console.log('Objeto dbUser montado com sucesso:', dbUser);
    
    // Converter para o formato User
    const user = convertDBUserToUser(dbUser);
    console.log('Conversão para User concluída:', user);
    
    return user;
  } catch (error) {
    console.error('Erro ao buscar usuário por email:', error);
    // Adicionar mais detalhes ao erro para facilitar depuração
    if (error instanceof Error) {
      throw new Error(`Falha ao buscar usuário: ${error.message}`);
    }
    throw new Error('Falha ao buscar usuário. Por favor, tente novamente.');
  }
};

export const getUserById = async (id: string): Promise<DBUser | null> => {
  try {
    const docRef = doc(usersCollection, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const docData = docSnap.data() as DocumentData;
    return {
      id: docSnap.id,
      email: docData.email,
      name: docData.name,
      role: docData.role,
      photoURL: docData.photoURL,
      createdAt: docData.createdAt,
      updatedAt: docData.updatedAt,
      lastLogin: docData.lastLogin,
      status: docData.status
    };
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw new Error('Falha ao buscar usuário. Por favor, tente novamente.');
  }
};

export const updateUser = async (id: string, updates: Partial<DBUser>): Promise<void> => {
  try {
    const docRef = doc(usersCollection, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw new Error('Falha ao atualizar usuário. Por favor, tente novamente.');
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    const docRef = doc(usersCollection, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw new Error('Falha ao deletar usuário. Por favor, tente novamente.');
  }
};

export const searchUsers = async (searchTerm: string): Promise<DBUser[]> => {
  try {
    const q = query(usersCollection, where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const docData = doc.data() as DocumentData;
      return {
        id: doc.id,
        email: docData.email,
        name: docData.name,
        role: docData.role,
        photoURL: docData.photoURL,
        createdAt: docData.createdAt,
        updatedAt: docData.updatedAt,
        lastLogin: docData.lastLogin,
        status: docData.status
      };
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw new Error('Falha ao buscar usuários. Por favor, tente novamente.');
  }
};

export const getUsersByRole = async (role: DBUser['role']): Promise<DBUser[]> => {
  try {
    const q = query(usersCollection, where('role', '==', role));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
      const docData = doc.data() as DocumentData;
      return {
        id: doc.id,
        email: docData.email,
        name: docData.name,
        role: docData.role,
        photoURL: docData.photoURL,
        createdAt: docData.createdAt,
        updatedAt: docData.updatedAt,
        lastLogin: docData.lastLogin,
        status: docData.status
      };
    });
  } catch (error) {
    console.error('Erro ao buscar usuários por função:', error);
    throw new Error('Falha ao buscar usuários. Por favor, tente novamente.');
  }
};

export const updateLastLogin = async (id: string): Promise<void> => {
  try {
    const docRef = doc(usersCollection, id);
    await updateDoc(docRef, {
      lastLogin: Timestamp.now()
    });
  } catch (error) {
    console.error('Erro ao atualizar último login:', error);
    throw new Error('Falha ao atualizar último login. Por favor, tente novamente.');
  }
};