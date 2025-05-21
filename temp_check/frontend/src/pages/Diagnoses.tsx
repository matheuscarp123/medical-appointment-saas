import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  TableSortLabel,
  Container,
  TablePagination,
  Alert,
  Skeleton
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterListIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  AccessTime as AccessTimeIcon,
  MedicalServices as MedicalServicesIcon,
  PrintOutlined as PrintIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  LocalHospital as LocalHospitalIcon,
  PriorityHigh as PriorityHighIcon,
  ContentPasteSearch as ContentPasteSearchIcon,
  Visibility as VisibilityIcon,
  ErrorOutline as ErrorIcon,
  WarningAmberOutlined as WarningIcon,
  CheckCircleOutline as CheckIcon
} from '@mui/icons-material';
import { format, formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getDiagnosisSuggestionsByPatient, getDiagnosisSuggestionsByDoctor } from '../services/diagnosisService';
import { useAuth } from '../contexts/AuthContext';
import { getAllPatients } from '../services/patientService';
import { useNavigate, Link } from 'react-router-dom';
import { DiagnosisSuggestion } from '../types/entities';

interface DiagnosisTableProps {
  diagnoses: any[];
  loading: boolean;
  openDetail: (diagnosis: any) => void;
  onSort: (property: string) => void;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

const DiagnosisTable: React.FC<DiagnosisTableProps> = ({ 
  diagnoses, 
  loading, 
  openDetail, 
  onSort,
  sortBy,
  sortDirection
}) => {
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'primary';
    }
  };
  
  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return 'Não definida';
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (diagnoses.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <MedicalServicesIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Nenhum diagnóstico encontrado
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tente modificar os filtros ou realize um novo diagnóstico
        </Typography>
      </Box>
    );
  }
  
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'createdAt'}
                direction={sortBy === 'createdAt' ? sortDirection : 'asc'}
                onClick={() => onSort('createdAt')}
              >
                Data
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'patientName'}
                direction={sortBy === 'patientName' ? sortDirection : 'asc'}
                onClick={() => onSort('patientName')}
              >
                Paciente
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'doctorName'}
                direction={sortBy === 'doctorName' ? sortDirection : 'asc'}
                onClick={() => onSort('doctorName')}
              >
                Médico
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'suggestedDiagnosis.name'}
                direction={sortBy === 'suggestedDiagnosis.name' ? sortDirection : 'asc'}
                onClick={() => onSort('suggestedDiagnosis.name')}
              >
                Diagnóstico Principal
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'confidence'}
                direction={sortBy === 'confidence' ? sortDirection : 'asc'}
                onClick={() => onSort('confidence')}
              >
                Confiança
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'severity'}
                direction={sortBy === 'severity' ? sortDirection : 'asc'}
                onClick={() => onSort('severity')}
              >
                Severidade
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {diagnoses.map((diagnosis) => (
            <TableRow 
              key={diagnosis.id} 
              hover 
              onClick={() => openDetail(diagnosis)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  {diagnosis.createdAt && format(diagnosis.createdAt.toDate(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </Box>
              </TableCell>
              <TableCell>{diagnosis.patientName}</TableCell>
              <TableCell>{diagnosis.doctorName}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalHospitalIcon sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                  {diagnosis.suggestedDiagnosis?.name}
                </Box>
              </TableCell>
              <TableCell>
                <Chip 
                  label={`${Math.round(diagnosis.confidence * 100)}%`}
                  size="small"
                  color={diagnosis.confidence > 0.7 ? 'success' : diagnosis.confidence > 0.4 ? 'primary' : 'warning'}
                />
              </TableCell>
              <TableCell>
                <Chip 
                  icon={diagnosis.severity === 'high' ? <PriorityHighIcon /> : <CheckCircleIcon />}
                  label={getSeverityLabel(diagnosis.severity)}
                  size="small"
                  color={getSeverityColor(diagnosis.severity) as any}
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Ver detalhes">
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); openDetail(diagnosis); }}>
                    <ExpandMoreIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

interface DiagnosisDetailProps {
  diagnosis: any;
  open: boolean;
  onClose: () => void;
}

const DiagnosisDetail: React.FC<DiagnosisDetailProps> = ({ diagnosis, open, onClose }) => {
  
  if (!diagnosis) return null;
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'error.main';
      case 'medium':
        return 'warning.main';
      case 'low':
        return 'success.main';
      default:
        return 'primary.main';
    }
  };
  
  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return 'Não definida';
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6">Detalhes do Diagnóstico</Typography>
        <IconButton edge="end" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Data do Diagnóstico
                    </Typography>
                    <Typography variant="body1">
                      {diagnosis.createdAt && format(diagnosis.createdAt.toDate(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                    </Typography>
                  </Box>
                  
                  <Chip 
                    label={`Severidade: ${getSeverityLabel(diagnosis.severity)}`}
                    color={getSeverityColor(diagnosis.severity) as any}
                    icon={diagnosis.severity === 'high' ? <PriorityHighIcon /> : undefined}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Paciente
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {diagnosis.patientName}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Médico Responsável
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {diagnosis.doctorName}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Diagnóstico Principal
            </Typography>
            <Card 
              variant="outlined" 
              sx={{ 
                bgcolor: 'primary.light', 
                color: 'primary.contrastText',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  bgcolor: 'primary.dark',
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {diagnosis.suggestedDiagnosis?.name}
                  </Typography>
                  <Chip 
                    label={`Confiança: ${Math.round(diagnosis.confidence * 100)}%`}
                    size="small"
                    sx={{ bgcolor: 'white' }}
                  />
                </Box>
                
                <Divider sx={{ my: 1, borderColor: 'primary.main' }} />
                
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {diagnosis.description}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Tratamentos Recomendados:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {diagnosis.recommendedTreatments?.map((treatment: string, index: number) => (
                      <Chip 
                        key={index} 
                        label={treatment} 
                        size="small" 
                        sx={{ bgcolor: 'white', color: 'primary.main' }} 
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Sintomas Relatados
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {diagnosis.symptoms?.map((symptom: string, index: number) => (
                <Chip key={index} label={symptom} color="default" />
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Diagnósticos Alternativos
            </Typography>
            <Grid container spacing={2}>
              {diagnosis.alternativeDiagnoses?.map((alternative: any, index: number) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {alternative.name}
                        </Typography>
                        <Chip 
                          label={`${Math.round(alternative.probability * 100)}%`}
                          size="small"
                          color={alternative.probability > 0.7 ? 'success' : alternative.probability > 0.4 ? 'primary' : 'warning'}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Possível diagnóstico alternativo baseado nos sintomas.
                      </Typography>
                      
                      <Typography variant="subtitle2">Tratamentos:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {alternative.treatments?.map((treatment: string, idx: number) => (
                          <Chip key={idx} label={treatment} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Exames Recomendados
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {diagnosis.recommendedTests?.map((test: string, index: number) => (
                <Chip 
                  key={index} 
                  label={test} 
                  color="info" 
                  variant="outlined" 
                  icon={<MedicalServicesIcon />} 
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button startIcon={<PrintIcon />}>
          Imprimir
        </Button>
        <Button startIcon={<ShareIcon />}>
          Compartilhar
        </Button>
        <Button variant="contained" onClick={onClose}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface FiltersDialogProps {
  open: boolean;
  onClose: () => void;
  filters: any;
  setFilters: (filters: any) => void;
  applyFilters: () => void;
  patients: any[];
}

const FiltersDialog: React.FC<FiltersDialogProps> = ({ 
  open, 
  onClose, 
  filters, 
  setFilters, 
  applyFilters,
  patients
}) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name as string]: value
    });
  };
  
  const resetFilters = () => {
    setFilters({
      patientId: '',
      dateFrom: null,
      dateTo: null,
      severity: '',
      confidence: ''
    });
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterListIcon sx={{ mr: 1 }} />
          Filtrar Diagnósticos
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel id="patient-select-label">Paciente</InputLabel>
              <Select
                labelId="patient-select-label"
                id="patient-select"
                name="patientId"
                value={filters.patientId}
                onChange={handleChange}
                label="Paciente"
              >
                <MenuItem value="">Todos os pacientes</MenuItem>
                {patients.map((patient) => (
                  <MenuItem key={patient.id} value={patient.id}>
                    {patient.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Data inicial"
              type="date"
              name="dateFrom"
              fullWidth
              size="small"
              value={filters.dateFrom || ''}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Data final"
              type="date"
              name="dateTo"
              fullWidth
              size="small"
              value={filters.dateTo || ''}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel id="severity-select-label">Severidade</InputLabel>
              <Select
                labelId="severity-select-label"
                id="severity-select"
                name="severity"
                value={filters.severity}
                onChange={handleChange}
                label="Severidade"
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="high">Alta</MenuItem>
                <MenuItem value="medium">Média</MenuItem>
                <MenuItem value="low">Baixa</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel id="confidence-select-label">Confiança</InputLabel>
              <Select
                labelId="confidence-select-label"
                id="confidence-select"
                name="confidence"
                value={filters.confidence}
                onChange={handleChange}
                label="Confiança"
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="high">Alta (>70%)</MenuItem>
                <MenuItem value="medium">Média (40-70%)</MenuItem>
                <MenuItem value="low">Baixa (<40%)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={resetFilters}>Limpar</Button>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          variant="contained" 
          onClick={() => {
            applyFilters();
            onClose();
          }}
        >
          Aplicar Filtros
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Diagnoses: React.FC = () => {
  const { user } = useAuth();
  const [diagnoses, setDiagnoses] = useState<DiagnosisSuggestion[]>([]);
  const [filteredDiagnoses, setFilteredDiagnoses] = useState<DiagnosisSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        setLoading(true);
        let diagnosisList: DiagnosisSuggestion[] = [];
        
        if (user) {
          if (user.role === 'doctor') {
            diagnosisList = await getDiagnosisSuggestionsByDoctor(user.uid);
          } else {
            diagnosisList = await getDiagnosisSuggestionsByPatient(user.uid);
          }
        }
        
        // Sort by creation date (newest first)
        diagnosisList.sort((a, b) => {
          const dateA = a.createdAt?.toDate() || new Date();
          const dateB = b.createdAt?.toDate() || new Date();
          return dateB.getTime() - dateA.getTime();
        });
        
        setDiagnoses(diagnosisList);
        setFilteredDiagnoses(diagnosisList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching diagnoses:', err);
        setError('Failed to load diagnoses. Please try again later.');
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDiagnoses(diagnoses);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = diagnoses.filter(
        diagnosis => 
          diagnosis.patientName?.toLowerCase().includes(lowercasedSearch) ||
          diagnosis.suggestedDiagnosis?.name.toLowerCase().includes(lowercasedSearch) ||
          diagnosis.symptoms.some(s => s.toLowerCase().includes(lowercasedSearch))
      );
      setFilteredDiagnoses(filtered);
    }
  }, [searchTerm, diagnoses]);

  const getSeverityChip = (severity: string | undefined) => {
    switch (severity) {
      case 'high':
        return <Chip 
          icon={<ErrorIcon />} 
          label="Alta" 
          color="error" 
          size="small" 
        />;
      case 'medium':
        return <Chip 
          icon={<WarningIcon />} 
          label="Média" 
          color="warning" 
          size="small" 
        />;
      case 'low':
        return <Chip 
          icon={<CheckIcon />} 
          label="Baixa" 
          color="success" 
          size="small" 
        />;
      default:
        return <Chip label="Não definida" size="small" />;
    }
  };

  const renderLoadingSkeletons = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton variant="text" width="60%" />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="40%" />
          </TableCell>
          <TableCell>
            <Skeleton variant="rectangular" width={80} height={24} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" />
          </TableCell>
          <TableCell>
            <Skeleton variant="rectangular" width={80} height={36} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Diagnósticos
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {user?.role === 'doctor' 
            ? 'Lista de diagnósticos gerados para seus pacientes.' 
            : 'Seus diagnósticos médicos recentes.'}
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          placeholder="Buscar diagnósticos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ width: { xs: '100%', sm: '50%', md: '40%' } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        
        <Button 
          variant="contained" 
          color="primary"
          component={Link}
          to="/diagnosis-assistant"
        >
          Nova Análise
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {filteredDiagnoses.length === 0 && !loading && !error && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Nenhum diagnóstico encontrado.
        </Alert>
      )}

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Paciente</strong></TableCell>
              <TableCell><strong>Diagnóstico</strong></TableCell>
              <TableCell><strong>Sintomas</strong></TableCell>
              <TableCell><strong>Severidade</strong></TableCell>
              <TableCell><strong>Data</strong></TableCell>
              <TableCell><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              renderLoadingSkeletons()
            ) : (
              filteredDiagnoses.map((diagnosis) => (
                <TableRow key={diagnosis.id} hover>
                  <TableCell>{diagnosis.patientName}</TableCell>
                  <TableCell>{diagnosis.suggestedDiagnosis?.name}</TableCell>
                  <TableCell>
                    {diagnosis.symptoms.slice(0, 3).join(', ')}
                    {diagnosis.symptoms.length > 3 && '...'}
                  </TableCell>
                  <TableCell>
                    {getSeverityChip(diagnosis.severity)}
                  </TableCell>
                  <TableCell>
                    {diagnosis.createdAt ? format(diagnosis.createdAt.toDate(), 'dd/MM/yyyy HH:mm') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button 
                      component={Link} 
                      to={`/diagnoses/${diagnosis.id}`}
                      variant="outlined" 
                      size="small"
                    >
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Diagnoses; 