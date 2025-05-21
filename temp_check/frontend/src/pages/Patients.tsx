import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocalHospital as HospitalIcon
} from '@mui/icons-material';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  lastAppointment: string;
  nextAppointment: string;
  status: 'active' | 'inactive';
}

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Dados mockados para exemplo
  const [patients] = useState<Patient[]>([
    {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '(11) 99999-9999',
      lastAppointment: '2024-02-15',
      nextAppointment: '2024-03-20',
      status: 'active'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '(11) 98888-8888',
      lastAppointment: '2024-01-10',
      nextAppointment: '2024-04-05',
      status: 'active'
    },
    {
      id: 3,
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@email.com',
      phone: '(11) 97777-7777',
      lastAppointment: '2023-12-20',
      nextAppointment: '',
      status: 'inactive'
    }
  ]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenDialog = (patient?: Patient) => {
    setSelectedPatient(patient || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
  };

  const handleSavePatient = () => {
    // Implementar lógica de salvar paciente
    handleCloseDialog();
  };

  const handleDeletePatient = (id: number) => {
    // Implementar lógica de deletar paciente
    console.log('Delete patient:', id);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Pacientes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            fontWeight: 600,
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.12)',
            background: 'linear-gradient(90deg, #1976d2, #64b5f6)',
            transition: 'all 0.2s',
            '&:hover': {
              background: 'linear-gradient(90deg, #1565c0, #2196f3)',
              boxShadow: '0 4px 16px rgba(25, 118, 210, 0.18)',
              transform: 'translateY(-2px) scale(1.03)',
            },
          }}
        >
          Novo Paciente
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar pacientes..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Chip
                  icon={<HospitalIcon />}
                  label={`${patients.filter(p => p.status === 'active').length} Ativos`}
                  color="success"
                />
                <Chip
                  icon={<HospitalIcon />}
                  label={`${patients.filter(p => p.status === 'inactive').length} Inativos`}
                  color="default"
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Contato</TableCell>
              <TableCell>Última Consulta</TableCell>
              <TableCell>Próxima Consulta</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">{patient.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2">{patient.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{patient.lastAppointment || '-'}</TableCell>
                <TableCell>{patient.nextAppointment || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={patient.status === 'active' ? 'Ativo' : 'Inativo'}
                    color={patient.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Tooltip title="Visualizar">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(patient)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(patient)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        size="small"
                        onClick={() => handleDeletePatient(patient.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedPatient ? 'Editar Paciente' : 'Novo Paciente'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nome"
              fullWidth
              defaultValue={selectedPatient?.name}
            />
            <TextField
              label="Email"
              fullWidth
              defaultValue={selectedPatient?.email}
            />
            <TextField
              label="Telefone"
              fullWidth
              defaultValue={selectedPatient?.phone}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSavePatient}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Patients; 