import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Save as SaveIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Help as HelpIcon
} from '@mui/icons-material';

interface SettingsState {
  clinicName: string;
  email: string;
  phone: string;
  address: string;
  workingHours: string;
  timezone: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
  };
  payment: {
    stripeEnabled: boolean;
    stripeKey: string;
    currency: string;
  };
}

const Settings: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [settings, setSettings] = useState<SettingsState>({
    clinicName: 'MediFlow Clínica',
    email: 'contato@mediflow.com',
    phone: '(11) 99999-9999',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    workingHours: '08:00 - 18:00',
    timezone: 'America/Sao_Paulo',
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      passwordExpiry: 90
    },
    payment: {
      stripeEnabled: true,
      stripeKey: 'pk_test_...',
      currency: 'BRL'
    }
  });

  const handleChange = (section: keyof SettingsState, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object'
        ? { ...prev[section], [field]: value }
        : value
    }));
  };

  const handleSave = () => {
    // Implementar lógica de salvar configurações
    setShowSuccess(true);
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Configurações
        </Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Salvar Alterações
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <BusinessIcon color="primary" />
                <Typography variant="h6">Informações da Clínica</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome da Clínica"
                    value={settings.clinicName}
                    onChange={(e) => handleChange('clinicName', '', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={settings.email}
                    onChange={(e) => handleChange('email', '', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Telefone"
                    value={settings.phone}
                    onChange={(e) => handleChange('phone', '', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Endereço"
                    value={settings.address}
                    onChange={(e) => handleChange('address', '', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Horário de Funcionamento"
                    value={settings.workingHours}
                    onChange={(e) => handleChange('workingHours', '', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Fuso Horário</InputLabel>
                    <Select
                      value={settings.timezone}
                      label="Fuso Horário"
                      onChange={(e) => handleChange('timezone', '', e.target.value)}
                    >
                      <MenuItem value="America/Sao_Paulo">São Paulo (GMT-3)</MenuItem>
                      <MenuItem value="America/Manaus">Manaus (GMT-4)</MenuItem>
                      <MenuItem value="America/Belem">Belém (GMT-3)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <NotificationsIcon color="primary" />
                <Typography variant="h6">Notificações</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.email}
                        onChange={(e) => handleChange('notifications', 'email', e.target.checked)}
                      />
                    }
                    label="Notificações por Email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.sms}
                        onChange={(e) => handleChange('notifications', 'sms', e.target.checked)}
                      />
                    }
                    label="Notificações por SMS"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.push}
                        onChange={(e) => handleChange('notifications', 'push', e.target.checked)}
                      />
                    }
                    label="Notificações Push"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <SecurityIcon color="primary" />
                <Typography variant="h6">Segurança</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.security.twoFactor}
                        onChange={(e) => handleChange('security', 'twoFactor', e.target.checked)}
                      />
                    }
                    label="Autenticação em Dois Fatores"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Tempo de Sessão (minutos)"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Expiração de Senha (dias)"
                    value={settings.security.passwordExpiry}
                    onChange={(e) => handleChange('security', 'passwordExpiry', parseInt(e.target.value))}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <PaymentIcon color="primary" />
                <Typography variant="h6">Configurações de Pagamento</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.payment.stripeEnabled}
                        onChange={(e) => handleChange('payment', 'stripeEnabled', e.target.checked)}
                      />
                    }
                    label="Habilitar Stripe"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Chave do Stripe"
                    value={settings.payment.stripeKey}
                    onChange={(e) => handleChange('payment', 'stripeKey', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Moeda</InputLabel>
                    <Select
                      value={settings.payment.currency}
                      label="Moeda"
                      onChange={(e) => handleChange('payment', 'currency', e.target.value)}
                    >
                      <MenuItem value="BRL">Real (BRL)</MenuItem>
                      <MenuItem value="USD">Dólar (USD)</MenuItem>
                      <MenuItem value="EUR">Euro (EUR)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Configurações salvas com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings; 