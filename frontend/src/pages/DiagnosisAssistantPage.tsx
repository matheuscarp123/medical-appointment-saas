import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Container,
  Grid,
  Chip,
  Autocomplete,
  Card,
  CardContent,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { DiagnosisSuggestion } from '../types/entities';
import { searchDiagnosisByKeyword } from '../services/diagnosisService';
import WarningIcon from '@mui/icons-material/Warning';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import ScienceIcon from '@mui/icons-material/Science';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

// Lista de sintomas comuns para sugestões
const commonSymptoms = [
  'Febre', 'Dor de cabeça', 'Tosse', 'Dor de garganta', 'Coriza', 'Falta de ar',
  'Cansaço', 'Náusea', 'Vômito', 'Diarreia', 'Dores musculares', 'Dor abdominal',
  'Tontura', 'Confusão mental', 'Dor no peito', 'Palpitações', 'Sudorese',
  'Coceira', 'Erupção cutânea', 'Visão turva', 'Insônia', 'Ansiedade', 'Depressão'
];

// Categorias de sintomas para organização
const symptomCategories: Record<string, string[]> = {
  'Respiratórios': ['Tosse', 'Falta de ar', 'Coriza', 'Dor de garganta', 'Congestão nasal'],
  'Digestivos': ['Náusea', 'Vômito', 'Diarreia', 'Dor abdominal', 'Azia', 'Constipação'],
  'Cardiovasculares': ['Dor no peito', 'Palpitações', 'Pressão alta', 'Inchaço nas pernas'],
  'Neurológicos': ['Dor de cabeça', 'Tontura', 'Formigamento', 'Convulsão', 'Confusão mental'],
  'Psicológicos': ['Ansiedade', 'Depressão', 'Insônia', 'Irritabilidade', 'Alterações de humor'],
  'Gerais': ['Febre', 'Fadiga', 'Dor no corpo', 'Mal estar', 'Fraqueza']
};

const DiagnosisAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [suggestedSymptoms, setSuggestedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<DiagnosisSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Efeito para atualizar sugestões baseadas na categoria ou entrada do usuário
  useEffect(() => {
    if (selectedCategory) {
      setSuggestedSymptoms(symptomCategories[selectedCategory] || []);
    } else if (currentSymptom.length > 1) {
      // Filtrar sintomas comuns que correspondam à entrada do usuário
      const filtered = commonSymptoms.filter(
        symptom => symptom.toLowerCase().includes(currentSymptom.toLowerCase())
      );
      setSuggestedSymptoms(filtered);
    } else {
      setSuggestedSymptoms([]);
    }
  }, [currentSymptom, selectedCategory]);

  const handleAddSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom('');
      setSuggestedSymptoms([]);
    }
  };

  const handleRemoveSymptom = (symptomToRemove: string) => {
    setSymptoms(symptoms.filter(symptom => symptom !== symptomToRemove));
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    // Se mudar de categoria, limpar o input atual
    setCurrentSymptom('');
  };

  const handleGetDiagnosis = async () => {
    if (symptoms.length === 0) {
      setError('Por favor, adicione pelo menos um sintoma.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Usar o serviço de diagnóstico com todos os parâmetros necessários
      const patientId = user?.id || 'guest';
      const patientName = user?.name || 'Paciente';
      const doctorId = user?.id || 'system';
      const doctorName = user?.name || 'Sistema';
      
      const diagnosisSuggestion = await searchDiagnosisByKeyword(
        patientId,
        patientName,
        doctorId,
        doctorName,
        symptoms
      );
      setSuggestions(diagnosisSuggestion);
    } catch (err) {
      console.error('Erro ao processar o diagnóstico:', err);
      setError('Erro ao processar o diagnóstico. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Renderizar o cartão de diagnóstico com visual melhorado
  const renderDiagnosisCard = (diagnosis: any, index: number) => {
    // Determinar cor baseada na confiança
    const getConfidenceColor = (confidence: number) => {
      if (confidence >= 0.7) return 'error';
      if (confidence >= 0.4) return 'warning';
      return 'info';
    };

    const confidenceColor = getConfidenceColor(diagnosis.confidence);
    
    return (
      <Card 
        key={diagnosis.id || index} 
        sx={{ 
          mb: 2, 
          border: `1px solid`,
          borderColor: theme => theme.palette[confidenceColor].main,
          backgroundColor: theme => `${theme.palette[confidenceColor].light}20`
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            {confidenceColor === 'error' && <WarningIcon color="error" />}
            {confidenceColor === 'warning' && <WarningIcon color="warning" />}
            {confidenceColor === 'info' && <InfoIcon color="info" />}
            
            <Typography variant="h6" color={confidenceColor}>
              {diagnosis.name}
            </Typography>
            
            <Chip 
              label={`${Math.round(diagnosis.confidence * 100)}%`}
              color={confidenceColor}
              size="small"
            />
          </Box>
          
          <Typography variant="body2" paragraph>
            {diagnosis.description}
          </Typography>
          
          <Divider sx={{ my: 1 }} />
          
          <Box>
            <Typography variant="subtitle2" gutterBottom display="flex" alignItems="center" gap={1}>
              <ScienceIcon fontSize="small" /> Sintomas Correspondentes:
            </Typography>
            <Box display="flex" gap={0.5} flexWrap="wrap" mb={2}>
              {diagnosis.matchingSymptoms?.map((symptom: string, i: number) => (
                <Chip key={i} label={symptom} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>
          
          {diagnosis.recommendedTests && diagnosis.recommendedTests.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom display="flex" alignItems="center" gap={1}>
                <LocalHospitalIcon fontSize="small" /> Exames Recomendados:
              </Typography>
              <Box display="flex" gap={0.5} flexWrap="wrap" mb={2}>
                {diagnosis.recommendedTests.map((test: string, i: number) => (
                  <Chip key={i} label={test} size="small" variant="outlined" color="primary" />
                ))}
              </Box>
            </Box>
          )}
          
          {diagnosis.recommendedTreatments && diagnosis.recommendedTreatments.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom display="flex" alignItems="center" gap={1}>
                <HealthAndSafetyIcon fontSize="small" /> Tratamentos Sugeridos:
              </Typography>
              <Box display="flex" gap={0.5} flexWrap="wrap">
                {diagnosis.recommendedTreatments.map((treatment: string, i: number) => (
                  <Chip key={i} label={treatment} size="small" variant="outlined" color="success" />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  // Renderizar o resultado do diagnóstico
  const renderDiagnosisResult = () => {
    if (!suggestions) return null;

    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ScienceIcon />
          Análise de Diagnóstico
        </Typography>

        {/* Alerta de gravidade */}
        {suggestions.severity && (
          <Alert 
            severity={
              suggestions.severity === 'high' ? 'error' : 
              suggestions.severity === 'medium' ? 'warning' : 'info'
            }
            sx={{ mb: 2 }}
          >
            {suggestions.severity === 'high' && 'Este caso pode ser grave. Recomendamos atendimento médico imediato.'}
            {suggestions.severity === 'medium' && 'Este caso apresenta gravidade moderada. Recomendamos consulta médica nas próximas 24 horas.'}
            {suggestions.severity === 'low' && 'Este caso parece de baixa gravidade. Monitore os sintomas.'}
          </Alert>
        )}

        {/* Descrição geral */}
        {suggestions.description && (
          <Paper sx={{ p: 2, mb: 3, backgroundColor: 'background.paper' }}>
            <Typography variant="body1">{suggestions.description}</Typography>
          </Paper>
        )}

        {/* Lista de diagnósticos sugeridos */}
        <Typography variant="h6" gutterBottom>Diagnósticos Sugeridos</Typography>
        {suggestions.suggestedDiagnoses?.length > 0 ? (
          suggestions.suggestedDiagnoses.map((diagnosis, index) => 
            renderDiagnosisCard(diagnosis, index)
          )
        ) : (
          <Alert severity="info">
            Não foi possível determinar um diagnóstico preciso com os sintomas fornecidos.
          </Alert>
        )}

        {/* Exames recomendados */}
        {suggestions.recommendedTests && suggestions.recommendedTests.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              <ScienceIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Exames Recomendados
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Exame</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {suggestions.recommendedTests.map((test, index) => (
                    <TableRow key={index}>
                      <TableCell>{test}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Tratamentos recomendados */}
        {suggestions.recommendedTreatments && suggestions.recommendedTreatments.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              <LocalHospitalIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Tratamentos Recomendados
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tratamento</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {suggestions.recommendedTreatments.map((treatment, index) => (
                    <TableRow key={index}>
                      <TableCell>{treatment}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Disclaimer */}
        {suggestions.disclaimer && (
          <Alert severity="info" sx={{ mt: 3 }}>
            {suggestions.disclaimer}
          </Alert>
        )}
      </Box>
    );
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HealthAndSafetyIcon fontSize="large" color="primary" />
          Assistente de Diagnóstico
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                Sintomas
                <Tooltip title="Adicione um ou mais sintomas para receber sugestões de diagnóstico. Quanto mais específico, melhor será o resultado.">
                  <IconButton size="small">
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              
              {/* Categorias de sintomas */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Categorias:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Object.keys(symptomCategories).map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      onClick={() => handleCategorySelect(selectedCategory === category ? null : category)}
                      color={selectedCategory === category ? 'primary' : 'default'}
                      variant={selectedCategory === category ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Box>
              
              {/* Input com autosugestão */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Autocomplete
                  freeSolo
                  fullWidth
                  options={suggestedSymptoms}
                  inputValue={currentSymptom}
                  onInputChange={(_, value) => {
                    setCurrentSymptom(value);
                  }}
                  onChange={(_, value) => {
                    if (value) {
                      setCurrentSymptom(value);
                      if (value.trim() && !symptoms.includes(value.trim())) {
                        setSymptoms([...symptoms, value.trim()]);
                        setCurrentSymptom('');
                      }
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Digite um sintoma"
                      variant="outlined"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSymptom()}
                    />
                  )}
                />
                <Button
                  variant="contained"
                  onClick={handleAddSymptom}
                  disabled={!currentSymptom.trim()}
                >
                  Adicionar
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {symptoms.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Nenhum sintoma adicionado ainda. Adicione pelo menos um sintoma para gerar um diagnóstico.
                  </Typography>
                ) : (
                  symptoms.map((symptom) => (
                    <Chip
                      key={symptom}
                      label={symptom}
                      onDelete={() => handleRemoveSymptom(symptom)}
                      color="primary"
                    />
                  ))
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleGetDiagnosis}
                disabled={symptoms.length === 0 || loading}
                startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <HealthAndSafetyIcon />}
                sx={{ py: 1.5 }}
              >
                {loading ? 'Processando...' : 'Obter Diagnóstico'}
              </Button>
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              </Grid>
            )}
          </Grid>
        </Paper>

        {renderDiagnosisResult()}
      </Box>
    </Container>
  );
};

export default DiagnosisAssistantPage;