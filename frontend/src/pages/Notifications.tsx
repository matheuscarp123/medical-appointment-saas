import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle,
  Error,
  Info,
  Warning,
  MoreVert,
  Delete,
  Done,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { getNotifications, markAsRead, deleteNotification } from '../services/notificationService';
import { formatDateTime } from '../utils/formatters';
import { Notification, NotificationType } from '../types/entities';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle color="success" />;
    case 'error':
      return <Error color="error" />;
    case 'warning':
      return <Warning color="warning" />;
    default:
      return <Info color="info" />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    default:
      return 'info';
  }
};

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
      setError('Erro ao carregar notificações. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, notificationId: string) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedNotification(notificationId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = async () => {
    if (!selectedNotification) return;

    try {
      await markAsRead(selectedNotification);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === selectedNotification
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err);
    }

    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!selectedNotification) return;

    try {
      await deleteNotification(selectedNotification);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== selectedNotification)
      );
    } catch (err) {
      console.error('Erro ao excluir notificação:', err);
    }

    handleMenuClose();
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((notification) => !notification.read);
      await Promise.all(unreadNotifications.map((notification) => markAsRead(notification.id)));
      
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({ ...notification, read: true }))
      );
    } catch (err) {
      console.error('Erro ao marcar todas as notificações como lidas:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">
            Notificações
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Done />}
            onClick={handleMarkAllAsRead}
            disabled={!notifications.some((notification) => !notification.read)}
          >
            Marcar todas como lidas
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper>
          {notifications.length === 0 ? (
            <Box p={3} textAlign="center">
              <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography color="text.secondary">
                Nenhuma notificação encontrada
              </Typography>
            </Box>
          ) : (
            <List>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      bgcolor: notification.read ? 'transparent' : 'action.hover',
                    }}
                  >
                    <ListItemIcon>{getNotificationIcon(notification.type)}</ListItemIcon>
                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {notification.message}
                          </Typography>
                          <Box display="flex" gap={1} alignItems="center">
                            <Typography variant="caption" color="text.secondary">
                              {formatDateTime(new Date(notification.createdAt))}
                            </Typography>
                            <Chip
                              label={notification.read ? 'Lida' : 'Não lida'}
                              size="small"
                              color={notification.read ? 'default' : getNotificationColor(notification.type)}
                              variant={notification.read ? 'outlined' : 'filled'}
                            />
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={(e) => handleMenuOpen(e, notification.id)}
                      >
                        <MoreVert />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>

        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          {selectedNotification &&
            !notifications.find((n) => n.id === selectedNotification)?.read && (
              <MenuItem onClick={handleMarkAsRead}>
                <ListItemIcon>
                  <Done fontSize="small" />
                </ListItemIcon>
                <ListItemText>Marcar como lida</ListItemText>
              </MenuItem>
            )}
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Excluir</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </Container>
  );
};

export default Notifications;