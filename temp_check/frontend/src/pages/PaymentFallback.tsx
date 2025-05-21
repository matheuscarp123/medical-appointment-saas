import React, { useState } from 'react';
import { Box, Container, Typography, Button, Paper, TextField, Alert, CircularProgress } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPaymentLink } from '../services/stripeService';
import { useAuth } from '../contexts/AuthContext';

const PaymentFallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Verificar se há um erro específico na URL
  const searchParams = new URLSearchParams(location.search);
  const errorType = searchParams.get('error');

  const handleTryAgain = async () => {
    if (!email.trim()) {
      setError('Por favor, informe um email válido');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      if (user && user.email?.toLowerCase() === 'matheuscontato.c@gmail.com') {
        // Acesso especial
        navigate('/dashboard');
        return;
      }

      // Criar um link alternativo de pagamento
      const paymentLink = await createPaymentLink(email);
      setSuccess('Link de pagamento gerado com sucesso!');
      
      // Redirecionar para o link de pagamento após uma pequena pausa
      setTimeout(() => {
        window.location.href = paymentLink;
      }, 1500);
      
    } catch (err) {
      console.error('Erro ao gerar link de pagamento:', err);
      setError('Falha ao processar sua solicitação. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualAccess = () => {
    navigate('/payment');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(rgba(200, 220, 245, 0.7), rgba(190, 215, 240, 0.65)), url('/assets/medical-bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'soft-light',
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom color="primary.main" fontWeight="bold">
            Oops! Algo deu errado
          </Typography>
          
          <Typography variant="body1" paragraph color="text.secondary" sx={{ mb: 3 }}>
            Não foi possível processar seu pagamento. Isso pode ter ocorrido devido a uma 
            falha temporária ou porque a sessão expirou.
          </Typography>

          {errorType && (
            <Alert severity="info" sx={{ mb: 3 }}>
              {errorType === 'session_expired' 
                ? 'Sua sessão de pagamento expirou. Por favor, tente novamente.'
                : 'Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.'}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <TextField
            label="Seu email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            disabled={loading}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleTryAgain}
              disabled={loading}
              sx={{ 
                py: 1.5,
                fontWeight: 'bold',
                position: 'relative'
              }}
            >
              {loading ? (
                <>
                  <CircularProgress 
                    size={24} 
                    color="inherit" 
                    sx={{ 
                      position: 'absolute',
                      left: 20
                    }} 
                  />
                  Processando...
                </>
              ) : (
                'Tentar Novamente'
              )}
            </Button>
            
            <Button
              variant="outlined"
              color="primary"
              onClick={handleManualAccess}
              disabled={loading}
            >
              Voltar para a Seleção de Plano
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PaymentFallback;
