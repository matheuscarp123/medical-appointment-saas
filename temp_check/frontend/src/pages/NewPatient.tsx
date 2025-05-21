import React, { useState } from 'react';
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
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createPatient } from '../services/patientService';
import { formatCPF, formatPhoneNumber } from '../utils/formatters';

const NewPatient: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: null as Date | null,
    gender: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    hasHealthInsurance: false,
    healthInsurance: {
      provider: '',
      planNumber: '',
      validUntil: null as Date | null,
    },
    allergies: '',
    chronicConditions: '',
    currentMedications: '',
  });

  const handleChange = (field: string, value: any) => {
    const fields = field.split('.');
    if (fields.length === 1) {
      setFormData((prev) => ({ ...prev, [field]: value }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [fields[0]]: {
          ...prev[fields[0] as keyof typeof prev],
          [fields[1]]: value,
        },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.name || !formData.email || !formData.cpf || !formData.birthDate) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setLoading(true);
      await createPatient({
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ''),
        phone: formData.phone.replace(/\D/g, ''),
        emergencyContact: {
          ...formData.emergencyContact,
          phone: formData.emergencyContact.phone.replace(/\D/g, ''),
        },
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/patients');
      }, 2000);
    } catch (err) {
      console.error('Erro ao criar paciente:', err);
      setError('Erro ao criar paciente. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Novo Paciente
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
                <DatePicker
                  label="Data de Nascimento"
                  value={formData.birthDate}
                  onChange={(newValue) => handleChange('birthDate', newValue)}
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Gênero</InputLabel>
                  <Select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    label="Gênero"
                  >
                    <MenuItem value="male">Masculino</MenuItem>
                    <MenuItem value="female">Feminino</MenuItem>
                    <MenuItem value="other">Outro</MenuItem>
                    <MenuItem value="notSpecified">Prefiro não informar</MenuItem>
                  </Select>
                </FormControl>
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
                  Contato de Emergência
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Nome"
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleChange('emergencyContact.name', e.target.value)}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Telefone"
                  value={formData.emergencyContact.phone}
                  onChange={(e) =>
                    handleChange(
                      'emergencyContact.phone',
                      formatPhoneNumber(e.target.value)
                    )
                  }
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Relação"
                  value={formData.emergencyContact.relationship}
                  onChange={(e) =>
                    handleChange('emergencyContact.relationship', e.target.value)
                  }
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Informações de Saúde
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.hasHealthInsurance}
                      onChange={(e) =>
                        handleChange('hasHealthInsurance', e.target.checked)
                      }
                    />
                  }
                  label="Possui Plano de Saúde"
                />
              </Grid>

              {formData.hasHealthInsurance && (
                <>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Convênio"
                      value={formData.healthInsurance.provider}
                      onChange={(e) =>
                        handleChange('healthInsurance.provider', e.target.value)
                      }
                      required
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Número da Carteirinha"
                      value={formData.healthInsurance.planNumber}
                      onChange={(e) =>
                        handleChange('healthInsurance.planNumber', e.target.value)
                      }
                      required
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Validade"
                      value={formData.healthInsurance.validUntil}
                      onChange={(newValue) =>
                        handleChange('healthInsurance.validUntil', newValue)
                      }
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                        },
                      }}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <TextField
                  label="Alergias"
                  value={formData.allergies}
                  onChange={(e) => handleChange('allergies', e.target.value)}
                  multiline
                  rows={2}
                  fullWidth
                  helperText="Liste todas as alergias conhecidas, separadas por vírgula"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Condições Crônicas"
                  value={formData.chronicConditions}
                  onChange={(e) => handleChange('chronicConditions', e.target.value)}
                  multiline
                  rows={2}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Medicamentos em Uso"
                  value={formData.currentMedications}
                  onChange={(e) => handleChange('currentMedications', e.target.value)}
                  multiline
                  rows={2}
                  fullWidth
                  helperText="Liste todos os medicamentos em uso atual, incluindo dosagem"
                />
              </Grid>

              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}

              {success && (
                <Grid item xs={12}>
                  <Alert severity="success">
                    Paciente cadastrado com sucesso! Redirecionando...
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

export default NewPatient;
