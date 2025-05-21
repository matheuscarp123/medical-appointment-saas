import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Check as CheckIcon,
  Star as StarIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const plans = [
    {
      name: 'Profissional',
      price: 'R$ 99,90',
      period: '/mês',
      features: [
        'Agendamento ilimitado',
        'Gestão de pacientes',
        'Relatórios detalhados',
        'Assistente de IA para diagnóstico',
        'Suporte prioritário',
        'Backup diário',
        'API de integração',
      ],
      icon: <StarIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary.main',
    },
    {
      name: 'Empresarial',
      price: 'R$ 199,90',
      period: '/mês',
      features: [
        'Todas as funcionalidades do plano Profissional',
        'Múltiplos usuários',
        'Gestão de múltiplas clínicas',
        'Relatórios personalizados',
        'Treinamento exclusivo',
        'Suporte 24/7',
        'SLA garantido',
      ],
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      color: 'secondary.main',
    },
  ];

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
  };

  // Função para processar pagamento
  const handlePayment = async () => {
    if (!selectedPlan) {
      setError('Por favor, selecione um plano');
      return;
    }
    
    const planType = selectedPlan === 'Profissional' ? 'professional' : 'business';
    
    try {
      // Iniciar processo de checkout com feedback visual
      setIsLoading(true);
      setError(null);
      
      // Verificar se o usuário está logado
      if (!user || !user.id) {
        navigate('/login?redirect=payment');
        return;
      }
      
      // Verificar se é o email especial com acesso imediato
      const specialEmail = 'matheuscontato.c@gmail.com';
      const isSpecialAccess = user.email?.toLowerCase() === specialEmail.toLowerCase();
      
      if (isSpecialAccess) {
        // Conceder acesso imediato sem pagamento para o email especial
        console.log('Acesso especial concedido sem pagamento necessário.');
        setSuccess('Acesso especial concedido! Redirecionando...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
        return;
      }
      
      // Usar serviço de simulação de pagamento
      setSuccess('Processando pagamento...');
      
      try {
        // Importar serviço de simulação de pagamento
        const { simulatePaymentProcessing } = await import('../services/paymentSimulationService');
        
        // Processar pagamento simulado
        const result = await simulatePaymentProcessing(user, planType);
        
        if (result.success) {
          setSuccess('Pagamento aprovado! Redirecionando para o dashboard...');
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          throw new Error(result.message);
        }
      } catch (simulationError) {
        console.error('Erro na simulação:', simulationError);
        setError('Falha ao processar pagamento. Por favor, tente novamente.');
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setError('Falha ao processar pagamento. Por favor, tente novamente ou entre em contato com o suporte.');
      setIsLoading(false);
    }
  };

  return (
      <Box
        sx={{
        minHeight: '100vh',
        background: `url('/assets/medical-bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography
            variant="h3"
            component="h1"
            align="center"
          sx={{
              mb: 2,
              fontWeight: 700,
              color: 'primary.main',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 100,
                height: 4,
                background: 'linear-gradient(90deg, #1976D2, #64B5F6)',
            borderRadius: 2,
              }
          }}
        >
            Escolha seu Plano
          </Typography>
          
          <Typography 
            variant="h6"
            align="center"
            sx={{ 
              mb: 6,
              maxWidth: '800px',
              mx: 'auto',
              color: 'text.secondary',
            }}
          >
            Selecione o plano ideal para sua clínica e comece a usar o MediFlow hoje mesmo
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {plans.map((plan) => (
              <Grid item xs={12} md={6} key={plan.name}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: selectedPlan === plan.name
                      ? '0 8px 30px rgba(0, 0, 0, 0.15)'
                      : '0 4px 30px rgba(0, 0, 0, 0.1)',
                    transform: selectedPlan === plan.name ? 'translateY(-8px)' : 'none',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      {plan.icon}
                      <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                          mt: 2,
                          mb: 1,
                          fontWeight: 700,
                          color: plan.color,
                        }}
                      >
                        {plan.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', mb: 2 }}>
                        <Typography
                          variant="h3"
                          component="span"
                          sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                          }}
                        >
                          {plan.price}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="span"
                          sx={{
                            ml: 1,
                            color: 'text.secondary',
                          }}
                        >
                          {plan.period}
                        </Typography>
            </Box>
          </Box>

                    <Divider sx={{ my: 3 }} />

                    <List sx={{ mb: 3 }}>
                      {plan.features.map((feature, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 1 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckIcon sx={{ color: plan.color }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{
                              sx: { fontWeight: 500 }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>

          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{
                        background: selectedPlan === plan.name
                          ? `linear-gradient(90deg, ${plan.color} 0%, ${plan.color} 100%)`
                          : 'linear-gradient(90deg, #1976D2 0%, #2196F3 100%)',
                        color: 'white',
                        borderRadius: '30px',
                        padding: '12px 36px',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: `linear-gradient(90deg, ${plan.color} 0%, ${plan.color} 100%)`,
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
                        },
                      }}
                      onClick={() => handleSelectPlan(plan.name)}
                    >
                      {selectedPlan === plan.name ? 'Plano Selecionado' : 'Selecionar Plano'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {selectedPlan && (
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(90deg, #1976D2 0%, #2196F3 100%)',
                  color: 'white',
                  borderRadius: '30px',
                  padding: '12px 36px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
              textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #1565C0 0%, #1976D2 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
                  },
                }}
                onClick={handlePayment}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Prosseguir para Pagamento'
                )}
              </Button>
              
              {error && (
                <Alert severity="error" sx={{ mt: 2, mx: 'auto', maxWidth: '500px' }}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert 
                  severity="success" 
                  sx={{ 
                    mt: 4, 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    '& .MuiAlert-icon': {
                      alignItems: 'center'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {isLoading && <CircularProgress size={20} color="success" />}
                    {success}
                  </Box>
                </Alert>
              )}
            </Box>
          )}

          <Box sx={{ mt: 8 }}>
            <Typography
              variant="h5"
              component="h2"
              align="center"
              sx={{
                mb: 4,
                fontWeight: 600,
                color: 'primary.main',
              }}
            >
              Recursos Inclusos em Todos os Planos
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: 2,
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <SpeedIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                    Interface Intuitiva
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Design moderno e fácil de usar para uma experiência fluida
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: 2,
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                    Segurança Total
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Criptografia de ponta a ponta e conformidade com LGPD
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: 2,
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <SupportIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                    Suporte Técnico
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Equipe especializada para ajudar com qualquer dúvida
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: 2,
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                    IA para Diagnóstico
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Assistente inteligente para auxiliar no diagnóstico
                  </Typography>
        </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
      
      {/* Barra de notificau00e7u00e3o para feedback do usuu00e1rio */}
      <Snackbar
        open={Boolean(success) || Boolean(error)}
        autoHideDuration={6000}
        onClose={() => {
          setSuccess(null);
          setError(null);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => {
            setSuccess(null);
            setError(null);
          }}
          severity={success ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {success || error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Payment;
