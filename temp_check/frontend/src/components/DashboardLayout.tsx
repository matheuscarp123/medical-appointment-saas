import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Button,
  Fab,
  Tooltip,
  Fade,
  Zoom,
  Slide,
  styled,
  keyframes,
  Avatar,
  Chip,
  Container,
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Logout as LogoutIcon,
  EventRepeat as EventRepeatIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  CalendarToday as CalendarTodayIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';

// Define animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 85%, #42a5f5 100%)',
  backgroundSize: '200% 200%',
  animation: `${gradientShift} 15s ease infinite`,
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  transition: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`,
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 700,
  fontSize: '1.5rem',
  background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0.85) 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
  letterSpacing: '0.5px',
}));

const NotificationBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    animation: `${pulse} 2s infinite`,
    boxShadow: '0 0 10px rgba(244, 67, 54, 0.7)',
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
}));

const FloatingActionButton = styled(Fab)(({ theme }) => ({
  animation: `${float} 6s ease-in-out infinite`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.1) translateY(-5px)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.3)',
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:before': {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  '&.fade-in': {
    animation: 'fadeIn 0.5s ease-in-out',
  },
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(10px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const NotificationMenuItem = styled(MenuItem)(({ theme }) => ({
  transition: 'all 0.2s ease',
  borderLeft: '3px solid transparent',
  '&:hover': {
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    transform: 'translateX(3px)',
    backgroundColor: 'rgba(25, 118, 210, 0.04)',
  },
}));

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface UserWithDisplay {
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  uid?: string;
  [key: string]: any;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const userWithDisplay = user as UserWithDisplay;

  // Set page as loaded after initial render for animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Track route changes for content transitions
  useEffect(() => {
    // Add page transition animations here
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.classList.add('fade-in');
      setTimeout(() => {
        mainContent.classList.remove('fade-in');
      }, 500);
    }
  }, [location.pathname]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleViewAllNotifications = () => {
    handleNotificationsClose();
    navigate('/dashboard/notificacoes');
  };

  const handleLogout = async () => {
    try {
      console.log('Iniciando logout do sistema...');
      await logout();
      console.log('Logout realizado com sucesso');
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleReschedule = () => {
    navigate('/dashboard/reagendamento');
  };

  const handleNewAppointment = () => {
    navigate('/dashboard/nova-consulta');
  };

  const handleCalendar = () => {
    navigate('/dashboard/agenda');
  };

  // Exemplo de notificações (em um sistema real, isso viria de um estado global ou API)
  const notifications = [
    { id: 1, type: 'success', message: 'Consulta confirmada com Maria Silva', time: '5 min atrás' },
    { id: 2, type: 'warning', message: 'Lembrete: Consulta com João Oliveira em 1 hora', time: '15 min atrás' },
    { id: 3, type: 'info', message: 'Novo paciente cadastrado: Ana Costa', time: '1 hora atrás' },
  ];

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        background: `linear-gradient(rgba(200, 220, 245, 0.7), rgba(190, 215, 240, 0.65)), url('/assets/medical-bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'soft-light',
        position: 'relative',
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
      className="animate__animated animate__fadeIn animate__faster"
    >
      <Fade in={pageLoaded} timeout={800}>
        <StyledAppBar 
          position="fixed" 
          sx={{ 
            zIndex: theme.zIndex.drawer + 1,
            width: `calc(100% - ${sidebarOpen ? '240px' : '0px'})`,
            ml: sidebarOpen ? '240px' : 0,
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ActionButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleSidebarToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </ActionButton>

              <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                <LogoText variant="h6" noWrap>
                  <img 
                    src="/assets/logo.png.PNG" 
                    alt="MediFlow Logo"
                    style={{ height: 28, marginRight: 8 }}
                    className="animate__animated animate__pulse animate__infinite animate__slower"
                  />
                  MediFlow
                </LogoText>
              </Zoom>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {user && (
                <Fade in={true} timeout={1000}>
                  <Chip
                    avatar={
                      <Avatar 
                        alt={userWithDisplay.displayName || 'Usuário'} 
                        src={userWithDisplay.photoURL || undefined}
                      >
                        {!userWithDisplay.photoURL && (userWithDisplay.displayName?.charAt(0) || 'U')}
                      </Avatar>
                    }
                    label={userWithDisplay.displayName || userWithDisplay.email?.split('@')[0] || 'Usuário'}
                    variant="outlined"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.15)', 
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.3)',
                      mr: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.25)',
                      }
                    }}
                  />
                </Fade>
              )}

              <Zoom in={true} style={{ transitionDelay: '400ms' }}>
                <ActionButton 
                  color="inherit" 
                  onClick={handleNotificationsOpen}
                >
                  <NotificationBadge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                  </NotificationBadge>
                </ActionButton>
              </Zoom>

              <Zoom in={true} style={{ transitionDelay: '600ms' }}>
                <ActionButton 
                  color="inherit"
                  onClick={handleLogout}
                  sx={{ ml: 1 }}
                >
                  <LogoutIcon />
                </ActionButton>
              </Zoom>
            </Box>
            
            <Menu
              anchorEl={notificationsAnchor}
              open={Boolean(notificationsAnchor)}
              onClose={handleNotificationsClose}
              PaperProps={{
                sx: {
                  width: 320,
                  maxHeight: 400,
                  mt: 1.5,
                  overflow: 'visible',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  borderRadius: 2,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              TransitionComponent={Fade}
              transitionDuration={300}
            >
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight={600}>Notificações</Typography>
                <Button 
                  size="small" 
                  onClick={handleViewAllNotifications}
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                  }}
                >
                  Ver todas
                </Button>
              </Box>
              <Divider />
              {notifications.map((notification, index) => (
                <NotificationMenuItem 
                  key={notification.id} 
                  onClick={handleNotificationsClose}
                  sx={{ 
                    py: 1.5,
                    borderLeft: notification.type === 'success' 
                      ? '3px solid #4caf50' 
                      : notification.type === 'warning'
                        ? '3px solid #ff9800'
                        : '3px solid #2196f3',
                    animation: `fadeIn 0.3s ${index * 0.1}s both`
                  }}
                >
                  <ListItemIcon>
                    {notification.type === 'success' && <CheckCircleIcon color="success" />}
                    {notification.type === 'warning' && <WarningIcon color="warning" />}
                    {notification.type === 'info' && <InfoIcon color="info" />}
                  </ListItemIcon>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2">{notification.message}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </Box>
                </NotificationMenuItem>
              ))}
              {notifications.length === 0 && (
                <MenuItem disabled>
                  <Typography variant="body2">Nenhuma notificação</Typography>
                </MenuItem>
              )}
            </Menu>
          </Toolbar>
        </StyledAppBar>
      </Fade>

      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />

      <MainContent
        component="div"
        sx={{
          flexGrow: 1,
          position: 'relative',
          zIndex: 1,
          pt: 2,
          pb: 6,
          bgcolor: 'transparent'
        }}
      >
        <Toolbar />
        <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 2 }}>
          {children}
        </Box>
      </MainContent>

      <Zoom in={pageLoaded} timeout={800} style={{ transitionDelay: '800ms' }}>
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Tooltip 
            title="Nova Consulta" 
            placement="left"
            arrow
            TransitionComponent={Zoom}
          >
            <FloatingActionButton
              color="primary"
              sx={{
                bgcolor: 'rgba(25, 118, 210, 0.9)',
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 1)',
                },
              }}
              onClick={handleNewAppointment}
            >
              <AddIcon />
            </FloatingActionButton>
          </Tooltip>
          
          <Tooltip 
            title="Agenda" 
            placement="left"
            arrow
            TransitionComponent={Zoom}
          >
            <FloatingActionButton
              color="info"
              sx={{
                bgcolor: 'rgba(2, 136, 209, 0.9)',
                '&:hover': {
                  bgcolor: 'rgba(2, 136, 209, 1)',
                },
              }}
              onClick={handleCalendar}
            >
              <CalendarTodayIcon />
            </FloatingActionButton>
          </Tooltip>
          
          <Tooltip 
            title="Reagendamento Rápido" 
            placement="left"
            arrow
            TransitionComponent={Zoom}
          >
            <FloatingActionButton
              color="secondary"
              sx={{
                bgcolor: 'rgba(63, 81, 181, 0.9)',
                '&:hover': {
                  bgcolor: 'rgba(63, 81, 181, 1)',
                },
              }}
              onClick={handleReschedule}
            >
              <EventRepeatIcon />
            </FloatingActionButton>
          </Tooltip>
        </Box>
      </Zoom>
    </Box>
  );
};

export default DashboardLayout;