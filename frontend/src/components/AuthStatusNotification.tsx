import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface AuthStatusNotificationProps {
  targetEmail?: string;
}

const AuthStatusNotification: React.FC<AuthStatusNotificationProps> = ({ targetEmail }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Se o usuário está logado
      if (targetEmail && user.email?.toLowerCase() === targetEmail.toLowerCase()) {
        setMessage(`Login bem-sucedido como ${user.email} (acesso premium)`);
        setSeverity('success');
        setOpen(true);
      } else if (user.paymentStatus === 'paid') {
        setMessage(`Login bem-sucedido como ${user.email} (acesso premium)`);
        setSeverity('success');
        setOpen(true);
      } else {
        setMessage(`Login bem-sucedido como ${user.email}`);
        setSeverity('success');
        setOpen(true);
      }
    }
  }, [user, targetEmail]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar 
      open={open} 
      autoHideDuration={6000} 
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={severity} 
        sx={{ width: '100%' }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AuthStatusNotification;
