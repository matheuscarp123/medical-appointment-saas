import React, { useEffect, useState } from 'react';
import { 
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Skeleton
} from '@mui/material';
import { getDiagnosisSuggestionsByPatient, getDiagnosisSuggestionsByDoctor } from '../services/diagnosisService';
import { DiagnosisSuggestion } from '../types/entities';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecentDiagnosesProps {
  limit?: number;
  patientId?: string;
  doctorId?: string;
  refreshTrigger?: number;
}

const RecentDiagnoses: React.FC<RecentDiagnosesProps> = ({ 
  limit = 5,
  patientId,
  doctorId, 
  refreshTrigger = 0
}) => {
  const [diagnoses, setDiagnoses] = useState<DiagnosisSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      setLoading(true);
      setError(null);
      try {
        let fetchedDiagnoses: DiagnosisSuggestion[] = [];
        
        if (patientId) {
          fetchedDiagnoses = await getDiagnosisSuggestionsByPatient(patientId);
        } else if (doctorId) {
          fetchedDiagnoses = await getDiagnosisSuggestionsByDoctor(doctorId);
        } else {
          // Get all diagnoses (for admin)
          // Not implemented yet - would need a new function
          setError('No patient or doctor ID provided');
          setLoading(false);
          return;
        }
        
        // Sort by creation date (newest first)
        fetchedDiagnoses.sort((a, b) => {
          const timeA = a.createdAt instanceof Date 
            ? a.createdAt.getTime() 
            : a.createdAt.toMillis ? a.createdAt.toMillis() : 0;
          
          const timeB = b.createdAt instanceof Date 
            ? b.createdAt.getTime() 
            : b.createdAt.toMillis ? b.createdAt.toMillis() : 0;
          
          return timeB - timeA;
        });
        
        // Limit the number of diagnoses
        if (limit > 0) {
          fetchedDiagnoses = fetchedDiagnoses.slice(0, limit);
        }
        
        setDiagnoses(fetchedDiagnoses);
      } catch (err) {
        console.error('Error fetching diagnoses', err);
        setError('Erro ao carregar diagnósticos recentes');
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, [patientId, doctorId, limit, refreshTrigger]);

  const getSeverityColor = (severity: string | undefined): 'error' | 'warning' | 'success' | 'default' => {
    if (!severity) return 'default';
    
    switch (severity.toLowerCase()) {
      case 'alta':
      case 'high':
        return 'error';
      case 'média':
      case 'medium':
        return 'warning';
      case 'baixa':
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box>
        {Array.from(new Array(3)).map((_, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="text" width="30%" height={20} />
            <Divider sx={{ my: 1 }} />
          </Box>
        ))}
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (diagnoses.length === 0) {
    return (
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Nenhum diagnóstico encontrado
        </Typography>
      </Box>
    );
  }

  return (
    <List disablePadding>
      {diagnoses.map((diagnosis, index) => (
        <React.Fragment key={diagnosis.id}>
          <ListItem 
            alignItems="flex-start" 
            disablePadding
            sx={{ py: 1.5 }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" component="span">
                    {diagnosis.patientName}
                  </Typography>
                  <Chip 
                    label={diagnosis.severity || 'medium'} 
                    size="small" 
                    color={getSeverityColor(diagnosis.severity) as any}
                    sx={{ fontSize: '0.7rem' }}
                  />
                </Box>
              }
              secondary={
                <>
                  <Typography variant="body2" component="span" color="text.primary">
                    {diagnosis.suggestedDiagnoses && diagnosis.suggestedDiagnoses.length > 0 
                      ? diagnosis.suggestedDiagnoses[0].name 
                      : 'No diagnosis available'}
                  </Typography>
                  <Typography variant="caption" component="div" color="text.secondary">
                    {diagnosis.createdAt && formatDistance(
                      'toDate' in diagnosis.createdAt 
                        ? diagnosis.createdAt.toDate() 
                        : diagnosis.createdAt,
                      new Date(),
                      { addSuffix: true, locale: ptBR }
                    )}
                  </Typography>
                </>
              }
            />
          </ListItem>
          {index < diagnoses.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button 
          component={Link} 
          to="/diagnoses" 
          size="small"
          sx={{ fontSize: '0.75rem' }}
        >
          Ver todos os diagnósticos
        </Button>
      </Box>
    </List>
  );
};

export default RecentDiagnoses; 