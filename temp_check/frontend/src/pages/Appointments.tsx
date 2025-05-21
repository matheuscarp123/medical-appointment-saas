import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Fab,
  Zoom,
} from '@mui/material';
import { 
  Add as AddIcon, 
  EventRepeat as EventRepeatIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAppointmentsByDateRange, updateAppointment } from '../services/appointmentService';
import { format, subMonths, addMonths, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment } from '../types/entities';
import { Timestamp } from 'firebase/firestore';

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'scheduled', label: 'Agendado' },
  { value: 'completed', label: 'Concluído' },
  { value: 'cancelled', label: 'Cancelado' },
];

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [showFab, setShowFab] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const startDate = subMonths(new Date(), 1);
        const endDate = addMonths(new Date(), 1);
        const fetchedAppointments = await getAppointmentsByDateRange(startDate, endDate);
        setAppointments(fetchedAppointments.map(appointment => ({
          ...appointment,
          date: typeof appointment.date === 'string' ? new Date(appointment.date) : appointment.date
        })));
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 100;
      setShowFab(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      (appointment.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (appointment.doctorName || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      statusFilter === 'all' || appointment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '#2196f3';
      case 'completed':
        return '#4caf50';
      case 'cancelled':
        return '#f44336';
      default:
        return 'inherit';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Agendado';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const handleRescheduleClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(format(appointment.date, 'yyyy-MM-dd'));
    setNewTime(format(appointment.date, 'HH:mm'));
    setRescheduleDialogOpen(true);
  };

  const handleRescheduleConfirm = async () => {
    if (!selectedAppointment || !newDate || !newTime) return;

    try {
      const [year, month, day] = newDate.split('-').map(Number);
      const [hours, minutes] = newTime.split(':').map(Number);
      const newDateTime = new Date(year, month - 1, day, hours, minutes);

      await updateAppointment(selectedAppointment.id, {
        ...selectedAppointment,
        date: newDateTime
      });

      setRescheduleDialogOpen(false);
      setSnackbarMessage('Consulta reagendada com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Atualizar a lista de consultas
      const startDate = subMonths(new Date(), 1);
      const endDate = addMonths(new Date(), 1);
      const fetchedAppointments = await getAppointmentsByDateRange(startDate, endDate);
      setAppointments(fetchedAppointments.map(appointment => ({
        ...appointment,
        date: appointment.date instanceof Date ? appointment.date : new Date(appointment.date)
      })));
    } catch (error) {
      console.error('Erro ao reagendar consulta:', error);
      setSnackbarMessage('Erro ao reagendar consulta. Tente novamente.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Consultas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
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
          onClick={() => navigate('/dashboard/nova-consulta')}
        >
          Agendar Nova Consulta
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={8}>
          <TextField
            fullWidth
            label="Buscar por paciente ou médico"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Paciente</TableCell>
                <TableCell>Médico</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Prioridade</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Nenhuma consulta encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((appointment) => (
                    <TableRow
                      key={appointment.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell onClick={() => navigate(`/appointments/${appointment.id}`)}>
                        {appointment.patientName}
                      </TableCell>
                      <TableCell onClick={() => navigate(`/appointments/${appointment.id}`)}>
                        {appointment.doctorName}
                      </TableCell>
                      <TableCell onClick={() => navigate(`/appointments/${appointment.id}`)}>
                        {format(appointment.date, 'dd/MM/yyyy', {
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell onClick={() => navigate(`/appointments/${appointment.id}`)}>
                        {appointment.priority}
                      </TableCell>
                      <TableCell onClick={() => navigate(`/appointments/${appointment.id}`)}>
                        <Box
                          sx={{
                            color: getStatusColor(appointment.status),
                            fontWeight: 'medium',
                          }}
                        >
                          {getStatusLabel(appointment.status)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Reagendar">
                          <IconButton 
                            color="primary" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRescheduleClick(appointment);
                            }}
                          >
                            <EventRepeatIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAppointments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
        />
      </Paper>

      {/* Dialog de reagendamento */}
      <Dialog open={rescheduleDialogOpen} onClose={() => setRescheduleDialogOpen(false)}>
        <DialogTitle>
          Reagendar Consulta
          <IconButton
            aria-label="close"
            onClick={() => setRescheduleDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedAppointment && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Paciente: {selectedAppointment.patientName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Médico: {selectedAppointment.doctorName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Data Atual: {format(selectedAppointment.date, 'dd/MM/yyyy')}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Hora Atual: {format(selectedAppointment.date, 'HH:mm')}
              </Typography>
            </Box>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nova Data"
                type="date"
                fullWidth
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nova Hora"
                type="time"
                fullWidth
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRescheduleDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleRescheduleConfirm} variant="contained" color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensagens */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Zoom in={showFab}>
        <Fab
          color="secondary"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            backgroundColor: 'purple',
            '&:hover': {
              backgroundColor: 'rgb(123, 31, 162)',
            },
          }}
          onClick={() => setRescheduleDialogOpen(true)}
        >
          <ScheduleIcon />
        </Fab>
      </Zoom>
    </Box>
  );
};

export default Appointments; 