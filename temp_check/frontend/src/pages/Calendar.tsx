import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Stack,
  SelectChangeEvent,
  IconButton,
  Chip,
  Tooltip,
  Paper,
  Divider,
  Fade,
  Zoom,
  Slide,
  CircularProgress,
  styled,
  useTheme,
  Badge,
  Alert,
  Snackbar,
  alpha,
  Container,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  LocalHospital as LocalHospitalIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarTodayIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { format, startOfWeek, endOfWeek, addDays, isSameDay, parseISO, isWithinInterval } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, deleteDoc, doc, updateDoc, Timestamp, DocumentData } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { generateSampleData } from '../utils/sampleData';

// Modern styled components
// Calendar Day Cell for Month Grid
const CalendarDayCell = styled(Box)<{
  isToday?: boolean;
  isSelected?: boolean;
  isBooked?: boolean;
  isAvailable?: boolean;
}>(({ theme, isToday, isSelected, isBooked, isAvailable }) => ({
  position: 'relative',
  minHeight: 56,
  borderRadius: 12,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  margin: 2,
  padding: theme.spacing(0.5, 0.5, 1, 0.5),
  background: isSelected
    ? `linear-gradient(120deg, ${theme.palette.primary.light} 60%, ${theme.palette.primary.main} 100%)`
    : isToday
    ? `linear-gradient(120deg, ${theme.palette.secondary.light} 60%, ${theme.palette.secondary.main} 100%)`
    : 'transparent',
  boxShadow: isSelected || isToday
    ? '0 2px 12px 0 rgba(0,0,0,0.08), 0 0 0 2px rgba(0,0,0,0.04)'
    : 'none',
  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
  cursor: 'pointer',
  outline: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
  filter: isBooked ? 'grayscale(0.3)' : 'none',
  '&:hover': {
    boxShadow: '0 4px 18px 0 rgba(0,0,0,0.13)',
    background: isSelected
      ? `linear-gradient(120deg, ${theme.palette.primary.light} 60%, ${theme.palette.primary.main} 100%)`
      : isToday
      ? `linear-gradient(120deg, ${theme.palette.secondary.light} 60%, ${theme.palette.secondary.main} 100%)`
      : theme.palette.action.hover,
    zIndex: 2,
    transition: 'all 0.18s',
  },
  '& .vertical-glow': isToday || isSelected
    ? {
        position: 'absolute',
        left: '50%',
        top: 6,
        width: 6,
        height: 32,
        borderRadius: 8,
        background: isToday
          ? 'linear-gradient(180deg, rgba(255,255,255,0.55) 10%, rgba(255,255,255,0.10) 90%)'
          : 'linear-gradient(180deg, rgba(255,255,255,0.35) 10%, rgba(255,255,255,0.06) 90%)',
        transform: 'translateX(-50%)',
        filter: 'blur(0.5px)',
        pointerEvents: 'none',
        opacity: 0.85,
      }
    : {},
}));

const CalendarMonthGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 4,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const DayNumber = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: 16,
  color: theme.palette.text.primary,
  textShadow: '0 1px 2px rgba(0,0,0,0.08)',
  marginBottom: 2,
}));

const StatusDot = styled('span')<{
  colorType: 'available' | 'booked';
}>(({ theme, colorType }) => ({
  display: 'inline-block',
  width: 9,
  height: 9,
  borderRadius: '50%',
  marginTop: 2,
  background: colorType === 'available' ? theme.palette.success.main : theme.palette.error.main,
  boxShadow: colorType === 'available'
    ? '0 0 4px 1px rgba(76,175,80,0.14)'
    : '0 0 4px 1px rgba(244,67,54,0.14)',
  border: '1.5px solid white',
}));
const AppointmentCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'visible',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: 12,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  boxShadow: '0 6px 14px rgba(0,0,0,0.07)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
    '& .appointment-actions': {
      opacity: 1,
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
}));

const CalendarHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  padding: theme.spacing(2, 3),
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  color: 'white',
}));

const CalendarNav = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const DateChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  gap: theme.spacing(2),
  '& svg': {
    fontSize: 60,
    opacity: 0.4,
  },
}));

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  type: string;
  status: 'scheduled' | 'confirmed' | 'canceled' | 'completed' | 'missed';
  notes?: string;
  symptoms?: string[];
  createdAt: Date;
}

interface AppointmentData extends DocumentData {
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: Timestamp;
  type: string;
  status: 'scheduled' | 'confirmed' | 'canceled' | 'completed' | 'missed';
  notes?: string;
  symptoms?: string[];
  createdAt: Timestamp;
}

const Calendar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success');
  const [pageReady, setPageReady] = useState(false);
  const [isGeneratingSampleData, setIsGeneratingSampleData] = useState(false);

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Load appointments from Firebase
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        const appointmentsRef = collection(db, 'appointments');
        const appointmentsQuery = query(
          appointmentsRef,
          orderBy('date', 'asc')
        );
        
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        const appointmentsData = appointmentsSnapshot.docs.map(doc => {
          const data = doc.data() as AppointmentData;
          return {
            id: doc.id,
            patientId: data.patientId || '',
            patientName: data.patientName || '',
            doctorId: data.doctorId || '',
            doctorName: data.doctorName || '',
            date: data.date?.toDate() || new Date(),
            type: data.type || 'consultation',
            status: data.status || 'scheduled',
            notes: data.notes || '',
            symptoms: data.symptoms || [],
            createdAt: data.createdAt?.toDate() || new Date(),
          } as Appointment;
        });
        
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error loading appointments:', error);
        setSnackbarMessage('Erro ao carregar consultas');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    
    loadAppointments();
  }, []);

  // Filter appointments based on selected date and view mode
  useEffect(() => {
    if (appointments.length === 0) {
      setFilteredAppointments([]);
      return;
    }
    
    let filtered: Appointment[] = [];
    
    switch (viewMode) {
      case 'day':
        filtered = appointments.filter(appointment => 
          isSameDay(appointment.date, selectedDate)
        );
        break;
      case 'week':
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
        filtered = appointments.filter(appointment => 
          isWithinInterval(appointment.date, { start: weekStart, end: weekEnd })
        );
        break;
      case 'month':
        const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
        filtered = appointments.filter(appointment => 
          isWithinInterval(appointment.date, { start: monthStart, end: monthEnd })
        );
        break;
    }
    
    setFilteredAppointments(filtered);
  }, [appointments, selectedDate, viewMode]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleViewModeChange = (event: SelectChangeEvent<'day' | 'week' | 'month'>) => {
    setViewMode(event.target.value as 'day' | 'week' | 'month');
  };

  const handleNewAppointment = () => {
    navigate('/dashboard/nova-consulta');
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
  };

  const handlePreviousDate = () => {
    switch (viewMode) {
      case 'day':
        setSelectedDate(prevDate => addDays(prevDate, -1));
        break;
      case 'week':
        setSelectedDate(prevDate => addDays(prevDate, -7));
        break;
      case 'month':
        setSelectedDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
        break;
    }
  };

  const handleNextDate = () => {
    switch (viewMode) {
      case 'day':
        setSelectedDate(prevDate => addDays(prevDate, 1));
        break;
      case 'week':
        setSelectedDate(prevDate => addDays(prevDate, 7));
        break;
      case 'month':
        setSelectedDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
        break;
    }
  };

  const handleUpdateStatus = async (appointmentId: string, newStatus: 'scheduled' | 'confirmed' | 'canceled' | 'completed' | 'missed') => {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, {
        status: newStatus,
        updatedAt: Timestamp.now()
      });
      
      // Update local state
      setAppointments(prevAppointments => 
        prevAppointments.map(app => 
          app.id === appointmentId ? { ...app, status: newStatus } : app
        )
      );
      
      setSnackbarMessage(`Status atualizado para ${
        newStatus === 'scheduled' ? 'Agendado' :
        newStatus === 'confirmed' ? 'Confirmado' :
        newStatus === 'canceled' ? 'Cancelado' :
        newStatus === 'completed' ? 'Concluído' : 'Não Compareceu'
      }`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      setSnackbarMessage('Erro ao atualizar status da consulta');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta consulta?')) {
      try {
        const appointmentRef = doc(db, 'appointments', appointmentId);
        await deleteDoc(appointmentRef);
        
        // Update local state
        setAppointments(prevAppointments => 
          prevAppointments.filter(app => app.id !== appointmentId)
        );
        
        setSnackbarMessage('Consulta excluída com sucesso');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error deleting appointment:', error);
        setSnackbarMessage('Erro ao excluir consulta');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return theme.palette.info.main;
      case 'confirmed':
        return theme.palette.success.main;
      case 'canceled':
        return theme.palette.error.main;
      case 'completed':
        return theme.palette.primary.main;
      case 'missed':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Agendado';
      case 'confirmed':
        return 'Confirmado';
      case 'canceled':
        return 'Cancelado';
      case 'completed':
        return 'Concluído';
      case 'missed':
        return 'Não Compareceu';
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'Consulta';
      case 'followUp':
        return 'Retorno';
      case 'examination':
        return 'Exame';
      default:
        return type;
    }
  };

  const getDateRangeText = () => {
    switch (viewMode) {
      case 'day':
        return format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
      case 'week': {
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
        return `${format(weekStart, "d MMM", { locale: ptBR })} - ${format(weekEnd, "d MMM yyyy", { locale: ptBR })}`;
      }
      case 'month':
        return format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleGenerateSampleData = async () => {
    setIsGeneratingSampleData(true);
    try {
      await generateSampleData(15); // Generate 15 sample appointments
      setSnackbarMessage('Dados de exemplo gerados com sucesso');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Reload appointments after generating sample data
      const appointmentsRef = collection(db, 'appointments');
      const appointmentsQuery = query(
        appointmentsRef,
        orderBy('date', 'asc')
      );
      
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      const appointmentsData = appointmentsSnapshot.docs.map(doc => {
        const data = doc.data() as AppointmentData;
        return {
          id: doc.id,
          patientId: data.patientId || '',
          patientName: data.patientName || '',
          doctorId: data.doctorId || '',
          doctorName: data.doctorName || '',
          date: data.date?.toDate() || new Date(),
          type: data.type || 'consultation',
          status: data.status || 'scheduled',
          notes: data.notes || '',
          symptoms: data.symptoms || [],
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Appointment;
      });
      
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error generating sample data:', error);
      setSnackbarMessage('Erro ao gerar dados de exemplo');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsGeneratingSampleData(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <CalendarHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handlePreviousDate} size="large">
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: 'white' }}>
            {getDateRangeText()}
          </Typography>
          <IconButton onClick={handleNextDate} size="large">
            <ChevronRightIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewAppointment}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              fontWeight: 600,
              '&:hover': {
                bgcolor: alpha('#fff', 0.9),
              }
            }}
          >
            Nova Consulta
          </Button>
          
          {user && user.email === 'admin@mediflow.com' && (
            <Tooltip title="Gerar dados de exemplo para demonstração">
              <Button
                variant="outlined"
                onClick={handleGenerateSampleData}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.4)',
                    borderColor: 'white',
                  }
                }}
                disabled={isGeneratingSampleData}
              >
                {isGeneratingSampleData ? <CircularProgress size={24} color="inherit" /> : 'Gerar Exemplos'}
              </Button>
            </Tooltip>
          )}
        </Box>
      </CalendarHeader>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Slide direction="right" in={pageReady} timeout={400}>
            <Card elevation={3} sx={{ borderRadius: 2, overflow: 'visible' }}>
              <CardContent>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                  <DatePicker
                    label="Selecionar Data"
                    value={selectedDate}
                    onChange={handleDateChange}
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined'
                      }
                    }}
                  />
                </LocalizationProvider>
                
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel>Visualização</InputLabel>
                  <Select
                    value={viewMode}
                    label="Visualização"
                    onChange={handleViewModeChange}
                  >
                    <MenuItem value="day">Dia</MenuItem>
                    <MenuItem value="week">Semana</MenuItem>
                    <MenuItem value="month">Mês</MenuItem>
                  </Select>
                </FormControl>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Legenda:
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Badge variant="dot" sx={{ '& .MuiBadge-badge': { backgroundColor: theme.palette.success.main } }} />
                      <Typography variant="body2">Confirmado</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Badge variant="dot" sx={{ '& .MuiBadge-badge': { backgroundColor: theme.palette.info.main } }} />
                      <Typography variant="body2">Agendado</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Badge variant="dot" sx={{ '& .MuiBadge-badge': { backgroundColor: theme.palette.warning.main } }} />
                      <Typography variant="body2">Não Compareceu</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Badge variant="dot" sx={{ '& .MuiBadge-badge': { backgroundColor: theme.palette.error.main } }} />
                      <Typography variant="body2">Cancelado</Typography>
                    </Box>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Slide>
        </Grid>

        <Grid item xs={12} md={8}>
          <Slide direction="left" in={pageReady} timeout={500}>
            <Box>
              {/* Custom Month Grid - only for month view */}
              {viewMode === 'month' && (
                <CalendarMonthGrid>
                  {(() => {
                    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
                    const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
                    const startDay = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1; // Monday as first
                    const cells = [];
                    // Fill empty cells before month starts
                    for (let i = 0; i < startDay; i++) {
                      cells.push(<Box key={`empty-start-${i}`} />);
                    }
                    // Render days
                    for (let day = 1; day <= daysInMonth; day++) {
                      const dateObj = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                      const isToday = isSameDay(dateObj, new Date());
                      const isSelected = isSameDay(dateObj, selectedDate);
                      const dayAppointments = appointments.filter(a => isSameDay(a.date, dateObj));
                      const isBooked = dayAppointments.length > 0;
                      const isAvailable = !isBooked; // If no appointments, available
                      cells.push(
                        <CalendarDayCell
                          key={day}
                          isToday={isToday}
                          isSelected={isSelected}
                          isBooked={isBooked}
                          isAvailable={isAvailable}
                          onClick={() => setSelectedDate(dateObj)}
                          tabIndex={0}
                          aria-label={`Dia ${day}`}
                        >
                          <DayNumber
                            sx={{
                              color: isSelected ? 'primary.contrastText' : isToday ? 'secondary.contrastText' : undefined,
                              textShadow: isSelected || isToday ? '0 2px 8px rgba(0,0,0,0.18)' : undefined,
                            }}
                          >
                            {day}
                          </DayNumber>
                          {(isBooked || isAvailable) && (
                            <StatusDot colorType={isBooked ? 'booked' : 'available'} />
                          )}
                          {(isToday || isSelected) && (
                            <span className="vertical-glow" />
                          )}
                        </CalendarDayCell>
                      );
                    }
                    // Fill trailing empty cells
                    const trailing = 7 - ((cells.length) % 7);
                    if (trailing < 7) {
                      for (let i = 0; i < trailing; i++) {
                        cells.push(<Box key={`empty-end-${i}`} />);
                      }
                    }
                    return cells;
                  })()}
                </CalendarMonthGrid>
              )}
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : filteredAppointments.length > 0 ? (
                <Stack spacing={2}>
                  {filteredAppointments.map((appointment, index) => (
                    <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }} key={appointment.id}>
                      <AppointmentCard
                        sx={{
                          '&::before': {
                            backgroundColor: getStatusColor(appointment.status),
                          },
                        }}
                      >
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <AccessTimeIcon fontSize="small" color="primary" />
                                <Typography variant="body2" color="primary.main" fontWeight={600}>
                                  {format(appointment.date, 'HH:mm')} - {getTypeText(appointment.type)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <PersonIcon fontSize="small" color="info" />
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {appointment.patientName}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocalHospitalIcon fontSize="small" color="secondary" />
                                <Typography variant="body2" color="text.secondary">
                                  {appointment.doctorName}
                                </Typography>
                              </Box>
                              {appointment.notes && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  {appointment.notes}
                                </Typography>
                              )}
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                                <Chip
                                  label={getStatusText(appointment.status)}
                                  color={
                                    appointment.status === 'confirmed' ? 'success' :
                                    appointment.status === 'scheduled' ? 'info' :
                                    appointment.status === 'canceled' ? 'error' :
                                    appointment.status === 'completed' ? 'primary' : 'warning'
                                  }
                                  size="small"
                                />
                                <Box 
                                  className="appointment-actions" 
                                  sx={{ 
                                    display: 'flex', 
                                    mt: 1, 
                                    opacity: 0, 
                                    transition: 'opacity 0.2s ease' 
                                  }}
                                >
                                  <Tooltip title="Editar consulta">
                                    <IconButton 
                                      size="small" 
                                      color="primary"
                                      onClick={() => handleEditAppointment(appointment)}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  
                                  {appointment.status === 'scheduled' && (
                                    <Tooltip title="Confirmar consulta">
                                      <IconButton 
                                        size="small" 
                                        color="success"
                                        onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                                      >
                                        <CheckCircleIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                  
                                  <Tooltip title="Excluir consulta">
                                    <IconButton 
                                      size="small" 
                                      color="error"
                                      onClick={() => handleDeleteAppointment(appointment.id)}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </AppointmentCard>
                    </Zoom>
                  ))}
                </Stack>
              ) : (
                <EmptyState>
                  <ScheduleIcon />
                  <Typography variant="h6" sx={{ opacity: 0.7 }}>
                    Nenhuma consulta encontrada
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Não há consultas agendadas para este período
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={handleNewAppointment}
                  >
                    Agendar Nova Consulta
                  </Button>
                </EmptyState>
              )}
            </Box>
          </Slide>
        </Grid>
      </Grid>

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
    </Container>
  );
};

export default Calendar;