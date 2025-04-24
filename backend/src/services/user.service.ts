import { adminAuth, adminFirestore } from '../config/firebase-admin';
import { User } from '../types/entities';
import { ApiErrorHandler } from '../middlewares/error.middleware';
import { v4 as uuidv4 } from 'uuid';

const userCollection = adminFirestore.collection('users');

export const createUser = async (userData: Partial<User>): Promise<User> => {
  try {
    const timestamp = new Date().toISOString();
    
    const newUser: User = {
      id: uuidv4(),
      email: userData.email!,
      name: userData.name || '',
      photoURL: userData.photoURL || '',
      role: userData.role || 'patient',
      status: 'active',
      createdAt: timestamp,
      updatedAt: timestamp,
      lastLogin: timestamp,
      phoneNumber: userData.phoneNumber || '',
      notificationSettings: {
        email: true,
        sms: false,
        push: true,
        reminderTimeBeforeAppointment: 60
      }
    };

    await userCollection.doc(newUser.id).set(newUser);
    
    console.log(`Usuário criado com sucesso: ${newUser.id}`);
    return newUser;
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error);
    throw new ApiErrorHandler(
      `Erro ao criar usuário: ${error.message}`,
      500,
      'USER_CREATION_ERROR'
    );
  }
};

export const getUserById = async (userId: string): Promise<User> => {
  try {
    const userDoc = await userCollection.doc(userId).get();
    
    if (!userDoc.exists) {
      throw new ApiErrorHandler(
        'Usuário não encontrado',
        404,
        'USER_NOT_FOUND'
      );
    }
    
    return userDoc.data() as User;
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao buscar usuário por ID:', error);
    throw new ApiErrorHandler(
      `Erro ao buscar usuário: ${error.message}`,
      500,
      'USER_FETCH_ERROR'
    );
  }
};

export const getUserByEmail = async (email: string): Promise<User> => {
  try {
    const usersSnapshot = await userCollection
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (usersSnapshot.empty) {
      throw new ApiErrorHandler(
        'Usuário não encontrado',
        404,
        'USER_NOT_FOUND'
      );
    }
    
    return usersSnapshot.docs[0].data() as User;
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao buscar usuário por email:', error);
    throw new ApiErrorHandler(
      `Erro ao buscar usuário: ${error.message}`,
      500,
      'USER_FETCH_ERROR'
    );
  }
};

export const updateUser = async (
  userId: string,
  userData: Partial<User>
): Promise<User> => {
  try {
    const userDoc = await userCollection.doc(userId).get();
    
    if (!userDoc.exists) {
      throw new ApiErrorHandler(
        'Usuário não encontrado',
        404,
        'USER_NOT_FOUND'
      );
    }
    
    const updatedUser = {
      ...userDoc.data(),
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    await userCollection.doc(userId).update(updatedUser);
    
    return updatedUser as User;
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao atualizar usuário:', error);
    throw new ApiErrorHandler(
      `Erro ao atualizar usuário: ${error.message}`,
      500,
      'USER_UPDATE_ERROR'
    );
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const userDoc = await userCollection.doc(userId).get();
    
    if (!userDoc.exists) {
      throw new ApiErrorHandler(
        'Usuário não encontrado',
        404,
        'USER_NOT_FOUND'
      );
    }
    
    const userData = userDoc.data() as User;
    
    // Deletar usuário no Firebase Auth
    try {
      const userRecord = await adminAuth.getUserByEmail(userData.email);
      await adminAuth.deleteUser(userRecord.uid);
    } catch (error) {
      console.error('Erro ao deletar usuário no Firebase Auth:', error);
      // Continuar mesmo com erro no Firebase Auth
    }
    
    // Desativar o usuário no Firestore em vez de deletar permanentemente
    await userCollection.doc(userId).update({
      status: 'inactive',
      updatedAt: new Date().toISOString()
    });
    
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao deletar usuário:', error);
    throw new ApiErrorHandler(
      `Erro ao deletar usuário: ${error.message}`,
      500,
      'USER_DELETE_ERROR'
    );
  }
};

export const getAllUsers = async (role?: string): Promise<User[]> => {
  try {
    let query = userCollection.where('status', '==', 'active');
    
    if (role) {
      query = query.where('role', '==', role);
    }
    
    const usersSnapshot = await query.get();
    
    return usersSnapshot.docs.map(doc => doc.data() as User);
  } catch (error: any) {
    console.error('Erro ao buscar todos os usuários:', error);
    throw new ApiErrorHandler(
      `Erro ao buscar usuários: ${error.message}`,
      500,
      'USERS_FETCH_ERROR'
    );
  }
};
