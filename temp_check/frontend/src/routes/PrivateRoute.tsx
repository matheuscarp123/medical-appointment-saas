import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box, Typography, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { auth } from '../config/firebase';
import { checkUserAccess, createPaymentLink } from '../services/authService';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyAccess = async () => {
      console.log('Verificando acesso privado para:', user?.email);
      
      if (!user || !user.email) {
        setIsVerifying(false);
        return;
      }

      try {
        // Verificar se é o email com acesso especial
        const specialEmail = 'matheuscontato.c@gmail.com';
        const isSpecialEmail = user.email.toLowerCase() === specialEmail.toLowerCase();
        
        if (isSpecialEmail) {
          console.log('Email especial detectado, acesso garantido');
          setIsVerifying(false);
          return;
        }

        // Verificar se o usuário tem acesso via pagamento
        if (user.paymentStatus === 'paid') {
          console.log('Usuário com pagamento confirmado, acesso garantido');
          setIsVerifying(false);
          return;
        }

        // Se chegou aqui, verificar novamente o status de pagamento
        console.log('Verificando status de pagamento em tempo real...');
        const hasAccess = await checkUserAccess(user.email);
        
        if (!hasAccess) {
          console.log('Acesso negado, redirecionando para pagamento');
          const paymentLink = await createPaymentLink(user.email);
          window.location.href = paymentLink;
          return;
        }

        console.log('Acesso confirmado após verificação');
        setIsVerifying(false);
      } catch (error: any) {
        console.error('Erro ao verificar acesso:', error);
        setError('Erro ao verificar seu acesso. Por favor, tente novamente.');
        setIsVerifying(false);
      }
    };

    if (!loading) {
      verifyAccess();
    }
  }, [user, loading]);

  if (loading || isVerifying) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: 2
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="textSecondary">
          Verificando autenticação...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: 3
        }}
      >
        <Alert severity="error" sx={{ width: '100%', maxWidth: 500, mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
          Por favor, tente fazer login novamente.
        </Typography>
      </Box>
    );
  }

  if (!user) {
    // Redirecionar para a página de login, preservando a URL desejada para redirecionamento após o login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Usuário autenticado e com acesso, renderizar o conteúdo
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default PrivateRoute;
