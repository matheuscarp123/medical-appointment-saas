import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography, 
  Button, 
  Container, 
  Grid,
  Card, 
  CardContent, 
  CardActions, 
  AppBar, 
  Toolbar,
  useMediaQuery, 
  useTheme, 
  Paper, 
  List, 
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider, 
  IconButton, 
  Collapse, 
  alpha,
  keyframes
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  MedicalServices as MedicalIcon,
  PeopleAlt as PeopleIcon,
  Security as SecurityIcon,
  Insights as InsightsIcon,
  ChevronRight as ArrowIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  AutoAwesome as AutoAwesomeIcon
} from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import SecurityInfoPopup from '../components/SecurityInfoPopup';

// Adicionando o efeito de brilho (Shine Effect)
const shine = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const [securityInfoOpen, setSecurityInfoOpen] = useState(false);

  const features = [
    {
      icon: <CalendarIcon fontSize="large" color="primary" />,
      title: 'Agendamento Simplificado',
      description: 'Gerencie consultas de forma eficiente e organizada',
    },
    {
      icon: <PeopleIcon fontSize="large" color="primary" />,
      title: 'Gestão de Pacientes',
      description: 'Mantenha todos os dados dos pacientes em um só lugar',
    },
    {
      icon: <InsightsIcon fontSize="large" color="primary" />,
      title: 'Relatórios Detalhados',
      description: 'Acompanhe o desempenho da sua clínica em tempo real',
    },
    {
      icon: <SecurityIcon fontSize="large" color="primary" />,
      title: 'Segurança Total',
      description: 'Seus dados protegidos com a mais alta tecnologia',
    },
  ];

  const securityFeatures = [
    {
      icon: <SecurityIcon fontSize="large" sx={{ color: 'primary.main', backgroundColor: 'white', borderRadius: '50%', padding: '5px', boxShadow: '0 0 10px rgba(25, 118, 210, 0.3)' }} />,
      title: 'Criptografia de Ponta a Ponta',
      description: 'Todos os dados são criptografados usando algoritmos avançados de criptografia AES-256',
    },
    {
      icon: <SecurityIcon fontSize="large" sx={{ color: 'primary.main', backgroundColor: 'white', borderRadius: '50%', padding: '5px', boxShadow: '0 0 10px rgba(25, 118, 210, 0.3)' }} />,
      title: 'Conformidade com LGPD',
      description: 'Nossa plataforma está em conformidade com a Lei Geral de Proteção de Dados',
    },
    {
      icon: <SecurityIcon fontSize="large" sx={{ color: 'primary.main', backgroundColor: 'white', borderRadius: '50%', padding: '5px', boxShadow: '0 0 10px rgba(25, 118, 210, 0.3)' }} />,
      title: 'Autenticação de Dois Fatores',
      description: 'Proteção adicional para sua conta com verificação em duas etapas',
    },
    {
      icon: <SecurityIcon fontSize="large" sx={{ color: 'primary.main', backgroundColor: 'white', borderRadius: '50%', padding: '5px', boxShadow: '0 0 10px rgba(25, 118, 210, 0.3)' }} />,
      title: 'Backups Automáticos',
      description: 'Seus dados são armazenados com redundância e backups diários',
    },
  ];

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
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <AppBar 
          position="fixed" 
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.85)', 
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          component="img"
                src="/assets/logo.png.PNG" 
          alt="MediFlow Logo"
          sx={{
                  height: 35,
                  mr: 1,
                  filter: 'drop-shadow(0 2px 4px rgba(33, 150, 243, 0.3))',
                }} 
              />
              <Typography 
                variant="h4" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  color: '#64B5F6',
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: '0.5px',
                }}
              >
                MediFlow
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
              startIcon={<GoogleIcon />}
            >
              Login com Google
            </Button>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            bgcolor: 'transparent',
            color: 'primary.main',
            pt: 15,
            pb: 8,
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Container maxWidth="md">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, position: 'relative', width: '100%' }}>
                <Typography 
                  variant="h1" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 800,
                    fontFamily: "'Poppins', sans-serif",
                    background: 'linear-gradient(90deg,rgb(128, 198, 255) 0%, #64B5F6 50%, #90CAF9 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center',
                    fontSize: '3.8rem',
                    letterSpacing: '0.02em',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    mb: 1,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
                      backgroundSize: '200% 100%',
                      animation: `${shine} 3s infinite linear`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    },
                    '&:hover::before': {
                      animation: `${shine} 1.5s infinite linear`
                    }
                  }}
                >
                  MediFlow.
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'rgba(158, 158, 158, 0.92)',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 400,
                    letterSpacing: '0.02em',
                    maxWidth: 'none',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    fontSize: '1.2rem',
                    mt: -1,
                  }}
                >
                  A solução completa para gerenciar sua clínica médica
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
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
                    onClick={() => navigate('/payment')}
                  >
                    Começar Agora
                  </Button>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                    },
                    ...(index === 0 && {
                      background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.5) 0%, rgba(255, 87, 34, 0.5) 100%)',
                    }),
                    ...(index === 1 && {
                      background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.5) 0%, rgba(46, 125, 50, 0.5) 100%)',
                    }),
                    ...(index === 2 && {
                      background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.5) 0%, rgba(21, 101, 192, 0.5) 100%)',
                    }),
                    ...(index === 3 && {
                      background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.5) 0%, rgba(106, 27, 154, 0.5) 100%)',
                    }),
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Box 
                      sx={{ 
                        mb: 3,
                        display: 'flex',
                        justifyContent: 'center',
                        '& .MuiSvgIcon-root': {
                          fontSize: 60,
                          color: 'white',
                          opacity: 1,
                        }
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      sx={{ 
                        mb: 2,
                        fontWeight: 600,
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'white',
                        opacity: 0.9,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* AI Assistant Section */}
        <Box sx={{ py: 8, bgcolor: 'rgba(255, 255, 255, 0.9)', position: 'relative', zIndex: 1 }}>
          <Container maxWidth="lg">
            <Typography 
              variant="h3" 
              component="h2" 
              align="center" 
              sx={{ 
                mb: 6, 
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
              Assistente de Diagnóstico com IA
          </Typography>
          
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box 
                  sx={{ 
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -20,
                      left: -20,
                      right: -20,
                      bottom: -20,
                      background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(100, 181, 246, 0.1) 100%)',
                      borderRadius: 4,
                      zIndex: -1,
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: '100%',
                      height: 'auto',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 4,
                    }}
                  >
                    <AutoAwesomeIcon 
                      sx={{ 
                        fontSize: 200,
                        color: 'primary.main',
                        filter: 'drop-shadow(0 4px 8px rgba(33, 150, 243, 0.3))',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': {
                            transform: 'scale(1)',
                            opacity: 1,
                          },
                          '50%': {
                            transform: 'scale(1.05)',
                            opacity: 0.8,
                          },
                          '100%': {
                            transform: 'scale(1)',
                            opacity: 1,
                          },
                        },
                      }} 
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ pl: { md: 4 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AutoAwesomeIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h4" component="h3" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Diagnóstico Inteligente
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 3 }}>
                    Nosso Assistente de Diagnóstico com IA utiliza algoritmos avançados de aprendizado de máquina para analisar sintomas e sugerir possíveis diagnósticos, auxiliando os profissionais de saúde em suas decisões clínicas.
          </Typography>
                  
                  <List>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Box sx={{ 
                          width: 36, 
                          height: 36, 
                          borderRadius: '50%', 
                          bgcolor: 'primary.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                        }}>
                          1
                        </Box>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Análise de Sintomas" 
                        secondary="Insira os sintomas do paciente e nossa IA analisará padrões para sugerir diagnósticos possíveis."
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Box sx={{ 
                          width: 36, 
                          height: 36, 
                          borderRadius: '50%', 
                          bgcolor: 'primary.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                        }}>
                          2
                        </Box>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Sugestões de Diagnóstico" 
                        secondary="Receba sugestões de diagnósticos com níveis de confiança e explicações detalhadas."
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Box sx={{ 
                          width: 36, 
                          height: 36, 
                          borderRadius: '50%', 
                          bgcolor: 'primary.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                        }}>
                          3
                        </Box>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Histórico de Diagnósticos" 
                        secondary="Mantenha um registro completo dos diagnósticos anteriores para acompanhamento."
                      />
                    </ListItem>
                  </List>
          
          <Button
            variant="contained"
            size="large"
            sx={{
                      mt: 3,
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
                    onClick={() => navigate('/login')}
                  >
                    Experimentar Agora
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Security Section */}
        <Box sx={{ py: 8, bgcolor: 'rgba(240, 240, 240, 0.9)', position: 'relative', zIndex: 1 }}>
          <Container maxWidth="lg">
            <Typography 
              variant="h3" 
              component="h2" 
              align="center" 
              sx={{ 
                mb: 6, 
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
              Segurança de Dados
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
              A segurança dos dados dos seus pacientes é nossa prioridade. Utilizamos as mais avançadas tecnologias de criptografia e proteção para garantir que suas informações estejam sempre seguras.
            </Typography>
            
            <Grid container spacing={4}>
              {securityFeatures.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
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
                      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <Box 
                      sx={{ 
                        mb: 2,
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: 'primary.light',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Todos os dados são armazenados em servidores seguros com certificação ISO 27001
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                sx={{ 
                  borderRadius: '30px',
                  px: 4,
                  py: 1.5,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  }
                }}
                onClick={() => setSecurityInfoOpen(true)}
              >
                Saiba mais sobre nossa segurança
          </Button>
            </Box>
          </Container>
        </Box>

        {/* Footer */}
        <Box sx={{ py: 4, bgcolor: 'primary.dark', color: 'white', position: 'relative', zIndex: 1 }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Box
                component="img"
                src="/assets/logo.png.PNG" 
                alt="MediFlow Logo"
                sx={{
                  height: 30,
                  mr: 1,
                  filter: 'brightness(0) invert(1)',
                }} 
              />
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  color: 'white',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                MediFlow
              </Typography>
            </Box>
            <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
              {new Date().getFullYear()} MediFlow | Belo Horizonte-MG. Todos os direitos reservados.
            </Typography>
            <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
              Contato: <a href="mailto:mediflowservices@gmail.com" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>mediflowservices@gmail.com</a>
            </Typography>
          </Container>
        </Box>
      </Box>

      <SecurityInfoPopup
        open={securityInfoOpen}
        onClose={() => setSecurityInfoOpen(false)}
      />
    </Box>
  );
};

export default Home;
