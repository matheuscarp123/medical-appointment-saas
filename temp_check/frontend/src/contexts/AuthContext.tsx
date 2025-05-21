import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import { User } from '../types/entities';
import { getUserByEmail } from '../services/userService';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  hasPermission: (requiredRoles: string[]) => boolean;
  isAdmin: () => boolean;
  isDoctor: () => boolean;
  isPatient: () => boolean;
  isReceptionist: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser?.email) {
        try {
          const userData = await getUserByEmail(firebaseUser.email);
          setUser(userData);
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  // Verificar se o usuário tem uma das permissões necessárias
  const hasPermission = (requiredRoles: string[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  // Funções específicas de verificação de papéis
  const isAdmin = (): boolean => {
    if (!user) return false;
    return user.role === 'admin';
  };

  const isDoctor = (): boolean => {
    if (!user) return false;
    return user.role === 'doctor';
  };

  const isPatient = (): boolean => {
    if (!user) return false;
    return user.role === 'patient';
  };

  const isReceptionist = (): boolean => {
    if (!user) return false;
    return user.role === 'receptionist';
  };

  const value = {
    user,
    firebaseUser,
    loading,
    login,
    logout,
    setUser,
    hasPermission,
    isAdmin,
    isDoctor,
    isPatient,
    isReceptionist
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};