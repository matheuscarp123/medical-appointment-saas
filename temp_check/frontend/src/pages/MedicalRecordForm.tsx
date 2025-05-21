import React, { useState, useCallback } from 'react';
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
  Divider,
  IconButton,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Upload as UploadIcon } from '@mui/icons-material';
import { MedicalRecord, Vitals, ConsultationNote, Diagnosis, Prescription, Exam } from '../types/medicalRecord';
import { createMedicalRecord, uploadAttachment, updateMedicalRecord } from '../services/medicalRecordService';

const initialVitals: Vitals = {
  temperature: 0,
  bloodPressure: {
    systolic: 0,
    diastolic: 0,
  },
  heartRate: 0,
  respiratoryRate: 0,
  oxygenSaturation: 0,
  weight: 0,
  height: 0,
};

const initialConsultationNote: ConsultationNote = {
  subjective: '',
  objective: '',
  assessment: '',
  plan: '',
};

const MedicalRecordForm: React.FC<{ patientId: string; appointmentId: string; doctorId: string }> = ({
  patientId,
  appointmentId,
  doctorId,
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [vitals, setVitals] = useState<Vitals>(initialVitals);
  const [consultationNote, setConsultationNote] = useState<ConsultationNote>(initialConsultationNote);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [type, setType] = useState<MedicalRecord['type']>('initial');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleVitalsChange = (field: keyof Vitals, value: string) => {
    if (field === 'bloodPressure') {
      const [systolic, diastolic] = value.split('/').map(Number);
      setVitals(prev => ({
        ...prev,
        bloodPressure: { systolic, diastolic },
      }));
    } else {
      setVitals(prev => ({
        ...prev,
        [field]: Number(value),
      }));
    }
  };

  const handleConsultationNoteChange = (field: keyof ConsultationNote, value: string) => {
    setConsultationNote(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddDiagnosis = () => {
    setDiagnoses(prev => [
      ...prev,
      {
        code: '',
        description: '',
        type: 'primary',
        date: new Date(),
        status: 'active',
        notes: '',
      },
    ]);
  };

  const handleDiagnosisChange = (index: number, field: keyof Diagnosis, value: string) => {
    setDiagnoses(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === 'date' ? new Date(value) : value,
      };
      return updated;
    });
  };

  const handleRemoveDiagnosis = (index: number) => {
    setDiagnoses(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddPrescription = () => {
    setPrescriptions(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        prescribedDate: new Date(),
      },
    ]);
  };

  const handlePrescriptionChange = (index: number, field: keyof Prescription, value: string) => {
    setPrescriptions(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field.includes('Date') ? new Date(value) : value,
      };
      return updated;
    });
  };

  const handleRemovePrescription = (index: number) => {
    setPrescriptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddExam = () => {
    setExams(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        type: '',
        requestDate: new Date(),
        status: 'requested',
      },
    ]);
  };

  const handleExamChange = (index: number, field: keyof Exam, value: string) => {
    setExams(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field.includes('Date') ? new Date(value) : value,
      };
      return updated;
    });
  };

  const handleRemoveExam = (index: number) => {
    setExams(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachments(prev => [...prev, ...Array.from(event.target.files!)]);
    }
  };

  const handleSubmit = async () => {
    try {
      setError(null);

      const record: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'> = {
        patientId,
        doctorId,
        appointmentId,
        date: new Date(),
        type,
        chiefComplaint,
        vitals,
        consultationNote,
        diagnoses,
        prescriptions,
        exams,
        attachments: [],
      };

      const recordId = await createMedicalRecord(record);

      // Upload attachments
      const uploadPromises = attachments.map(async file => {
        const url = await uploadAttachment(file, patientId, recordId);
        return {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          url,
          uploadDate: new Date(),
        };
      });

      const uploadedAttachments = await Promise.all(uploadPromises);
      
      // Update record with attachment URLs
      await updateMedicalRecord(recordId, { attachments: uploadedAttachments });

      navigate(`/medical-records/${recordId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create medical record');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          New Medical Record
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Record Type</InputLabel>
              <Select
                value={type}
                label="Record Type"
                onChange={(e) => setType(e.target.value as MedicalRecord['type'])}
              >
                <MenuItem value="initial">Initial Visit</MenuItem>
                <MenuItem value="follow-up">Follow-up</MenuItem>
                <MenuItem value="emergency">Emergency</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Chief Complaint"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Vital Signs
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Temperature (°C)"
                  type="number"
                  value={vitals.temperature}
                  onChange={(e) => handleVitalsChange('temperature', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Blood Pressure (sys/dia)"
                  value={`${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`}
                  onChange={(e) => handleVitalsChange('bloodPressure', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Heart Rate (bpm)"
                  type="number"
                  value={vitals.heartRate}
                  onChange={(e) => handleVitalsChange('heartRate', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Respiratory Rate"
                  type="number"
                  value={vitals.respiratoryRate}
                  onChange={(e) => handleVitalsChange('respiratoryRate', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Oxygen Saturation (%)"
                  type="number"
                  value={vitals.oxygenSaturation}
                  onChange={(e) => handleVitalsChange('oxygenSaturation', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  value={vitals.weight}
                  onChange={(e) => handleVitalsChange('weight', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  type="number"
                  value={vitals.height}
                  onChange={(e) => handleVitalsChange('height', e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Consultation Note
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Subjective"
                  value={consultationNote.subjective}
                  onChange={(e) => handleConsultationNoteChange('subjective', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Objective"
                  value={consultationNote.objective}
                  onChange={(e) => handleConsultationNoteChange('objective', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Assessment"
                  value={consultationNote.assessment}
                  onChange={(e) => handleConsultationNoteChange('assessment', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Plan"
                  value={consultationNote.plan}
                  onChange={(e) => handleConsultationNoteChange('plan', e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Diagnoses</Typography>
              <Button startIcon={<AddIcon />} onClick={handleAddDiagnosis}>
                Add Diagnosis
              </Button>
            </Box>
            {diagnoses.map((diagnosis, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Code"
                      value={diagnosis.code}
                      onChange={(e) => handleDiagnosisChange(index, 'code', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={diagnosis.description}
                      onChange={(e) => handleDiagnosisChange(index, 'description', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={diagnosis.type}
                        label="Type"
                        onChange={(e) => handleDiagnosisChange(index, 'type', e.target.value)}
                      >
                        <MenuItem value="primary">Primary</MenuItem>
                        <MenuItem value="secondary">Secondary</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={diagnosis.status}
                        label="Status"
                        onChange={(e) => handleDiagnosisChange(index, 'status', e.target.value)}
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="resolved">Resolved</MenuItem>
                        <MenuItem value="recurrent">Recurrent</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Notes"
                      value={diagnosis.notes}
                      onChange={(e) => handleDiagnosisChange(index, 'notes', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton color="error" onClick={() => handleRemoveDiagnosis(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Prescriptions</Typography>
              <Button startIcon={<AddIcon />} onClick={handleAddPrescription}>
                Add Prescription
              </Button>
            </Box>
            {prescriptions.map((prescription, index) => (
              <Box key={prescription.id} sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Medication"
                      value={prescription.medication}
                      onChange={(e) => handlePrescriptionChange(index, 'medication', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Dosage"
                      value={prescription.dosage}
                      onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Frequency"
                      value={prescription.frequency}
                      onChange={(e) => handlePrescriptionChange(index, 'frequency', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Duration"
                      value={prescription.duration}
                      onChange={(e) => handlePrescriptionChange(index, 'duration', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Instructions"
                      value={prescription.instructions}
                      onChange={(e) => handlePrescriptionChange(index, 'instructions', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton color="error" onClick={() => handleRemovePrescription(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Exams</Typography>
              <Button startIcon={<AddIcon />} onClick={handleAddExam}>
                Add Exam
              </Button>
            </Box>
            {exams.map((exam, index) => (
              <Box key={exam.id} sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Type"
                      value={exam.type}
                      onChange={(e) => handleExamChange(index, 'type', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={exam.status}
                        label="Status"
                        onChange={(e) => handleExamChange(index, 'status', e.target.value as Exam['status'])}
                      >
                        <MenuItem value="requested">Requested</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Notes"
                      value={exam.notes}
                      onChange={(e) => handleExamChange(index, 'notes', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton color="error" onClick={() => handleRemoveExam(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Attachments
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
              >
                Upload Files
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleFileChange}
                />
              </Button>
              <Typography variant="body2" color="textSecondary">
                {attachments.length} file(s) selected
              </Typography>
            </Box>
            {attachments.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {attachments.map((file, index) => (
                  <Typography key={index} variant="body2">
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </Typography>
                ))}
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                size="large"
              >
                Save Medical Record
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default MedicalRecordForm; 