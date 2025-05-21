import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Lock as LockIcon,
  Shield as ShieldIcon,
  VerifiedUser as VerifiedUserIcon,
} from '@mui/icons-material';

interface SecurityInfoPopupProps {
  open: boolean;
  onClose: () => void;
}

const SecurityInfoPopup: React.FC<SecurityInfoPopupProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SecurityIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" component="div">
            Segurança e Privacidade
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LockIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Criptografia de Dados</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                Todos os dados sensíveis são protegidos com criptografia de ponta a ponta,
                utilizando os mais avançados protocolos de segurança disponíveis.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Criptografia AES-256 para dados em repouso
                <br />
                • TLS 1.3 para dados em trânsito
                <br />
                • Chaves de criptografia únicas por usuário
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShieldIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Sigilosidade</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                A privacidade dos nossos usuários é nossa prioridade absoluta.
                Implementamos rigorosas políticas de proteção de dados e sigilo médico.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Conformidade com LGPD e HIPAA
                <br />
                • Acesso restrito a dados sensíveis
                <br />
                • Auditorias regulares de segurança
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VerifiedUserIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Compromisso com a Segurança</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                Nossa plataforma é desenvolvida com foco constante em segurança,
                utilizando as melhores práticas e tecnologias disponíveis para
                garantir a proteção dos dados dos nossos usuários.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Monitoramento 24/7 de segurança
                <br />
                • Atualizações regulares de segurança
                <br />
                • Equipe dedicada de segurança da informação
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="contained" size="large">
          Entendi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SecurityInfoPopup; 