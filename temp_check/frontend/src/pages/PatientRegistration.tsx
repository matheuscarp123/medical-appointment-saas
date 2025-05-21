import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { PatientFormData } from '../types/patient';
import { createPatient } from '../services/patientService';

const steps = [
  'Personal Information',
  'Contact Details',
  'Emergency Contact',
  'Medical History',
];

const initialFormData: PatientFormData = {
  name: '',
  cpf: '',
  rg: '',
  dateOfBirth: '',
  gender: 'other',
  maritalStatus: 'single',
  phone: '',
  email: '',
  occupation: '',
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
    relationship: '',
    phone: '',
  },
  insurance: {
    provider: '',
    planNumber: '',
    validUntil: '',
  },
  medicalHistory: {
    allergies: [],
    chronicConditions: [],
    medications: [],
    surgeries: [],
    familyHistory: [],
  },
};

const PatientRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<PatientFormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newSurgery, setNewSurgery] = useState('');
  const [newFamilyHistory, setNewFamilyHistory] = useState('');

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }));
  };

  const handleInsuranceChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      insurance: {
        ...prev.insurance,
        [field]: value,
      },
    }));
  };

  const handleArrayAdd = (field: keyof typeof formData.medicalHistory, value: string) => {
    if (!value.trim()) return;
    
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [field]: [...prev.medicalHistory[field], value.trim()],
      },
    }));
  };

  const handleArrayRemove = (field: keyof typeof formData.medicalHistory, index: number) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [field]: prev.medicalHistory[field].filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      const patientId = await createPatient(formData);
      navigate(`/patients/${patientId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create patient');
    }
  };

  const renderPersonalInfo = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Full Name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="CPF"
          value={formData.cpf}
          onChange={(e) => handleInputChange('cpf', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="RG"
          value={formData.rg}
          onChange={(e) => handleInputChange('rg', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          type="date"
          label="Date of Birth"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth required>
          <InputLabel>Gender</InputLabel>
          <Select
            value={formData.gender}
            label="Gender"
            onChange={(e) => handleInputChange('gender', e.target.value)}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth required>
          <InputLabel>Marital Status</InputLabel>
          <Select
            value={formData.maritalStatus}
            label="Marital Status"
            onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
          >
            <MenuItem value="single">Single</MenuItem>
            <MenuItem value="married">Married</MenuItem>
            <MenuItem value="divorced">Divorced</MenuItem>
            <MenuItem value="widowed">Widowed</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  const renderContactDetails = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Phone"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          type="email"
          label="Email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Occupation"
          value={formData.occupation}
          onChange={(e) => handleInputChange('occupation', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Address
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Street"
          value={formData.address.street}
          onChange={(e) => handleAddressChange('street', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Number"
          value={formData.address.number}
          onChange={(e) => handleAddressChange('number', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Complement"
          value={formData.address.complement}
          onChange={(e) => handleAddressChange('complement', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Neighborhood"
          value={formData.address.neighborhood}
          onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="City"
          value={formData.address.city}
          onChange={(e) => handleAddressChange('city', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="State"
          value={formData.address.state}
          onChange={(e) => handleAddressChange('state', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="ZIP Code"
          value={formData.address.zipCode}
          onChange={(e) => handleAddressChange('zipCode', e.target.value)}
        />
      </Grid>
    </Grid>
  );

  const renderEmergencyContact = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Emergency Contact
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Name"
          value={formData.emergencyContact.name}
          onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Relationship"
          value={formData.emergencyContact.relationship}
          onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Phone"
          value={formData.emergencyContact.phone}
          onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Insurance Information
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Insurance Provider"
          value={formData.insurance?.provider}
          onChange={(e) => handleInsuranceChange('provider', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Plan Number"
          value={formData.insurance?.planNumber}
          onChange={(e) => handleInsuranceChange('planNumber', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          type="date"
          label="Valid Until"
          value={formData.insurance?.validUntil}
          onChange={(e) => handleInsuranceChange('validUntil', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
    </Grid>
  );

  const renderMedicalHistory = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Allergies
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            fullWidth
            label="Add Allergy"
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => {
              handleArrayAdd('allergies', newAllergy);
              setNewAllergy('');
            }}
          >
            <AddIcon />
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {formData.medicalHistory.allergies.map((allergy, index) => (
            <Chip
              key={index}
              label={allergy}
              onDelete={() => handleArrayRemove('allergies', index)}
            />
          ))}
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Chronic Conditions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            fullWidth
            label="Add Condition"
            value={newCondition}
            onChange={(e) => setNewCondition(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => {
              handleArrayAdd('chronicConditions', newCondition);
              setNewCondition('');
            }}
          >
            <AddIcon />
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {formData.medicalHistory.chronicConditions.map((condition, index) => (
            <Chip
              key={index}
              label={condition}
              onDelete={() => handleArrayRemove('chronicConditions', index)}
            />
          ))}
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Current Medications
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            fullWidth
            label="Add Medication"
            value={newMedication}
            onChange={(e) => setNewMedication(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => {
              handleArrayAdd('medications', newMedication);
              setNewMedication('');
            }}
          >
            <AddIcon />
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {formData.medicalHistory.medications.map((medication, index) => (
            <Chip
              key={index}
              label={medication}
              onDelete={() => handleArrayRemove('medications', index)}
            />
          ))}
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Previous Surgeries
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            fullWidth
            label="Add Surgery"
            value={newSurgery}
            onChange={(e) => setNewSurgery(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => {
              handleArrayAdd('surgeries', newSurgery);
              setNewSurgery('');
            }}
          >
            <AddIcon />
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {formData.medicalHistory.surgeries.map((surgery, index) => (
            <Chip
              key={index}
              label={surgery}
              onDelete={() => handleArrayRemove('surgeries', index)}
            />
          ))}
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Family History
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            fullWidth
            label="Add Family History"
            value={newFamilyHistory}
            onChange={(e) => setNewFamilyHistory(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => {
              handleArrayAdd('familyHistory', newFamilyHistory);
              setNewFamilyHistory('');
            }}
          >
            <AddIcon />
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {formData.medicalHistory.familyHistory.map((history, index) => (
            <Chip
              key={index}
              label={history}
              onDelete={() => handleArrayRemove('familyHistory', index)}
            />
          ))}
        </Box>
      </Grid>
    </Grid>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderContactDetails();
      case 2:
        return renderEmergencyContact();
      case 3:
        return renderMedicalHistory();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Patient Registration
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
          >
            {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PatientRegistration; 