import React, { useState, useEffect } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Button, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Badge,
  Tooltip,
  Avatar,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  ListItemButton,
  Container,
  CssBaseline,
  Collapse
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  LocalHospital as DoctorIcon,
  Event as EventIcon,
  Settings as SettingsIcon,
  Psychology as PsychologyIcon,
  ExitToApp as ExitToAppIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  AccountBox as AccountBoxIcon,
  MedicalServices as MedicalServicesIcon,
  CalendarMonth as CalendarIcon,
  Receipt as ReceiptIcon,
  Biotech as BiotechIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import ProfilePopup from './ProfilePopup';
import { Icons } from '../styles/Icons';
import { snakeLogo } from '../assets/snake-logo.svg';

interface LayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 280;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Fecha o drawer quando a rota muda em dispositivos móveis
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };
  
  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };
  
  const handleSubMenuToggle = (menu: string) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const profileMenuOpen = Boolean(profileAnchorEl);
  const notificationMenuOpen = Boolean(notificationAnchorEl);
  
  // Mapeamento dos itens do menu com submenus
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      roles: ['admin', 'doctor', 'receptionist']
    },
    {
      text: 'Agenda',
      icon: <CalendarIcon />,
      path: '/appointments',
      roles: ['admin', 'doctor', 'receptionist']
    },
    {
      text: 'Pacientes',
      icon: <PersonIcon />,
      path: '/patients',
      roles: ['admin', 'doctor', 'receptionist']
    },
    {
      text: 'Diagnóstico',
      icon: <PsychologyIcon />,
      submenu: [
        {
          text: 'Assistente de Diagnóstico',
          path: '/diagnosis-assistant',
          roles: ['admin', 'doctor']
        },
        {
          text: 'Histórico de Diagnósticos',
          path: '/diagnoses',
          roles: ['admin', 'doctor']
        }
      ],
      roles: ['admin', 'doctor']
    },
    {
      text: 'Médicos',
      icon: <MedicalServicesIcon />,
      path: '/doctors',
      roles: ['admin']
    },
    {
      text: 'Exames',
      icon: <BiotechIcon />,
      path: '/exams',
      roles: ['admin', 'doctor']
    },
    {
      text: 'Financeiro',
      icon: <ReceiptIcon />,
      path: '/financial',
      roles: ['admin']
    },
    {
      text: 'Configurações',
      icon: <SettingsIcon />,
      path: '/settings',
      roles: ['admin', 'doctor', 'receptionist']
    }
  ];
  
  // Filtra os itens de menu com base na função do usuário
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'guest')
  );
  
  // Drawer content
  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        p: 2,
        backgroundColor: 'primary.main',
        color: 'white'
      }}>
        <Box 
          component="img" 
          src={snakeLogo} 
          alt="MediFlow Logo" 
          sx={{ 
            width: 40, 
            height: 40, 
            mb: 1,
            filter: 'brightness(0) invert(1)'
          }} 
        />
        <Typography variant="h6" noWrap component="div" align="center" sx={{ fontWeight: 'bold' }}>
          MediFlow
        </Typography>
        <Typography variant="caption" noWrap component="div" align="center">
          Sistema de Gestão Médica
        </Typography>
      </Box>
      
      <Divider />
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        py: 2
      }}>
        <Avatar 
          sx={{ width: 64, height: 64, mb: 1 }}
          src={user?.photoURL || undefined}
        >
          {user?.displayName ? user.displayName.charAt(0) : 'U'}
        </Avatar>
        <Typography variant="subtitle1" fontWeight="bold">
          {user?.displayName || 'Usuário'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.role === 'admin' ? 'Administrador' : 
            user?.role === 'doctor' ? 'Médico' : 
            user?.role === 'patient' ? 'Paciente' :
            user?.role === 'receptionist' ? 'Recepcionista' : 'Usuário'}
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {filteredMenuItems.map((item) => 
          item.submenu ? (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => handleSubMenuToggle(item.text)}
                  sx={{
                    bgcolor: openSubMenu === item.text ? 'action.selected' : 'transparent',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                  {openSubMenu === item.text ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={openSubMenu === item.text} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.submenu.filter(subItem => 
                    subItem.roles.includes(user?.role || 'guest')
                  ).map((subItem) => (
                    <ListItemButton 
                      key={subItem.text} 
                      component={RouterLink} 
                      to={subItem.path}
                      sx={{ 
                        pl: 4,
                        bgcolor: isActive(subItem.path) ? 'primary.light' : 'transparent',
                        color: isActive(subItem.path) ? 'primary.main' : 'inherit',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    >
                      <ListItemText primary={subItem.text} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ) : (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                component={RouterLink} 
                to={item.path}
                sx={{ 
                  bgcolor: isActive(item.path) ? 'primary.light' : 'transparent',
                  color: isActive(item.path) ? 'primary.main' : 'inherit',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  },
                  borderLeft: isActive(item.path) ? '4px solid' : 'none',
                  borderColor: 'primary.main'
                }}
              >
                <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
      
      <Divider sx={{ mt: 'auto' }} />
      
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Sair
        </Button>
      </Box>
    </Box>
  );
  
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {(() => {
              const path = location.pathname;
              if (path === '/dashboard') return 'Dashboard';
              if (path === '/appointments') return 'Agenda';
              if (path === '/patients') return 'Pacientes';
              if (path === '/diagnosis-assistant') return 'Assistente de Diagnóstico';
              if (path === '/diagnoses') return 'Histórico de Diagnósticos';
              if (path === '/doctors') return 'Médicos';
              if (path === '/exams') return 'Exames';
              if (path === '/financial') return 'Financeiro';
              if (path === '/settings') return 'Configurações';
              return 'MedSys';
            })()}
          </Typography>
          
          <Box sx={{ display: 'flex' }}>
            <Tooltip title="Notificações">
              <IconButton 
                color="inherit"
                onClick={handleNotificationMenuOpen}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Perfil">
              <IconButton
                color="inherit"
                onClick={handleProfileMenuOpen}
                sx={{ ml: 1 }}
              >
                <Avatar 
                  sx={{ width: 32, height: 32 }}
                  src={user?.photoURL || undefined}
                >
                  {user?.displayName ? user.displayName.charAt(0) : 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
      sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: '100vh',
          overflow: 'auto',
          bgcolor: '#f5f5f5',
          pt: { xs: 10, sm: 10 }
        }}
      >
        {children}
      </Box>
      
      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        open={profileMenuOpen}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            width: 200,
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
      >
        <MenuItem 
          onClick={() => {
            navigate('/profile');
            handleProfileMenuClose();
          }}
        >
          <ListItemIcon>
            <AccountBoxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Meu Perfil</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            navigate('/settings');
            handleProfileMenuClose();
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Configurações</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sair</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={notificationMenuOpen}
        onClose={handleNotificationMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 400,
            maxWidth: '100%',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Notificações
          </Typography>
        </Box>
        <List sx={{ p: 0 }}>
          <ListItem sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <CalendarIcon />
              </Avatar>
            </ListItemIcon>
            <ListItemText 
              primary="Nova consulta agendada" 
              secondary="Paciente: Maria Silva - 14:30"
              secondaryTypographyProps={{ 
                fontSize: '0.75rem',
                component: 'div',
                noWrap: false
              }}
            />
          </ListItem>
          <ListItem sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: 'warning.main' }}>
                <MedicalServicesIcon />
              </Avatar>
            </ListItemIcon>
            <ListItemText 
              primary="Resultado de exame disponível" 
              secondary="Paciente: João Almeida - Raio-X"
              secondaryTypographyProps={{ 
                fontSize: '0.75rem',
                component: 'div'
              }}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: 'success.main' }}>
                <PersonIcon />
              </Avatar>
            </ListItemIcon>
            <ListItemText 
              primary="Novo paciente cadastrado" 
              secondary="Pedro Santos - Enviado por Dr. Roberto"
              secondaryTypographyProps={{ 
                fontSize: '0.75rem', 
                component: 'div'
              }}
            />
          </ListItem>
        </List>
        <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
          <Button 
            size="small" 
            onClick={() => {
              navigate('/notifications');
              handleNotificationMenuClose();
            }}
          >
            Ver todas
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Layout;
