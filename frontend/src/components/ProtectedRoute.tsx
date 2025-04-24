import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { CircularProgress, Box } from '@mui/material';
import type { UserData } from '../config/firebase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresSubscription = true 
}) => {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string>('/');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        console.log('Usuário não autenticado, redirecionando para login');
        setLoading(false);
        setHasAccess(false);
        setRedirectPath('/login');
        return;
      }

      // Verificar se é o email especial que tem acesso garantido
      const isSpecialEmail = user.email?.toLowerCase() === 'matheuscontato.c@gmail.com';
      
      if (isSpecialEmail) {
        console.log('Email especial detectado, concedendo acesso total');
        setHasAccess(true);
        setLoading(false);
        return;
      }

      if (requiresSubscription) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            console.error('Documento do usuário não encontrado');
            setHasAccess(false);
            setRedirectPath('/payment');
            setLoading(false);
            return;
          }
          
          const userData = userDoc.data() as UserData;
          
          console.log('Status de pagamento:', userData?.paymentStatus);
          console.log('Função do usuário:', userData?.role);
          
          if (userData?.role === 'admin' || userData?.paymentStatus === 'paid') {
            console.log('Acesso concedido: admin ou pagamento confirmado');
            setHasAccess(true);
          } else {
            console.log('Acesso negado: não é admin e pagamento não confirmado');
            setHasAccess(false);
            setRedirectPath('/payment');
          }
        } catch (error) {
          console.error('Erro ao verificar acesso do usuário:', error);
          setHasAccess(false);
          setRedirectPath('/payment?error=access_check');
        }
      } else {
        // Rotas que não requerem assinatura
        setHasAccess(true);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [requiresSubscription]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{
          background: `linear-gradient(rgba(200, 220, 245, 0.7), rgba(190, 215, 240, 0.65))`,
          backdropFilter: 'blur(8px)'
        }}
      >
        <CircularProgress color="primary" size={60} thickness={4} />
      </Box>
    );
  }

  if (!hasAccess) {
    console.log(`Redirecionando para: ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
