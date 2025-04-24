import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Autocomplete,
  Chip,
  Fade,
  Zoom,
  Slide,
  useTheme,
  Snackbar,
  styled,
  Tooltip,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDoctors } from '../services/doctorService';
import { getPatients } from '../services/patientService';
import { createAppointment, checkDoctorAvailability } from '../services/appointmentService';
import { Doctor, Patient, AppointmentType, User } from '../types/entities';
import { formatDateTime } from '../utils/formatters';
import { collection, addDoc, getDocs, Timestamp, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import AppointmentCalendar from '../components/AppointmentCalendar';

const appointmentTypes: AppointmentType[] = ['consultation', 'followUp', 'examination'];

// Styled components for enhanced visuals
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '6px',
    background: 'linear-gradient(90deg, #1976d2, #64b5f6)',
  },
  '&:hover': {
    boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
    transform: 'translateY(-3px)',
  }
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  borderRadius: '30px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
  transition: 'all 0.3s ease',
  background: 'linear-gradient(90deg, #1976d2, #64b5f6)',
  '&:hover': {
    boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
    background: 'linear-gradient(90deg, #1565c0, #2196f3)',
    transform: 'translateY(-2px)',
  }
}));

const typeLabels = {
  consultation: 'Consulta',
  followUp: 'Retorno',
  examination: 'Exame'
};

const NewAppointment: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(new Date());
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('consultation');
  const [notes, setNotes] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [availableSlots, setAvailableSlots] = useState<Array<{ startTime: string; endTime: string }>>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Animation effect on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch doctors from Firestore
        const doctorsCollectionRef = collection(db, 'doctors');
        const doctorsSnapshot = await getDocs(doctorsCollectionRef);
        const doctorsData = doctorsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as unknown as Doctor[];

        // Fetch patients from Firestore
        const patientsCollectionRef = collection(db, 'patients');
        const patientsSnapshot = await getDocs(patientsCollectionRef);
        const patientsData = patientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as unknown as Patient[];

        setDoctors(doctorsData);
        setPatients(patientsData);
        
        // If no doctors, add a sample doctor for testing
        if (doctorsData.length === 0) {
          try {
            const newDoctorRef = await addDoc(collection(db, 'doctors'), {
              nome: 'Dr. João Silva',
              email: 'joao.silva@mediflow.com',
              telefone: '(11) 99999-8888',
              especialidade: ['Clínico Geral', 'Cardiologia'],
              disponibilidade: {
                monday: ['08:00-12:00', '14:00-18:00'],
                tuesday: ['08:00-12:00', '14:00-18:00'],
                wednesday: ['08:00-12:00'],
                thursday: ['14:00-18:00'],
                friday: ['08:00-12:00', '14:00-18:00'],
              },
              createdAt: Timestamp.now()
            });
            console.log('Sample doctor added with ID: ', newDoctorRef.id);
            
            const doctorSnapshot = await getDoc(newDoctorRef);
            if (doctorSnapshot.exists()) {
              setDoctors([{ id: doctorSnapshot.id, ...doctorSnapshot.data() } as Doctor]);
            }
          } catch (error) {
            console.error('Error adding sample doctor: ', error);
          }
        }

        // If no patients, add a sample patient for testing
        if (patientsData.length === 0) {
          try {
            const newPatientRef = await addDoc(collection(db, 'patients'), {
              nome: 'Maria Oliveira',
              email: 'maria.oliveira@email.com',
              telefone: '(11) 98888-7777',
              dataNascimento: Timestamp.fromDate(new Date('1985-05-15')),
              genero: 'feminino',
              endereco: {
                rua: 'Rua das Flores, 123',
                cidade: 'São Paulo',
                estado: 'SP',
                cep: '01234-567'
              },
              historicoMedico: {
                alergias: ['Penicilina'],
                condicoesCronicas: [],
                medicamentosAtuais: []
              },
              createdAt: Timestamp.now()
            });
            console.log('Sample patient added with ID: ', newPatientRef.id);
            
            const patientSnapshot = await getDoc(newPatientRef);
            if (patientSnapshot.exists()) {
              setPatients([{ id: patientSnapshot.id, ...patientSnapshot.data() } as Patient]);
            }
          } catch (error) {
            console.error('Error adding sample patient: ', error);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar médicos e pacientes. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Check doctor availability when doctor or date changes
  useEffect(() => {
    const checkAvailability = async () => {
      if (selectedDoctor && appointmentDate) {
        try {
          const { slots } = await checkDoctorAvailability(selectedDoctor.id, appointmentDate);
          const availableTimes = slots.map(slot => ({
            startTime: format(slot, 'HH:mm'),
            endTime: format(new Date(slot.getTime() + 30 * 60000), 'HH:mm')
          }));
          setAvailableSlots(availableTimes);
        } catch (error) {
          console.error('Error checking availability:', error);
          setAvailableSlots([]);
        }
      }
    };
    
    checkAvailability();
  }, [selectedDoctor, appointmentDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!selectedDoctor || !selectedPatient || !appointmentDate) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setLoading(true);
      
      // Save appointment to Firestore
      const appointmentsCollectionRef = collection(db, 'appointments');
      const newAppointment = {
        pacienteId: selectedPatient.id,
        pacienteNome: selectedPatient.nome,
        medicoId: selectedDoctor.id,
        medicoNome: selectedDoctor.nome,
        dataHora: Timestamp.fromDate(appointmentDate),
        tipo: appointmentType,
        observacoes: notes,
        sintomas: symptoms,
        status: 'agendado',
        createdAt: Timestamp.now(),
        createdBy: (user as User)?.uid || 'unknown'
      };
      
      const appointmentRef = await addDoc(appointmentsCollectionRef, newAppointment);
      console.log('Appointment created with ID: ', appointmentRef.id);
      
      setSnackbarMessage('Consulta agendada com sucesso!');
      setSnackbarOpen(true);
      setSuccess(true);
      
      // Clear form and redirect after successful submission with animation
      setLoading(false);
      
      // Show success message and redirect with delay
      setTimeout(() => {
        navigate('/dashboard/agenda', { state: { newAppointment: true, appointmentId: appointmentRef.id } });
      }, 1500);
    } catch (err) {
      console.error('Erro ao criar consulta:', err);
      setError('Erro ao criar consulta. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const handleAddSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom('');
    }
  };

  const handleRemoveSymptom = (symptomToRemove: string) => {
    setSymptoms(symptoms.filter(symptom => symptom !== symptomToRemove));
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleDateSelect = (date: Date) => {
    setAppointmentDate(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #1976d2, #64b5f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            Nova Consulta
          </Typography>

          <StyledPaper>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="success" thickness={5} />
                  Consulta agendada com sucesso! Redirecionando para a agenda...
                </Box>
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    options={doctors}
                    getOptionLabel={(doctor) => `Dr. ${doctor.nome} - ${Array.isArray(doctor.especialidade) ? doctor.especialidade.join(', ') : doctor.especialidade || 'Sem especialidade'}`}
                    value={selectedDoctor}
                    onChange={(_, newValue) => setSelectedDoctor(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Médico"
                        required
                        fullWidth
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Autocomplete
                    options={patients}
                    getOptionLabel={(patient) => `${patient.nome} - ${patient.email || 'Sem email'}`}
                    value={selectedPatient}
                    onChange={(_, newValue) => setSelectedPatient(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Paciente"
                        required
                        fullWidth
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                {selectedDoctor && (
                  <Grid item xs={12}>
                    <AppointmentCalendar
                      doctorId={selectedDoctor.id}
                      onDateSelect={handleDateSelect}
                      selectedDate={appointmentDate || undefined}
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Tipo de Consulta</InputLabel>
                    <Select
                      value={appointmentType}
                      onChange={(e) => setAppointmentType(e.target.value as AppointmentType)}
                      label="Tipo de Consulta"
                      variant="outlined"
                    >
                      {appointmentTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {typeLabels[type]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box>
                    <TextField
                      label="Observações"
                      multiline
                      rows={3}
                      fullWidth
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      variant="outlined"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box>
                    <Box mb={2}>
                      <TextField
                        label="Adicionar Sintoma"
                        value={currentSymptom}
                        onChange={(e) => setCurrentSymptom(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSymptom();
                          }
                        }}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <Button
                              onClick={handleAddSymptom}
                              variant="contained"
                              color="primary"
                              disabled={!currentSymptom.trim()}
                              sx={{ ml: 1 }}
                            >
                              Adicionar
                            </Button>
                          ),
                        }}
                      />
                    </Box>

                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {symptoms.map((symptom, index) => (
                        <Chip
                          key={index}
                          label={symptom}
                          onDelete={() => handleRemoveSymptom(symptom)}
                          color="primary"
                          variant="outlined"
                          sx={{ 
                            animation: `fadeIn 0.5s ${index * 0.1}s both`,
                            '@keyframes fadeIn': {
                              from: { opacity: 0, transform: 'translateY(5px)' },
                              to: { opacity: 1, transform: 'translateY(0)' }
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>

                {availableSlots.length > 0 && (
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Horários Disponíveis:
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {availableSlots.map((slot, index) => (
                          <Tooltip key={index} title={`${slot.startTime} às ${slot.endTime}`}>
                            <Chip
                              label={slot.startTime}
                              onClick={() => {
                                const newDate = new Date(appointmentDate || new Date());
                                const [hours, minutes] = slot.startTime.split(':');
                                newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
                                setAppointmentDate(newDate);
                              }}
                              color={
                                appointmentDate && 
                                appointmentDate.getHours() === parseInt(slot.startTime.split(':')[0], 10) && 
                                appointmentDate.getMinutes() === parseInt(slot.startTime.split(':')[1], 10)
                                  ? 'primary'
                                  : 'default'
                              }
                              variant={
                                appointmentDate && 
                                appointmentDate.getHours() === parseInt(slot.startTime.split(':')[0], 10) && 
                                appointmentDate.getMinutes() === parseInt(slot.startTime.split(':')[1], 10)
                                  ? 'filled'
                                  : 'outlined'
                              }
                              sx={{ 
                                animation: `fadeIn 0.5s ${index * 0.05}s both`,
                                '@keyframes fadeIn': {
                                  from: { opacity: 0, transform: 'translateY(5px)' },
                                  to: { opacity: 1, transform: 'translateY(0)' }
                                },
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  transform: 'translateY(-3px)',
                                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }
                              }}
                            />
                          </Tooltip>
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12} display="flex" justifyContent="space-between">
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => navigate('/dashboard/agenda')}
                    disabled={loading || success}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading || success || !selectedDoctor || !selectedPatient || !appointmentDate}
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
                      },
                      '&::after': loading ? {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        animation: 'shimmer 1.5s infinite',
                      } : {},
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} color="inherit" />
                        Salvando...
                      </Box>
                    ) : (
                      'Agendar Consulta'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </StyledPaper>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </Container>
    </LocalizationProvider>
  );
};

export default NewAppointment;
