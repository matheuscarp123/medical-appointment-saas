import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  useTheme,
  Fade,
  Grow,
  Zoom
} from '@mui/material';
import { styled, keyframes } from '@mui/system';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle } from '../services/authService';

// The background image path updated to the specified image
const medicalBg = '/assets/medical-bg.png';
const logoPath = '/assets/logo.png.PNG';

// Create animation keyframes for modern effects
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shine = keyframes`
  from {
    background-position: 200% center;
  }
  to {
    background-position: -200% center;
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.7); }
  100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.3); }
`;

const verticalShine = keyframes`
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 0% 200%;
  }
`;

// Styled components for enhanced visual effects
const LogoContainer = styled(Box)(({ theme }) => ({
  animation: `${float} 6s ease-in-out infinite`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(1),
  filter: 'drop-shadow(0 0 10px rgba(25, 118, 210, 0.25))',
}));

const Title = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
  backgroundSize: '100% 200%',
  color: '#fff',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${verticalShine} 8s linear infinite`,
  textAlign: 'center',
  textShadow: '0 1px 3px rgba(25, 118, 210, 0.2)',
  fontWeight: 900,
  marginBottom: theme.spacing(1),
  fontFamily: '"Poppins", sans-serif',
  letterSpacing: '0.5px',
  fontSize: '3rem',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(0deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    backgroundSize: '100% 200%',
    animation: `${verticalShine} 4s linear infinite`,
    WebkitBackgroundClip: 'text',
    filter: 'blur(3px)',
    opacity: 0.6,
  }
}));

const LoginButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  width: '100%',
  padding: '14px 0',
  backgroundColor: theme.palette.common.white,
  color: theme.palette.grey[800],
  fontSize: '1rem',
  fontWeight: 500,
  textTransform: 'none',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  animation: `${pulse} 3s infinite`,
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    boxShadow: '0 8px 16px rgba(0,0,0,0.1), 0 0 10px rgba(255, 255, 255, 0.5)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  marginTop: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  transition: 'all 0.3s ease',
  animation: `${fadeInUp} 1s ease-out`,
  border: '1px solid rgba(255, 255, 255, 0.6)',
  '&:hover': {
    boxShadow: '0 15px 40px rgba(0,0,0,0.2), 0 0 20px rgba(255, 255, 255, 0.4)',
    transform: 'translateY(-5px)',
  }
}));

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [animateReady, setAnimateReady] = useState(false);

  // Start animations after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateReady(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const user = await signInWithGoogle();
      
      // Verificar se o usuário tem acesso
      const specialEmail = 'matheuscontato.c@gmail.com';
      const userEmail = user.email?.toLowerCase() || '';
      const isSpecialEmail = userEmail === specialEmail.toLowerCase();
      
      if (isSpecialEmail) {
        await login(user);
        navigate('/dashboard');
      } else {
        setError('Acesso não autorizado. Entre em contato com o administrador.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Erro ao fazer login com Google:', err);
      setError(err.message || 'Falha ao fazer login com Google. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(rgba(200, 220, 245, 0.7), rgba(190, 215, 240, 0.65)), url(${medicalBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'soft-light',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(120deg, rgba(180, 210, 255, 0.05), rgba(41, 121, 255, 0.05))',
          backdropFilter: 'contrast(1.15) saturate(1.2)',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '200%',
          height: '200%',
          top: -100,
          left: -100,
          background: 'radial-gradient(ellipse at center, rgba(180, 210, 255, 0.3) 0%, rgba(25, 118, 210, 0.1) 70%)',
          opacity: 0.3,
          animation: `${pulse} 15s infinite`,
        }
      }}
      className="animate__animated animate__fadeIn animate__slow"
    >
      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in={animateReady} timeout={1000}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Zoom in={animateReady} timeout={1500}>
              <LogoContainer>
                <img 
                  src={logoPath} 
                  alt="MediFlow Logo" 
                  style={{ 
                    height: '80px', 
                    margin: '0 auto',
                    filter: 'drop-shadow(0 1px 4px rgba(25, 118, 210, 0.2))',
                    transition: 'all 0.3s ease',
                    objectFit: 'contain',
                    maxWidth: '100%'
                  }} 
                />
              </LogoContainer>
            </Zoom>

            <Grow in={animateReady} timeout={1800}>
              <Title variant="h1">
                MediFlow
              </Title>
            </Grow>

            <Fade in={animateReady} timeout={2000}>
              <Typography 
                component="h2" 
                variant="h6" 
                gutterBottom
                sx={{ 
                  color: '#1976d2',
                  textAlign: 'center',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.5)',
                  mb: 4,
                  fontFamily: '"Roboto", sans-serif',
                  fontWeight: 400,
                  opacity: 0.9,
                  letterSpacing: '1px'
                }}
                className="animate__animated animate__fadeIn animate__delay-1s"
              >
                Sistema Inteligente de Gestão Médica
              </Typography>
            </Fade>

            <Zoom in={animateReady} timeout={1500}>
              <StyledPaper elevation={6}>
                {error && (
                  <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                    {error}
                  </Alert>
                )}
                <LoginButton
                  variant="contained"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="animate__animated animate__pulse animate__infinite animate__slower"
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Entrar com Google'
                  )}
                </LoginButton>
              </StyledPaper>
            </Zoom>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;