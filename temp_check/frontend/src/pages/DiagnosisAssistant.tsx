import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Divider,
  Card, 
  CardContent,
  Grid,
  useTheme
} from '@mui/material';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';
import DiagnosisAssistantComponent from '../components/DiagnosisAssistant';
import { useAuth } from '../contexts/AuthContext';
import RecentDiagnoses from '../components/RecentDiagnoses';

const DiagnosisAssistant: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDiagnosisCreated = () => {
    // Trigger refresh of recent diagnoses
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Layout>
      <Helmet>
        <title>Assistente de Diagnóstico | MedicalSaaS</title>
      </Helmet>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Assistente de Diagnóstico
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Utilize nossa ferramenta de IA para obter sugestões de diagnóstico baseadas nos sintomas do paciente.
          </Typography>
          <Divider sx={{ my: 2 }} />
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                height: '100%'
              }}
            >
              <DiagnosisAssistantComponent onDiagnosisCreated={handleDiagnosisCreated} />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Diagnósticos Recentes
                </Typography>
                <RecentDiagnoses 
                  limit={5} 
                  doctorId={user?.role === 'doctor' ? user.uid : undefined}
                  refreshTrigger={refreshTrigger}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default DiagnosisAssistant;