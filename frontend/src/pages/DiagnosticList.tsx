import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDiagnosisSuggestionsByPatient, getDiagnosisSuggestionsByDoctor } from '../services/diagnosisService';
import { DiagnosisSuggestion } from '../types/entities';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  Tabs,
  Tab,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import moment from 'moment';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const DiagnosticList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [diagnoses, setDiagnoses] = useState<DiagnosisSuggestion[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchDiagnoses = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        let diagnosisData: DiagnosisSuggestion[] = [];
        
        // Fetch based on current tab
        if (tabValue === 0) {
          // My Diagnoses (as a patient)
          diagnosisData = await getDiagnosisSuggestionsByPatient(user.uid || user.id);
        } else {
          // Created Diagnoses (as a doctor)
          diagnosisData = await getDiagnosisSuggestionsByDoctor(user.uid || user.id);
        }
        
        // Sort by creation date (newest first)
        diagnosisData.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : a.createdAt.toDate().getTime();
          const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : b.createdAt.toDate().getTime();
          return dateB - dateA;
        });
        
        setDiagnoses(diagnosisData);
      } catch (err) {
        console.error('Error fetching diagnoses:', err);
        setError('Failed to load diagnoses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, [user, tabValue]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewDiagnosis = (id: string) => {
    navigate(`/diagnosis/${id}`);
  };

  const handleCreateNew = () => {
    navigate('/diagnosis-assistant');
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

  const filteredDiagnoses = diagnoses.filter(diagnosis => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (diagnosis.suggestedDiagnoses && diagnosis.suggestedDiagnoses[0]?.name?.toLowerCase().includes(searchLower)) ||
      (diagnosis.patientName && diagnosis.patientName.toLowerCase().includes(searchLower)) ||
      (diagnosis.doctorName && diagnosis.doctorName.toLowerCase().includes(searchLower)) ||
      (diagnosis.symptoms && diagnosis.symptoms.some(symptom => symptom.toLowerCase().includes(searchLower)))
    );
  });

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Diagnosis History
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
        >
          New Diagnosis
        </Button>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="My Diagnoses" />
          <Tab label="Created Diagnoses" />
        </Tabs>

        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search diagnoses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{ mb: 2 }}
          />
        </Box>

        <TabPanel value={tabValue} index={0}>
          {renderDiagnosesList(
            filteredDiagnoses, 
            loading, 
            error, 
            'No diagnoses found for you as a patient.', 
            handleViewDiagnosis,
            getSeverityColor
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {renderDiagnosesList(
            filteredDiagnoses, 
            loading, 
            error, 
            'No diagnoses created by you as a doctor.', 
            handleViewDiagnosis,
            getSeverityColor
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
};

const renderDiagnosesList = (
  diagnoses: DiagnosisSuggestion[],
  loading: boolean,
  error: string | null,
  emptyMessage: string,
  onView: (id: string) => void,
  getSeverityColor: (severity: string | undefined) => "error" | "warning" | "success" | "info"
) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
  }

  if (diagnoses.length === 0) {
    return <Alert severity="info" sx={{ m: 2 }}>{emptyMessage}</Alert>;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Patient</TableCell>
            <TableCell>Doctor</TableCell>
            <TableCell>Diagnosis</TableCell>
            <TableCell>Confidence</TableCell>
            <TableCell>Severity</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {diagnoses.map((diagnosis) => (
            <TableRow key={diagnosis.id} hover>
              <TableCell>
                {moment(diagnosis.createdAt instanceof Date 
                  ? diagnosis.createdAt 
                  : diagnosis.createdAt.toDate()).format('MM/DD/YYYY')}
              </TableCell>
              <TableCell>{diagnosis.patientName || 'N/A'}</TableCell>
              <TableCell>{diagnosis.doctorName || 'N/A'}</TableCell>
              <TableCell>{diagnosis.suggestedDiagnoses && diagnosis.suggestedDiagnoses[0]?.name}</TableCell>
              <TableCell>{diagnosis.suggestedDiagnoses && diagnosis.suggestedDiagnoses[0]?.confidence ? 
                Math.round(diagnosis.suggestedDiagnoses[0].confidence * 100) : '-'}%</TableCell>
              <TableCell>
                <Chip 
                  label={(diagnosis.severity || 'low').toUpperCase()} 
                  color={getSeverityColor(diagnosis.severity)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <IconButton 
                  color="primary" 
                  onClick={() => onView(diagnosis.id)}
                  size="small"
                  title="View Details"
                >
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DiagnosticList; 