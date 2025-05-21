import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDiagnosisSuggestionById } from '../services/diagnosisService';
import { DiagnosisSuggestion } from '../types/entities';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  IconButton,
  Button,
  CircularProgress,
  Grid,
} from '@mui/material';
import { ArrowBack, Print } from '@mui/icons-material';
import moment from 'moment';

const DiagnosisDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState<DiagnosisSuggestion | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        const diagnosisData = await getDiagnosisSuggestionById(id);
        
        if (!diagnosisData) {
          setError('Diagnosis not found.');
          setLoading(false);
          return;
        }
        
        // Check if the user has access to this diagnosis
        if (diagnosisData.patientId && diagnosisData.doctorId && 
            diagnosisData.patientId !== (user.uid || user.id) && 
            diagnosisData.doctorId !== (user.uid || user.id)) {
          setError('You do not have permission to view this diagnosis.');
          setLoading(false);
          return;
        }
        
        setDiagnosis(diagnosisData);
      } catch (err) {
        console.error('Error fetching diagnosis:', err);
        setError('Failed to load diagnosis details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosis();
  }, [id, user]);

  const handlePrint = () => {
    window.print();
  };

  const getSeverityColor = (severity: string | undefined): "error" | "warning" | "success" | "info" => {
    if (!severity) return 'info';
    
    switch (severity.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'info';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBack />} 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  if (!diagnosis) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Alert severity="warning">Diagnosis not found.</Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBack />} 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }} className="diagnosis-detail-container">
      <Paper elevation={3} sx={{ p: 3, mb: 2 }} className="diagnosis-detail-paper">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => navigate(-1)} aria-label="back">
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1, ml: 2 }}>
            Diagnosis Report
          </Typography>
          <IconButton onClick={handlePrint} aria-label="print">
            <Print />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">Patient</Typography>
            <Typography variant="body1">{diagnosis.patientName}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">Doctor</Typography>
            <Typography variant="body1">{diagnosis.doctorName}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">Date</Typography>
            <Typography variant="body1">
              {diagnosis.createdAt && moment(
                'toDate' in diagnosis.createdAt 
                  ? diagnosis.createdAt.toDate() 
                  : diagnosis.createdAt
              ).format('MMMM D, YYYY [at] h:mm A')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">Case Severity</Typography>
            <Chip 
              label={(diagnosis.severity || 'medium').toUpperCase()} 
              color={getSeverityColor(diagnosis.severity)} 
              size="small" 
            />
          </Grid>
        </Grid>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Reported Symptoms</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {diagnosis.symptoms.map((symptom, index) => (
              <Chip key={index} label={symptom} color="primary" variant="outlined" />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Primary Diagnosis</Typography>
          <Paper elevation={1} sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <Typography variant="h5">
              {diagnosis.suggestedDiagnoses && diagnosis.suggestedDiagnoses.length > 0 
                ? diagnosis.suggestedDiagnoses[0].name 
                : 'No primary diagnosis available'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Confidence: {diagnosis.suggestedDiagnoses && diagnosis.suggestedDiagnoses.length > 0 
                ? Math.round(diagnosis.suggestedDiagnoses[0].confidence * 100) 
                : 0}%
            </Typography>
          </Paper>
        </Box>

        {diagnosis.alternativeDiagnoses && diagnosis.alternativeDiagnoses.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Alternative Diagnoses</Typography>
            <List>
              {diagnosis.alternativeDiagnoses?.map((alt, index: number) => (
                <ListItem 
                  key={index} 
                  divider={index < (diagnosis.alternativeDiagnoses?.length || 0) - 1}
                >
                  <ListItemText 
                    primary={alt.name} 
                    secondary={`Probability: ${Math.round((alt.probability || 0) * 100)}%`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {diagnosis.description && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Clinical Analysis</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {diagnosis.description}
            </Typography>
          </Box>
        )}

        {diagnosis.recommendedTests && diagnosis.recommendedTests.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Recommended Tests</Typography>
            <List>
              {diagnosis.recommendedTests?.map((test, index: number) => (
                <ListItem 
                  key={index} 
                  divider={index < (diagnosis.recommendedTests?.length || 0) - 1}
                >
                  <ListItemText primary={test} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {diagnosis.recommendedTreatments && diagnosis.recommendedTreatments.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Recommended Treatments</Typography>
            <List>
              {diagnosis.recommendedTreatments?.map((treatment, index: number) => (
                <ListItem 
                  key={index} 
                  divider={index < (diagnosis.recommendedTreatments?.length || 0) - 1}
                >
                  <ListItemText primary={treatment} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {diagnosis.severity === 'high' && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body1" fontWeight="bold">
              This case requires immediate medical attention.
            </Typography>
          </Alert>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />} 
            onClick={() => navigate(-1)}
          >
            Back to List
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Print />} 
            onClick={handlePrint}
          >
            Print Report
          </Button>
        </Box>
      </Paper>

      <Box sx={{ display: 'none' }} className="print-only">
        <style type="text/css" media="print">{`
          @media print {
            body * {
              visibility: hidden;
            }
            .diagnosis-detail-container, .diagnosis-detail-container * {
              visibility: visible;
            }
            .diagnosis-detail-paper {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              box-shadow: none !important;
            }
            button, .MuiIconButton-root {
              display: none !important;
            }
          }
        `}</style>
      </Box>
    </Container>
  );
};

export default DiagnosisDetail; 