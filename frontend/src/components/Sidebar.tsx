import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  LocalHospital as DoctorIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Nova Consulta', icon: <AddIcon />, path: '/dashboard/nova-consulta', highlight: true },
  { text: 'Agenda', icon: <CalendarIcon />, path: '/dashboard/agenda' },
  { text: 'Pacientes', icon: <PersonIcon />, path: '/dashboard/pacientes' },
  { text: 'Médicos', icon: <DoctorIcon />, path: '/dashboard/medicos' },
  { text: 'Relatórios', icon: <AnalyticsIcon />, path: '/dashboard/relatorios' },
  { text: 'Notificações', icon: <NotificationsIcon />, path: '/dashboard/notificacoes' },
  { text: 'Configurações', icon: <SettingsIcon />, path: '/dashboard/configuracoes' },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      onToggle();
    }
  };

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onToggle}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.12)',
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img 
            src="/assets/logo.png.PNG" 
            alt="MediFlow Logo"
            style={{ height: 32, marginRight: 8, background: 'transparent' }}
            draggable={false}
          />
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              background: 'linear-gradient(90deg, #2196F3 0%, #64B5F6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: 1,
              userSelect: 'none',
            }}
          >
            MediFlow
          </Typography>
        </Box>
        <IconButton onClick={onToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ p: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigate(item.path)}
            sx={{
              borderRadius: '8px',
              mb: 1,
              backgroundColor: location.pathname === item.path 
                ? 'rgba(33, 150, 243, 0.1)' 
                : item.highlight 
                  ? 'rgba(33, 150, 243, 0.05)'
                  : 'transparent',
              '&:hover': {
                backgroundColor: item.highlight 
                  ? 'rgba(33, 150, 243, 0.25)'
                  : 'rgba(33, 150, 243, 0.15)',
              },
              border: item.highlight ? '1px dashed rgba(33, 150, 243, 0.5)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path 
                ? '#2196F3' 
                : item.highlight 
                  ? '#2196F3'
                  : 'inherit',
              minWidth: 40,
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: location.pathname === item.path || item.highlight ? 600 : 400,
                  color: location.pathname === item.path 
                    ? '#2196F3' 
                    : item.highlight 
                      ? '#2196F3'
                      : 'inherit',
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 