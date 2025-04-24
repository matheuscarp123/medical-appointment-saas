import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
}

const getStatusColor = (status: Appointment['status']) => {
  switch (status) {
    case 'scheduled':
      return 'primary';
    case 'confirmed':
      return 'success';
    case 'completed':
      return 'info';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = (appointment?: Appointment) => {
    setSelectedAppointment(appointment || {
      id: Math.random().toString(),
      patientName: '',
      date: '',
      time: '',
      type: '',
      duration: 30,
      status: 'scheduled',
      notes: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedAppointment(null);
    setOpenDialog(false);
  };

  const handleSaveAppointment = () => {
    if (selectedAppointment) {
      const isNew = !appointments.find(a => a.id === selectedAppointment.id);
      if (isNew) {
        setAppointments([...appointments, selectedAppointment]);
      } else {
        setAppointments(appointments.map(a =>
          a.id === selectedAppointment.id ? selectedAppointment : a
        ));
      }
    }
    handleCloseDialog();
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  const handleStatusChange = (id: string, status: Appointment['status']) => {
    setAppointments(appointments.map(a =>
      a.id === id ? { ...a, status } : a
    ));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">
            Agendamentos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Novo Agendamento
          </Button>
        </Box>

        <List>
          {appointments.map(appointment => (
            <ListItem
              key={appointment.id}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1,
                mb: 1,
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
                  <Typography variant="h6">
                    {appointment.patientName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EventIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {new Date(appointment.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TimeIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {appointment.time}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {appointment.duration} min
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip
                      label={appointment.type}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={appointment.status}
                      size="small"
                      color={getStatusColor(appointment.status)}
                    />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(appointment.id, e.target.value as Appointment['status'])}
                      variant="outlined"
                    >
                      <MenuItem value="scheduled">Agendado</MenuItem>
                      <MenuItem value="confirmed">Confirmado</MenuItem>
                      <MenuItem value="completed">Concluído</MenuItem>
                      <MenuItem value="cancelled">Cancelado</MenuItem>
                    </Select>
                  </FormControl>
                  <IconButton
                    onClick={() => handleOpenDialog(appointment)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteAppointment(appointment.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedAppointment?.id ? 'Editar Agendamento' : 'Novo Agendamento'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome do Paciente"
                value={selectedAppointment?.patientName || ''}
                onChange={(e) => setSelectedAppointment(prev => prev ? {
                  ...prev,
                  patientName: e.target.value,
                } : null)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data"
                type="date"
                value={selectedAppointment?.date || ''}
                onChange={(e) => setSelectedAppointment(prev => prev ? {
                  ...prev,
                  date: e.target.value,
                } : null)}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Horário"
                type="time"
                value={selectedAppointment?.time || ''}
                onChange={(e) => setSelectedAppointment(prev => prev ? {
                  ...prev,
                  time: e.target.value,
                } : null)}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Tipo de Consulta</InputLabel>
                <Select
                  value={selectedAppointment?.type || ''}
                  label="Tipo de Consulta"
                  onChange={(e) => setSelectedAppointment(prev => prev ? {
                    ...prev,
                    type: e.target.value,
                  } : null)}
                >
                  <MenuItem value="routine">Rotina</MenuItem>
                  <MenuItem value="followup">Retorno</MenuItem>
                  <MenuItem value="emergency">Emergência</MenuItem>
                  <MenuItem value="exam">Exame</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Duração (minutos)</InputLabel>
                <Select
                  value={selectedAppointment?.duration || 30}
                  label="Duração (minutos)"
                  onChange={(e) => setSelectedAppointment(prev => prev ? {
                    ...prev,
                    duration: Number(e.target.value),
                  } : null)}
                >
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={30}>30</MenuItem>
                  <MenuItem value={45}>45</MenuItem>
                  <MenuItem value={60}>60</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedAppointment?.status || 'scheduled'}
                  label="Status"
                  onChange={(e) => setSelectedAppointment(prev => prev ? {
                    ...prev,
                    status: e.target.value as Appointment['status'],
                  } : null)}
                >
                  <MenuItem value="scheduled">Agendado</MenuItem>
                  <MenuItem value="confirmed">Confirmado</MenuItem>
                  <MenuItem value="completed">Concluído</MenuItem>
                  <MenuItem value="cancelled">Cancelado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                multiline
                rows={3}
                value={selectedAppointment?.notes || ''}
                onChange={(e) => setSelectedAppointment(prev => prev ? {
                  ...prev,
                  notes: e.target.value,
                } : null)}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveAppointment} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentPage; 