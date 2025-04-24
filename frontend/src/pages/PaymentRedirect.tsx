import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PaymentRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simular processamento do pagamento
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="h6">
        Processando seu pagamento...
      </Typography>
      <Typography color="text.secondary">
        Você será redirecionado em alguns instantes
      </Typography>
    </Box>
  );
};

export default PaymentRedirect; 