import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Rating,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDoctorById, getDoctorAppointments } from '../services/doctorService';
import { Doctor, Appointment } from '../types/entities';
import { formatCurrency } from '../utils/formatters';

const DoctorProfile: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!doctorId) {
          setError('ID do médico não encontrado.');
          return;
        }

        const [doctorData, appointmentsData] = await Promise.all([
          getDoctorById(doctorId),
          getDoctorAppointments(doctorId),
        ]);

        setDoctor(doctorData);
        setAppointments(appointmentsData);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar informações do médico. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [doctorId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !doctor) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error || 'Médico não encontrado.'}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} display="flex" flexDirection="column" alignItems="center">
              <Avatar
                src={doctor.photoUrl}
                alt={doctor.name}
                sx={{ width: 200, height: 200, mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                Dr. {doctor.name}
              </Typography>
              <Rating value={doctor.rating || 0} readOnly precision={0.5} sx={{ mb: 1 }} />
              <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center" mb={2}>
                {doctor.specialties.map((specialty, index) => (
                  <Chip key={index} label={specialty} color="primary" />
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary" align="center">
                CRM: {doctor.crm}
              </Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Sobre o Médico
              </Typography>
              <Typography variant="body1" paragraph>
                {doctor.bio || 'Nenhuma biografia disponível.'}
              </Typography>

              <Typography variant="h6" gutterBottom>
                Informações de Contato
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Email" secondary={doctor.email} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Telefone" secondary={doctor.phone} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Endereço"
                    secondary={`${doctor.address.street}, ${doctor.address.number}${
                      doctor.address.complement ? ` - ${doctor.address.complement}` : ''
                    }, ${doctor.address.neighborhood}, ${doctor.address.city} - ${
                      doctor.address.state
                    }, ${doctor.address.zipCode}`}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Horários Disponíveis
                </Typography>
                <List dense>
                  {doctor.availability.map((slot, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={`${getDayOfWeek(slot.dayOfWeek)}`}
                          secondary={`${slot.startTime} - ${slot.endTime}`}
                        />
                        <Chip
                          label={slot.isAvailable ? 'Disponível' : 'Indisponível'}
                          color={slot.isAvailable ? 'success' : 'error'}
                          size="small"
                        />
                      </ListItem>
                      {index < doctor.availability.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Próximos Atendimentos
                </Typography>
                {appointments.length > 0 ? (
                  <List dense>
                    {appointments.slice(0, 5).map((appointment, index) => (
                      <React.Fragment key={appointment.id}>
                        <ListItem>
                          <ListItemText
                            primary={new Date(appointment.date).toLocaleDateString('pt-BR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            secondary={`Tipo: ${appointment.type}`}
                          />
                          <Chip
                            label={getAppointmentStatusLabel(appointment.status)}
                            color={getAppointmentStatusColor(appointment.status)}
                            size="small"
                          />
                        </ListItem>
                        {index < appointments.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Nenhum atendimento agendado.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

const getDayOfWeek = (day: number): string => {
  const days = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];
  return days[day];
};

const getAppointmentStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    scheduled: 'Agendado',
    confirmed: 'Confirmado',
    completed: 'Concluído',
    cancelled: 'Cancelado',
  };
  return labels[status] || status;
};

const getAppointmentStatusColor = (
  status: string
): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  const colors: Record<string, any> = {
    scheduled: 'info',
    confirmed: 'primary',
    completed: 'success',
    cancelled: 'error',
  };
  return colors[status] || 'default';
};

export default DoctorProfile;