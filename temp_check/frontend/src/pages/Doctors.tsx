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
  Tooltip,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocalHospital as HospitalIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  crm: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

const Doctors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Dados mockados para exemplo
  const doctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Carlos Silva',
      specialty: 'Clínico Geral',
      crm: '12345/SP',
      email: 'carlos.silva@mediflow.com',
      phone: '(11) 99999-9999',
      address: 'Av. Paulista, 1000 - São Paulo, SP',
      status: 'active',
    },
    {
      id: 2,
      name: 'Dra. Ana Oliveira',
      specialty: 'Cardiologista',
      crm: '54321/SP',
      email: 'ana.oliveira@mediflow.com',
      phone: '(11) 98888-8888',
      address: 'Rua Augusta, 500 - São Paulo, SP',
      status: 'active',
    },
    {
      id: 3,
      name: 'Dr. Pedro Santos',
      specialty: 'Ortopedista',
      crm: '98765/SP',
      email: 'pedro.santos@mediflow.com',
      phone: '(11) 97777-7777',
      address: 'Av. Brigadeiro Faria Lima, 2000 - São Paulo, SP',
      status: 'inactive',
    },
  ];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenDialog = (doctor?: Doctor) => {
    setSelectedDoctor(doctor || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDoctor(null);
  };

  const handleSaveDoctor = () => {
    // Implementar lógica de salvar médico
    handleCloseDialog();
  };

  const handleDeleteDoctor = (id: number) => {
    // Implementar lógica de deletar médico
    console.log('Delete doctor:', id);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.crm.includes(searchTerm)
  );

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Médicos
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
          Adicionar Médico
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar por nome, especialidade ou CRM"
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
                  label={`${doctors.filter(d => d.status === 'active').length} Ativos`}
                  color="success"
                />
                <Chip
                  icon={<HospitalIcon />}
                  label={`${doctors.filter(d => d.status === 'inactive').length} Inativos`}
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
              <TableCell>Médico</TableCell>
              <TableCell>Especialidade</TableCell>
              <TableCell>Contato</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDoctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={doctor.avatar}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    >
                      <HospitalIcon />
                    </Avatar>
                    <Typography>{doctor.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={<WorkIcon />}
                    label={doctor.specialty}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">{doctor.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2">{doctor.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {doctor.address}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={doctor.status === 'active' ? 'Ativo' : 'Inativo'}
                    color={doctor.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Tooltip title="Visualizar">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(doctor)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(doctor)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteDoctor(doctor.id)}
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
          {selectedDoctor ? 'Editar Médico' : 'Adicionar Médico'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nome"
              fullWidth
              defaultValue={selectedDoctor?.name}
            />
            <TextField
              label="Especialidade"
              fullWidth
              defaultValue={selectedDoctor?.specialty}
            />
            <TextField
              label="CRM"
              fullWidth
              defaultValue={selectedDoctor?.crm}
            />
            <TextField
              label="E-mail"
              fullWidth
              type="email"
              defaultValue={selectedDoctor?.email}
            />
            <TextField
              label="Telefone"
              fullWidth
              defaultValue={selectedDoctor?.phone}
            />
            <TextField
              label="Endereço"
              fullWidth
              defaultValue={selectedDoctor?.address}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                defaultValue={selectedDoctor?.status || 'active'}
              >
                <MenuItem value="active">Ativo</MenuItem>
                <MenuItem value="inactive">Inativo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveDoctor}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Doctors; 