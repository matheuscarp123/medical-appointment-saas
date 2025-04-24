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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
} from '@mui/icons-material';

interface Consultation {
  id: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  prescriptions: string[];
  notes: string;
}

interface Patient {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  consultations: Consultation[];
}

const MedicalHistory = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [openPatientDialog, setOpenPatientDialog] = useState(false);
  const [openConsultationDialog, setOpenConsultationDialog] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  const handleOpenPatientDialog = (patient?: Patient) => {
    setSelectedPatient(patient || {
      id: Math.random().toString(),
      name: '',
      birthDate: '',
      gender: '',
      bloodType: '',
      allergies: [],
      chronicConditions: [],
      consultations: [],
    });
    setOpenPatientDialog(true);
  };

  const handleClosePatientDialog = () => {
    setSelectedPatient(null);
    setOpenPatientDialog(false);
  };

  const handleSavePatient = () => {
    if (selectedPatient) {
      const isNew = !patients.find(p => p.id === selectedPatient.id);
      if (isNew) {
        setPatients([...patients, selectedPatient]);
      } else {
        setPatients(patients.map(p => 
          p.id === selectedPatient.id ? selectedPatient : p
        ));
      }
    }
    handleClosePatientDialog();
  };

  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter(p => p.id !== id));
  };

  const handleOpenConsultationDialog = (patientId: string, consultation?: Consultation) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    setSelectedPatient(patient);
    setSelectedConsultation(consultation || {
      id: Math.random().toString(),
      date: new Date().toISOString().split('T')[0],
      symptoms: '',
      diagnosis: '',
      treatment: '',
      prescriptions: [],
      notes: '',
    });
    setOpenConsultationDialog(true);
  };

  const handleCloseConsultationDialog = () => {
    setSelectedConsultation(null);
    setOpenConsultationDialog(false);
  };

  const handleSaveConsultation = () => {
    if (selectedPatient && selectedConsultation) {
      const updatedPatient = {
        ...selectedPatient,
        consultations: selectedConsultation.id
          ? selectedPatient.consultations.map(c =>
              c.id === selectedConsultation.id ? selectedConsultation : c
            )
          : [...selectedPatient.consultations, selectedConsultation],
      };

      setPatients(patients.map(p =>
        p.id === selectedPatient.id ? updatedPatient : p
      ));
    }
    handleCloseConsultationDialog();
  };

  const handleDeleteConsultation = (patientId: string, consultationId: string) => {
    setPatients(patients.map(patient =>
      patient.id === patientId
        ? {
            ...patient,
            consultations: patient.consultations.filter(c => c.id !== consultationId),
          }
        : patient
    ));
  };

  const handlePrintConsultation = (consultation: Consultation) => {
    // Implement print functionality
    console.log('Printing consultation:', consultation);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">
            Histórico Médico
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenPatientDialog()}
          >
            Novo Paciente
          </Button>
        </Box>

        {patients.map(patient => (
          <Accordion key={patient.id} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Typography variant="h6">{patient.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {`Nascimento: ${new Date(patient.birthDate).toLocaleDateString()}`}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenPatientDialog(patient);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePatient(patient.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Informações Básicas</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography>Tipo Sanguíneo: {patient.bloodType}</Typography>
                    <Typography>Gênero: {patient.gender}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Condições</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2">Alergias:</Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {patient.allergies.map((allergy, index) => (
                          <Chip key={index} label={allergy} size="small" />
                        ))}
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="body2">Condições Crônicas:</Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {patient.chronicConditions.map((condition, index) => (
                          <Chip key={index} label={condition} size="small" />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">Consultas</Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenConsultationDialog(patient.id)}
                      size="small"
                    >
                      Nova Consulta
                    </Button>
                  </Box>
                  <List>
                    {patient.consultations.map(consultation => (
                      <ListItem
                        key={consultation.id}
                        sx={{
                          bgcolor: 'background.paper',
                          borderRadius: 1,
                          mb: 1,
                        }}
                      >
                        <ListItemText
                          primary={new Date(consultation.date).toLocaleDateString()}
                          secondary={
                            <>
                              <Typography variant="body2">
                                Diagnóstico: {consultation.diagnosis}
                              </Typography>
                              <Typography variant="body2">
                                Tratamento: {consultation.treatment}
                              </Typography>
                            </>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleOpenConsultationDialog(patient.id, consultation)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() => handlePrintConsultation(consultation)}
                            sx={{ mr: 1 }}
                          >
                            <PrintIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteConsultation(patient.id, consultation.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

      {/* Patient Dialog */}
      <Dialog open={openPatientDialog} onClose={handleClosePatientDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPatient?.id ? 'Editar Paciente' : 'Novo Paciente'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome do Paciente"
                value={selectedPatient?.name || ''}
                onChange={(e) => setSelectedPatient(prev => prev ? {
                  ...prev,
                  name: e.target.value,
                } : null)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data de Nascimento"
                type="date"
                value={selectedPatient?.birthDate || ''}
                onChange={(e) => setSelectedPatient(prev => prev ? {
                  ...prev,
                  birthDate: e.target.value,
                } : null)}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Gênero</InputLabel>
                <Select
                  value={selectedPatient?.gender || ''}
                  label="Gênero"
                  onChange={(e) => setSelectedPatient(prev => prev ? {
                    ...prev,
                    gender: e.target.value,
                  } : null)}
                >
                  <MenuItem value="male">Masculino</MenuItem>
                  <MenuItem value="female">Feminino</MenuItem>
                  <MenuItem value="other">Outro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Tipo Sanguíneo</InputLabel>
                <Select
                  value={selectedPatient?.bloodType || ''}
                  label="Tipo Sanguíneo"
                  onChange={(e) => setSelectedPatient(prev => prev ? {
                    ...prev,
                    bloodType: e.target.value,
                  } : null)}
                >
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Alergias"
                value={selectedPatient?.allergies.join(', ') || ''}
                onChange={(e) => setSelectedPatient(prev => prev ? {
                  ...prev,
                  allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                } : null)}
                margin="normal"
                helperText="Separe as alergias por vírgula"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Condições Crônicas"
                value={selectedPatient?.chronicConditions.join(', ') || ''}
                onChange={(e) => setSelectedPatient(prev => prev ? {
                  ...prev,
                  chronicConditions: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                } : null)}
                margin="normal"
                helperText="Separe as condições por vírgula"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePatientDialog}>Cancelar</Button>
          <Button onClick={handleSavePatient} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Consultation Dialog */}
      <Dialog open={openConsultationDialog} onClose={handleCloseConsultationDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedConsultation?.id ? 'Editar Consulta' : 'Nova Consulta'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Data da Consulta"
                type="date"
                value={selectedConsultation?.date || ''}
                onChange={(e) => setSelectedConsultation(prev => prev ? {
                  ...prev,
                  date: e.target.value,
                } : null)}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sintomas"
                multiline
                rows={2}
                value={selectedConsultation?.symptoms || ''}
                onChange={(e) => setSelectedConsultation(prev => prev ? {
                  ...prev,
                  symptoms: e.target.value,
                } : null)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Diagnóstico"
                multiline
                rows={2}
                value={selectedConsultation?.diagnosis || ''}
                onChange={(e) => setSelectedConsultation(prev => prev ? {
                  ...prev,
                  diagnosis: e.target.value,
                } : null)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tratamento"
                multiline
                rows={2}
                value={selectedConsultation?.treatment || ''}
                onChange={(e) => setSelectedConsultation(prev => prev ? {
                  ...prev,
                  treatment: e.target.value,
                } : null)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Prescrições"
                value={selectedConsultation?.prescriptions.join(', ') || ''}
                onChange={(e) => setSelectedConsultation(prev => prev ? {
                  ...prev,
                  prescriptions: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                } : null)}
                margin="normal"
                helperText="Separe as prescrições por vírgula"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                multiline
                rows={3}
                value={selectedConsultation?.notes || ''}
                onChange={(e) => setSelectedConsultation(prev => prev ? {
                  ...prev,
                  notes: e.target.value,
                } : null)}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConsultationDialog}>Cancelar</Button>
          <Button onClick={handleSaveConsultation} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicalHistory; 