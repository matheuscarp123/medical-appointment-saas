import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
  Autocomplete,
  Divider,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WarningIcon from '@mui/icons-material/Warning';
import PreventionIcon from '@mui/icons-material/HealthAndSafety';
import { calculateDiagnosis, suggestSymptoms, symptomCategories } from '../data/medicalData';

interface DiagnosisAssistantProps {
  patientId?: string;
}

const DiagnosisAssistant: React.FC<DiagnosisAssistantProps> = ({ patientId }) => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [suggestedSymptoms, setSuggestedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<any[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleAddSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom('');
      setSuggestedSymptoms([]);
    }
  };

  const handleRemoveSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && suggestedSymptoms.length === 0) {
      event.preventDefault();
      handleAddSymptom();
    }
  };

  const handleSymptomInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCurrentSymptom(value);
    if (value.length >= 2) {
      const suggestions = suggestSymptoms(value);
      setSuggestedSymptoms(suggestions);
    } else {
      setSuggestedSymptoms([]);
    }
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentSymptom('');
    setSuggestedSymptoms(category ? symptomCategories[category] : []);
  };

  const handleGenerateDiagnosis = () => {
    if (symptoms.length === 0) {
      setError('Por favor, adicione pelo menos um sintoma.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const diagnosisResult = calculateDiagnosis(symptoms);
      setDiagnosis(diagnosisResult);
    } catch (err) {
      console.error('Erro ao gerar diagnóstico:', err);
      setError('Erro ao gerar diagnóstico. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSymptoms([]);
    setCurrentSymptom('');
    setDiagnosis(null);
    setError(null);
    setSelectedCategory(null);
    setSuggestedSymptoms([]);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'alta':
        return 'error';
      case 'média':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Assistente de Diagnóstico
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Categorias de Sintomas
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {Object.keys(symptomCategories).map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      onClick={() => handleCategorySelect(category)}
                      color={selectedCategory === category ? 'primary' : 'default'}
                      variant={selectedCategory === category ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Box>

              <FormControl fullWidth>
                <Autocomplete
                  freeSolo
                  options={suggestedSymptoms}
                  inputValue={currentSymptom}
                  onInputChange={(_, value) => setCurrentSymptom(value)}
                  onChange={(_, value) => {
                    if (value) {
                      setCurrentSymptom(value);
                      handleAddSymptom();
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Adicionar sintoma"
                      onChange={handleSymptomInputChange}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                    />
                  )}
                />
              </FormControl>

              {symptoms.length > 0 && (
                <List sx={{ mt: 2 }}>
                  {symptoms.map((symptom, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveSymptom(index)}
                          disabled={loading}
                        >
                          <RemoveIcon />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        <Chip label={index + 1} size="small" />
                      </ListItemIcon>
                      <ListItemText primary={symptom} />
                    </ListItem>
                  ))}
                </List>
              )}

              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleGenerateDiagnosis}
                  disabled={symptoms.length === 0 || loading}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                  ) : (
                    'Gerar Diagnóstico'
                  )}
                </Button>
                <Button variant="outlined" onClick={handleReset} disabled={loading}>
                  Limpar
                </Button>
              </Box>
            </Paper>
          </Grid>

          {diagnosis && diagnosis.length > 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Diagnóstico Sugerido
                </Typography>

                {diagnosis.map((diag, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 3,
                      p: 2,
                      border: '1px solid',
                      borderColor: (theme) => theme.palette[getSeverityColor(diag.severity)].main,
                      borderRadius: 1,
                      backgroundColor: (theme) => `${theme.palette[getSeverityColor(diag.severity)].light}`,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Typography variant="h6" color={getSeverityColor(diag.severity)}>
                        {diag.condition}
                      </Typography>
                      <Chip
                        label={`${Math.round(diag.probability * 100)}%`}
                        color={getSeverityColor(diag.severity)}
                        size="small"
                      />
                      {diag.icd10 && (
                        <Tooltip title="Código CID-10">
                          <Chip label={diag.icd10} variant="outlined" size="small" />
                        </Tooltip>
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      {diag.description}
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <LocalHospitalIcon color="primary" />
                            <Typography variant="subtitle2">Especialidades:</Typography>
                          </Box>
                          <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                            {diag.specialties.map((specialty: string, idx: number) => (
                              <Chip
                                key={idx}
                                label={specialty}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                            ))}
                          </Box>
                        </Box>

                        <Box mt={2}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <MedicalInformationIcon color="success" />
                            <Typography variant="subtitle2">Medicamentos Sugeridos:</Typography>
                          </Box>
                          <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                            {diag.medications.map((med: string, idx: number) => (
                              <Chip
                                key={idx}
                                label={med}
                                size="small"
                                variant="outlined"
                                color="success"
                              />
                            ))}
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <WarningIcon color="warning" />
                            <Typography variant="subtitle2">Fatores de Risco:</Typography>
                          </Box>
                          <List dense>
                            {diag.riskFactors?.map((risk: string, idx: number) => (
                              <ListItem key={idx}>
                                <ListItemText primary={risk} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>

                        {diag.preventiveMeasures && (
                          <Box mt={2}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <PreventionIcon color="info" />
                              <Typography variant="subtitle2">Medidas Preventivas:</Typography>
                            </Box>
                            <List dense>
                              {diag.preventiveMeasures.map((measure: string, idx: number) => (
                                <ListItem key={idx}>
                                  <ListItemText primary={measure} />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                ))}

                <Box mt={2} p={2} bgcolor="grey.100" borderRadius={1}>
                  <Typography variant="body2" color="text.secondary">
                    Nota: Este diagnóstico é apenas uma sugestão baseada nos sintomas informados.
                    Consulte sempre um profissional de saúde para uma avaliação adequada.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DiagnosisAssistant;