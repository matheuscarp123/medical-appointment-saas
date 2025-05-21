import React, { useState, ReactNode } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Container,
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Event as EventIcon,
  LocalHospital as HospitalIcon,
  Assignment as AssignmentIcon,
  HealthAndSafety as HealthAndSafetyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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
      id={`patient-tabpanel-${index}`}
      aria-labelledby={`patient-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `patient-tab-${index}`,
    'aria-controls': `patient-tabpanel-${index}`,
  };
}

interface Patient {
  id?: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  bloodType: string;
  allergies: string;
  emergencyContact: string;
}

interface MedicalRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  doctor: string;
  attachments: string[];
}

const PatientProfile = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [patient, setPatient] = useState<Patient>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    bloodType: '',
    allergies: '',
    emergencyContact: ''
  });
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality with Firebase
    console.log('Saving patient data:', patient);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleOpenRecordDialog = (record?: MedicalRecord) => {
    setSelectedRecord(record || {
      id: Math.random().toString(),
      date: '',
      type: '',
      description: '',
      doctor: '',
      attachments: [],
    });
    setOpenDialog(true);
  };

  const handleCloseRecordDialog = () => {
    setSelectedRecord(null);
    setOpenDialog(false);
  };

  const handleSaveRecord = () => {
    if (selectedRecord) {
      const isNew = !medicalRecords.find(r => r.id === selectedRecord.id);
      if (isNew) {
        setMedicalRecords([...medicalRecords, selectedRecord]);
      } else {
        setMedicalRecords(medicalRecords.map(r =>
          r.id === selectedRecord.id ? selectedRecord : r
        ));
      }
    }
    handleCloseRecordDialog();
  };

  const handleDeleteRecord = (id: string) => {
    setMedicalRecords(medicalRecords.filter(r => r.id !== id));
  };

  const handleDiagnosisClick = () => {
    navigate(`/patients/${patient.id}/diagnosis`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HealthAndSafetyIcon />}
            onClick={handleDiagnosisClick}
          >
            Assistente de Diagnóstico
          </Button>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            aria-label="patient profile tabs"
          >
            <Tab label="Personal Information" {...a11yProps(0)} />
            <Tab label="Medical History" {...a11yProps(1)} />
            <Tab label="Medications" {...a11yProps(2)} />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                value={patient.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={patient.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone"
                name="phone"
                value={patient.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Birth Date"
                name="birthDate"
                type="date"
                value={patient.birthDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={patient.address}
                onChange={handleInputChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Blood Type"
                name="bloodType"
                value={patient.bloodType}
                onChange={handleInputChange}
                select
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact"
                name="emergencyContact"
                value={patient.emergencyContact}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  startIcon={<SaveIcon />}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Medical History
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenRecordDialog()}
            >
              Novo Registro
            </Button>
          </Box>
          <Grid container spacing={3}>
            {medicalRecords.map((record, index) => (
              <Grid item xs={12} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Record {index + 1}</Typography>
                    <Typography>Date: {record.date}</Typography>
                    <Typography>Diagnosis: {record.description}</Typography>
                    <Typography>Treatment: {record.doctor}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Medications
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Alergias
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {patient.allergies.split(',').map((allergy, index) => (
                  <Chip
                    key={index}
                    label={allergy}
                    onDelete={isEditing ? () => {
                      const newAllergies = patient.allergies.split(',').filter((a) => a !== allergy);
                      setPatient({ ...patient, allergies: newAllergies.join(',') });
                    } : undefined}
                  />
                ))}
                {isEditing && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      const newAllergy = prompt('Nova alergia:');
                      if (newAllergy) {
                        setPatient({
                          ...patient,
                          allergies: [...patient.allergies.split(','), newAllergy].join(','),
                        });
                      }
                    }}
                  >
                    Adicionar
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseRecordDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRecord?.id ? 'Editar Registro' : 'Novo Registro'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data"
                type="date"
                value={selectedRecord?.date || ''}
                onChange={(e) => setSelectedRecord(prev => prev ? {
                  ...prev,
                  date: e.target.value,
                } : null)}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={selectedRecord?.type || ''}
                  label="Tipo"
                  onChange={(e) => setSelectedRecord(prev => prev ? {
                    ...prev,
                    type: e.target.value,
                  } : null)}
                >
                  <MenuItem value="consultation">Consulta</MenuItem>
                  <MenuItem value="exam">Exame</MenuItem>
                  <MenuItem value="procedure">Procedimento</MenuItem>
                  <MenuItem value="surgery">Cirurgia</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                multiline
                rows={4}
                value={selectedRecord?.description || ''}
                onChange={(e) => setSelectedRecord(prev => prev ? {
                  ...prev,
                  description: e.target.value,
                } : null)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Médico Responsável"
                value={selectedRecord?.doctor || ''}
                onChange={(e) => setSelectedRecord(prev => prev ? {
                  ...prev,
                  doctor: e.target.value,
                } : null)}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRecordDialog}>Cancelar</Button>
          <Button onClick={handleSaveRecord} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientProfile; 