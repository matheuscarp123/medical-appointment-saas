import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePopupProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ open, onClose, onBack }) => {
  const { user } = useAuth();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={user?.photoURL || undefined}
            alt={user?.displayName || 'User'}
            sx={{ width: 64, height: 64 }}
          />
          <Box>
            <Typography variant="h6">{user?.displayName || 'Usuário'}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <List>
          <ListItem>
            <ListItemIcon>
              <PersonIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Nome"
              secondary={user?.displayName || 'Não informado'}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <EmailIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Email"
              secondary={user?.email || 'Não informado'}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <PhoneIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Telefone"
              secondary={user?.phoneNumber || 'Não informado'}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <BusinessIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Tipo de Conta"
              secondary={user?.role || 'Paciente'}
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          variant="outlined"
        >
          Voltar
        </Button>
        <Button onClick={onClose} variant="contained">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfilePopup; 