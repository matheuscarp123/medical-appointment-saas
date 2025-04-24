import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Chip,
  FormControl,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createDoctor } from '../services/doctorService';
import { formatCPF, formatPhoneNumber } from '../utils/formatters';
import { Specialty, Doctor } from '../types/entities';

const availableSpecialties: Specialty[] = [
  'cardiologist',
  'dermatologist',
  'endocrinologist',
  'gastroenterologist',
  'neurologist',
  'ophthalmologist',
  'orthopedist',
  'pediatrician',
  'psychiatrist',
  'urologist',
];

const daysOfWeek = [
  { id: 0, name: 'Domingo' },
  { id: 1, name: 'Segunda-feira' },
  { id: 2, name: 'Terça-feira' },
  { id: 3, name: 'Quarta-feira' },
  { id: 4, name: 'Quinta-feira' },
  { id: 5, name: 'Sexta-feira' },
  { id: 6, name: 'Sábado' },
];

interface DoctorFormData extends Omit<Doctor, 'id' | 'createdAt' | 'updatedAt' | 'userId'> {
  currentInsuranceProvider: string;
}

const NewDoctor: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<DoctorFormData>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    crm: '',
    specialties: [],
    bio: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
    availability: daysOfWeek.map(day => ({
      dayOfWeek: day.id,
      isAvailable: false,
      startTime: null,
      endTime: null,
      appointmentDuration: 30,
    })),
    consultationPrice: 0,
    acceptsInsurance: false,
    insuranceProviders: [],
    currentInsuranceProvider: '',
  });

  const handleChange = (field: keyof DoctorFormData | string, value: any) => {
    const fields = field.split('.');
    if (fields.length === 1) {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [fields[0]]: {
          ...(prev[fields[0] as keyof typeof prev] as Record<string, any>),
          [fields[1]]: value,
        },
      }));
    }
  };

  const handleAvailabilityChange = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAddInsuranceProvider = () => {
    if (
      formData.currentInsuranceProvider &&
      !formData.insuranceProviders.includes(formData.currentInsuranceProvider)
    ) {
      setFormData((prev) => ({
        ...prev,
        insuranceProviders: [...prev.insuranceProviders, prev.currentInsuranceProvider],
        currentInsuranceProvider: '',
      }));
    }
  };

  const handleRemoveInsuranceProvider = (provider: string) => {
    setFormData((prev) => ({
      ...prev,
      insuranceProviders: prev.insuranceProviders.filter((p) => p !== provider),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.name || !formData.email || !formData.crm || formData.specialties.length === 0) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setLoading(true);
      const { currentInsuranceProvider, ...doctorData } = formData;
      await createDoctor({
        ...doctorData,
        userId: user?.id || '',
        cpf: formData.cpf.replace(/\D/g, ''),
        phone: formData.phone.replace(/\D/g, ''),
        consultationPrice: parseFloat(formData.consultationPrice.toString()),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/doctors');
      }, 2000);
    } catch (err) {
      console.error('Erro ao criar médico:', err);
      setError('Erro ao criar médico. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Adicionar Médico
        </Typography>

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nome Completo"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Telefone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', formatPhoneNumber(e.target.value))}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="CPF"
                  value={formData.cpf}
                  onChange={(e) => handleChange('cpf', formatCPF(e.target.value))}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="CRM"
                  value={formData.crm}
                  onChange={(e) => handleChange('crm', e.target.value)}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  options={availableSpecialties}
                  value={formData.specialties}
                  onChange={(_, newValue) => handleChange('specialties', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Especialidades"
                      required
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Biografia"
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Endereço
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Rua"
                  value={formData.address.street}
                  onChange={(e) => handleChange('address.street', e.target.value)}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="Número"
                  value={formData.address.number}
                  onChange={(e) => handleChange('address.number', e.target.value)}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="Complemento"
                  value={formData.address.complement}
                  onChange={(e) => handleChange('address.complement', e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Bairro"
                  value={formData.address.neighborhood}
                  onChange={(e) => handleChange('address.neighborhood', e.target.value)}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Cidade"
                  value={formData.address.city}
                  onChange={(e) => handleChange('address.city', e.target.value)}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Estado"
                  value={formData.address.state}
                  onChange={(e) => handleChange('address.state', e.target.value)}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Disponibilidade
                </Typography>
              </Grid>

              {formData.availability.map((day, index) => (
                <Grid item xs={12} key={index} container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={day.isAvailable}
                          onChange={(e) =>
                            handleAvailabilityChange(index, 'isAvailable', e.target.checked)
                          }
                        />
                      }
                      label={daysOfWeek[index].name}
                    />
                  </Grid>

                  {day.isAvailable && (
                    <>
                      <Grid item xs={12} md={3}>
                        <TimePicker
                          label="Início"
                          value={day.startTime}
                          onChange={(newValue) =>
                            handleAvailabilityChange(index, 'startTime', newValue)
                          }
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              required: true,
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <TimePicker
                          label="Fim"
                          value={day.endTime}
                          onChange={(newValue) =>
                            handleAvailabilityChange(index, 'endTime', newValue)
                          }
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              required: true,
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <TextField
                          label="Duração (min)"
                          type="number"
                          value={day.appointmentDuration}
                          onChange={(e) =>
                            handleAvailabilityChange(
                              index,
                              'appointmentDuration',
                              parseInt(e.target.value)
                            )
                          }
                          required
                          fullWidth
                          InputProps={{ inputProps: { min: 15, max: 120, step: 5 } }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              ))}

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Valores e Convênios
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Valor da Consulta"
                  type="number"
                  value={formData.consultationPrice}
                  onChange={(e) => handleChange('consultationPrice', e.target.value)}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: <Typography>R$</Typography>,
                    inputProps: { min: 0, step: 0.01 },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.acceptsInsurance}
                      onChange={(e) => handleChange('acceptsInsurance', e.target.checked)}
                    />
                  }
                  label="Aceita Convênios"
                />
              </Grid>

              {formData.acceptsInsurance && (
                <>
                  <Grid item xs={12}>
                    <Box display="flex" gap={2} alignItems="flex-start">
                      <TextField
                        label="Adicionar Convênio"
                        value={formData.currentInsuranceProvider}
                        onChange={(e) =>
                          handleChange('currentInsuranceProvider', e.target.value)
                        }
                        fullWidth
                      />
                      <Button
                        onClick={handleAddInsuranceProvider}
                        variant="contained"
                        disabled={!formData.currentInsuranceProvider}
                      >
                        Adicionar
                      </Button>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {formData.insuranceProviders.map((provider, index) => (
                        <Chip
                          key={index}
                          label={provider}
                          onDelete={() => handleRemoveInsuranceProvider(provider)}
                        />
                      ))}
                    </Box>
                  </Grid>
                </>
              )}

              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}

              {success && (
                <Grid item xs={12}>
                  <Alert severity="success">
                    Médico cadastrado com sucesso! Redirecionando...
                  </Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <Box display="flex" gap={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      minWidth: 120,
                      fontWeight: 600,
                      borderRadius: '30px',
                      padding: '12px 32px',
                      background: 'linear-gradient(90deg, #1976d2, #64b5f6)',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.13)',
                      color: '#fff',
                      textTransform: 'none',
                      letterSpacing: '0.5px',
                      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #1565c0, #2196f3)',
                        boxShadow: '0 6px 18px rgba(25, 118, 210, 0.18)',
                        transform: 'translateY(-2px) scale(1.03)',
                      },
                      '&:active': {
                        background: 'linear-gradient(90deg, #1976d2, #64b5f6)',
                        boxShadow: '0 2px 6px rgba(25, 118, 210, 0.14)',
                      },
                      '&:focus': {
                        outline: 'none',
                        boxShadow: '0 0 0 2px #90caf9',
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Cadastrar'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default NewDoctor;
