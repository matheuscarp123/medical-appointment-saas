import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, CircularProgress } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { loginWithGoogle } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = await loginWithGoogle();
      setUser(user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login com Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'white'
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
          Login
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
          onClick={handleGoogleLogin}
          disabled={loading}
          sx={{
            mb: 2,
            backgroundColor: '#4285F4',
            '&:hover': {
              backgroundColor: '#357ABD',
            },
          }}
        >
          Entrar com Google
        </Button>
      </Box>
    </Container>
  );
};

export default Login; 