import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tooltip,
  Tabs,
  Tab,
  Fab,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
} from '@mui/material';
import {
  People as PeopleIcon,
  Event as EventIcon,
  LocalHospital as DoctorIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  AccessTime as AccessTimeIcon,
  PriorityHigh as PriorityHighIcon,
  MedicalServices as MedicalServicesIcon,
  Description as DescriptionIcon,
  Send as SendIcon,
  EventRepeat as EventRepeatIcon,
  PersonAdd as PersonAddIcon,
  Assignment as AssignmentIcon,
  Receipt as ReceiptIcon,
  ListAlt as ListAltIcon,
  HowToReg as HowToRegIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  CalendarMonth as CalendarMonthIcon,
  Insights as InsightsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { DashboardData } from '../types/dashboard';
import { fetchDashboardData } from '../services/dashboardService';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Appointment {
  id: string;
  patientName: string;
  patientAvatar?: string;
  doctorName: string;
  doctorAvatar?: string;
  date: Date;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  symptoms?: string;
  notes?: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  change?: number;
  changeColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, subtitle, change, changeColor }) => (
  <Paper
    elevation={2}
    sx={{
      p: 3,
      height: '100%',
      borderRadius: 2,
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '4px',
        background: color,
      }
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Box 
        sx={{ 
          p: 1, 
          bgcolor: `${color}20`, 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
    </Box>
    
    <Typography variant="h4" component="div" fontWeight="bold" sx={{ mb: 1 }}>
      {value}
    </Typography>
    
    {change && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          variant="body2"
          sx={{
            color: changeColor,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
        </Typography>
        <Typography variant="caption" color="text.secondary">
          vs. mês anterior
        </Typography>
      </Box>
    )}
  </Paper>
);

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [timeRange, setTimeRange] = useState('week');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDashboardData();
      setDashboardData(data);
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError('Falha ao carregar dados do dashboard. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRescheduleClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(format(appointment.date, 'yyyy-MM-dd'));
    setNewTime(appointment.time);
    setRescheduleDialogOpen(true);
  };

  const handleRescheduleConfirm = () => {
    // Aqui você implementaria a lógica para atualizar o agendamento
    setSnackbarMessage('Agendamento reagendado com sucesso!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    setRescheduleDialogOpen(false);
    loadDashboardData(); // Recarregar dados após reagendamento
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'primary';
      case 'cancelled':
        return 'error';
      case 'in-progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  // Dados de exemplo para os gráficos
  const appointmentData = [
    { name: 'Jan', agendamentos: 40, concluídos: 35, cancelados: 5 },
    { name: 'Fev', agendamentos: 30, concluídos: 28, cancelados: 2 },
    { name: 'Mar', agendamentos: 45, concluídos: 40, cancelados: 5 },
    { name: 'Abr', agendamentos: 50, concluídos: 45, cancelados: 5 },
    { name: 'Mai', agendamentos: 35, concluídos: 30, cancelados: 5 },
    { name: 'Jun', agendamentos: 40, concluídos: 35, cancelados: 5 },
  ];

  const revenueData = [
    { name: 'Jan', receita: 4000 },
    { name: 'Fev', receita: 3000 },
    { name: 'Mar', receita: 4500 },
    { name: 'Abr', receita: 5000 },
    { name: 'Mai', receita: 3500 },
    { name: 'Jun', receita: 4000 },
  ];

  const patientTypeData = [
    { name: 'Novos', value: 30 },
    { name: 'Retornantes', value: 70 },
  ];

  const getAppointmentsByDay = () => {
    if (!appointments.length) return [];
    
    const today = new Date();
    let startDate, endDate;
    
    if (timeRange === 'week') {
      startDate = startOfWeek(today, { weekStartsOn: 1 });
      endDate = endOfWeek(today, { weekStartsOn: 1 });
    } else {
      startDate = startOfMonth(today);
      endDate = endOfMonth(today);
    }
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    return days.map(day => {
      const dayAppointments = appointments.filter(appointment => 
        isSameDay(appointment.date, day)
      );
      
      return {
        date: format(day, 'dd/MM', { locale: ptBR }),
        name: format(day, 'EEE', { locale: ptBR }),
        consultas: dayAppointments.length,
        agendadas: dayAppointments.filter(a => a.status === 'scheduled').length,
        concluidas: dayAppointments.filter(a => a.status === 'completed').length,
        canceladas: dayAppointments.filter(a => a.status === 'cancelled').length,
      };
    });
  };
  
  const getAppointmentsByType = () => {
    if (!appointments.length) return [];
    
    const types = {
      consultation: { name: 'Consulta', value: 0 },
      followUp: { name: 'Retorno', value: 0 },
      examination: { name: 'Exame', value: 0 }
    };
    
    appointments.forEach(appointment => {
      if (types[appointment.status]) {
        types[appointment.status].value += 1;
      }
    });
    
    return Object.values(types);
  };
  
  const getAppointmentsByStatus = () => {
    if (!appointments.length) return [];
    
    const statusCount = {
      scheduled: { name: 'Agendado', value: 0 },
      confirmed: { name: 'Confirmado', value: 0 },
      completed: { name: 'Concluído', value: 0 },
      cancelled: { name: 'Cancelado', value: 0 }
    };
    
    appointments.forEach(appointment => {
      if (statusCount[appointment.status]) {
        statusCount[appointment.status].value += 1;
      }
    });
    
    return Object.values(statusCount);
  };
  
  const getAppointmentsByDoctor = () => {
    if (!appointments.length || !doctors.length) return [];
    
    const doctorAppointments = {};
    
    appointments.forEach(appointment => {
      if (!doctorAppointments[appointment.doctorName]) {
        doctorAppointments[appointment.doctorName] = 0;
      }
      doctorAppointments[appointment.doctorName] += 1;
    });
    
    return Object.entries(doctorAppointments).map(([name, value]) => ({
      name,
      value
    }));
  };
  
  const getTodayAppointments = () => {
    const today = new Date();
    return appointments.filter(appointment => 
      isSameDay(appointment.date, today)
    );
  };
  
  const getNewPatientsCount = () => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    const newPatients = patients.filter(patient => {
      const createdAt = patient.createdAt instanceof Timestamp 
        ? patient.createdAt.toDate() 
        : new Date(patient.createdAt);
      return createdAt >= thirtyDaysAgo;
    });
    
    return newPatients.length;
  };
  
  const getCompletionRate = () => {
    if (!appointments.length) return 0;
    
    const completed = appointments.filter(a => a.status === 'completed').length;
    return Math.round((completed / appointments.length) * 100);
  };

  const getPreviousMonthCompletion = () => {
    // Simular mudança comparada ao mês anterior (em ambiente real, buscaria dados do mês anterior)
    return Math.round(Math.random() * 10) - 5;
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangeTimeRange = (range) => {
    setTimeRange(range);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bem-vindo ao seu painel de controle. Aqui você pode visualizar todas as informações importantes sobre sua clínica.
        </Typography>
      </Box>

      {/* Métricas principais */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total de Pacientes"
            value={dashboardData?.patients.total || 0}
            icon={<PeopleIcon fontSize="large" />}
            color="#1976d2"
            subtitle={`${dashboardData?.patients.newThisMonth || 0} novos este mês`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Agendamentos"
            value={dashboardData?.appointments.total || 0}
            icon={<EventIcon fontSize="large" />}
            color="#2e7d32"
            subtitle={`${dashboardData?.appointments.scheduled || 0} agendados`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Médicos"
            value="12"
            icon={<DoctorIcon fontSize="large" />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Receita Mensal"
            value={`R$ ${dashboardData?.financial.monthlyRevenue.toLocaleString('pt-BR') || 0}`}
            icon={<TrendingUpIcon fontSize="large" />}
            color="#9c27b0"
            subtitle={`R$ ${dashboardData?.financial.dailyRevenue.toLocaleString('pt-BR') || 0} hoje`}
          />
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Agendamentos por Mês
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={appointmentData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="agendamentos" fill="#1976d2" />
                    <Bar dataKey="concluídos" fill="#2e7d32" />
                    <Bar dataKey="cancelados" fill="#d32f2f" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribuição de Pacientes
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={patientTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {patientTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs para diferentes visualizações */}
      <Card sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<InsightsIcon />} label="Análise" />
          <Tab icon={<AssignmentIcon />} label="Detalhes" />
          <Tab icon={<AccessTimeIcon />} label="Agenda Hoje" />
        </Tabs>

        {/* Tab 1: Próximos Agendamentos */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Paciente</TableCell>
                  <TableCell>Médico</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Prioridade</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardData?.upcomingAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.patientName}</TableCell>
                    <TableCell>{appointment.doctorName}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>
                      <Chip 
                        label="Agendado" 
                        color="primary" 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label="Média" 
                        color="warning" 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Reagendar">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleRescheduleClick({
                            id: appointment.id,
                            patientName: appointment.patientName,
                            doctorName: appointment.doctorName,
                            date: new Date(appointment.date),
                            time: appointment.time,
                            status: 'scheduled',
                            priority: 'medium'
                          })}
                        >
                          <EventRepeatIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton size="small" color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab 2: Agendamentos Recentes */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Paciente</TableCell>
                  <TableCell>Médico</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardData?.recentAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.patientName}</TableCell>
                    <TableCell>{appointment.doctorName}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>
                      <Chip 
                        label={appointment.status === 'completed' ? 'Concluído' : 'Cancelado'} 
                        color={appointment.status === 'completed' ? 'success' : 'error'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Ver Detalhes">
                        <IconButton size="small" color="primary">
                          <DescriptionIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab 3: Pacientes Prioritários */}
        <TabPanel value={tabValue} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Paciente</TableCell>
                  <TableCell>Condição</TableCell>
                  <TableCell>Última Consulta</TableCell>
                  <TableCell>Próxima Consulta</TableCell>
                  <TableCell>Prioridade</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>João Silva</TableCell>
                  <TableCell>Diabetes Tipo 2</TableCell>
                  <TableCell>15/05/2023</TableCell>
                  <TableCell>22/06/2023</TableCell>
                  <TableCell>
                    <Chip 
                      label="Alta" 
                      color="error" 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Ver Prontuário">
                      <IconButton size="small" color="primary">
                        <DescriptionIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Agendar Consulta">
                      <IconButton size="small" color="primary">
                        <EventIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Maria Oliveira</TableCell>
                  <TableCell>Hipertensão</TableCell>
                  <TableCell>10/06/2023</TableCell>
                  <TableCell>05/07/2023</TableCell>
                  <TableCell>
                    <Chip 
                      label="Média" 
                      color="warning" 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Ver Prontuário">
                      <IconButton size="small" color="primary">
                        <DescriptionIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Agendar Consulta">
                      <IconButton size="small" color="primary">
                        <EventIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Card>

      {/* Dialog de reagendamento */}
      {/* <Dialog open={rescheduleDialogOpen} onClose={() => setRescheduleDialogOpen(false)}>
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
                Hora Atual: {selectedAppointment.time}
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
      </Dialog> */}

      {/* Snackbar para mensagens */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box component="div" sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default Dashboard;