import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { auth } from '../config/firebase';
import { checkUserAccess, createPaymentLink } from '../services/authService';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthProps {
  children: React.ReactNode;
}

const Auth: React.FC<AuthProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Auth component mounted');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? `User logged in: ${user.email}` : 'No user logged in');
      
      if (!user || !user.email) {
        console.log('No user or email, redirecting to login');
        setIsChecking(false);
        navigate('/');
        return;
      }

      try {
        console.log('Checking user access for:', user.email);
        
        // Verificar se é o email com acesso especial (incluindo variações de capitalização)
        const specialEmail = 'matheuscontato.c@gmail.com';
        const userEmail = user.email.toLowerCase();
        const isSpecialEmail = userEmail === specialEmail.toLowerCase();
        
        if (isSpecialEmail) {
          console.log('Email especial detectado:', user.email);
          console.log('Acesso especial concedido automaticamente');
          setIsChecking(false);
          return;
        }

        // Para outros usuários, verificar pagamento
        console.log('Email não é especial, verificando pagamento...');
        const hasAccess = await checkUserAccess(user.email);
        console.log('Resultado da verificação de acesso:', hasAccess ? 'Acesso permitido' : 'Acesso negado');
        
        if (!hasAccess) {
          console.log('Usuário sem acesso, redirecionando para pagamento');
          try {
            const paymentLink = await createPaymentLink(user.email);
            console.log('Link de pagamento gerado:', paymentLink);
            window.location.href = paymentLink;
          } catch (paymentError) {
            console.error('Erro ao gerar link de pagamento:', paymentError);
            setError('Não foi possível gerar o link de pagamento. Por favor, tente novamente.');
            setTimeout(() => navigate('/'), 3000);
          }
          return;
        }

        console.log('Acesso confirmado para o usuário');
        setIsChecking(false);
      } catch (error: any) {
        console.error('Erro ao verificar autenticação:', error);
        setError(error.message || 'Erro ao verificar autenticação. Por favor, tente novamente.');
        setTimeout(() => {
          console.log('Redirecionando para login após erro');
          navigate('/');
        }, 3000);
      }
    });

    return () => {
      console.log('Auth component unmounted, unsubscribing from auth state changes');
      unsubscribe();
    };
  }, [navigate]);

  if (isChecking) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography variant="body1" color="textSecondary">
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
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 2
        }}
      >
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export default Auth;
