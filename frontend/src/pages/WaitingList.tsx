import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

interface Patient {
  id: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  status: 'waiting' | 'in-service' | 'completed';
  arrivalTime: string;
  notes: string;
}

const WaitingList = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleOpenDialog = (patient?: Patient) => {
    setSelectedPatient(patient || {
      id: Math.random().toString(),
      name: '',
      priority: 'medium',
      estimatedTime: '',
      status: 'waiting',
      arrivalTime: new Date().toISOString(),
      notes: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedPatient(null);
    setOpenDialog(false);
  };

  const handleSavePatient = () => {
    if (selectedPatient) {
      const isNew = !patients.find(p => p.id === selectedPatient.id);
      if (isNew) {
        setPatients([...patients, selectedPatient]);
      } else {
        setPatients(patients.map(p => 
          p.id === selectedPatient.id ? selectedPatient : p
        ));
      }
    }
    handleCloseDialog();
  };

  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter(p => p.id !== id));
  };

  const handleMovePatient = (id: string, direction: 'up' | 'down') => {
    const index = patients.findIndex(p => p.id === id);
    if (index === -1) return;

    const newPatients = [...patients];
    const patient = newPatients[index];
    
    if (direction === 'up' && index > 0) {
      newPatients[index] = newPatients[index - 1];
      newPatients[index - 1] = patient;
    } else if (direction === 'down' && index < newPatients.length - 1) {
      newPatients[index] = newPatients[index + 1];
      newPatients[index + 1] = patient;
    }

    setPatients(newPatients);
  };

  const handleUpdateStatus = (id: string, status: Patient['status']) => {
    setPatients(patients.map(p => 
      p.id === id ? { ...p, status } : p
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'warning';
      case 'in-service':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">
            Lista de Espera
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Adicionar Paciente
          </Button>
        </Box>

        <List>
          {patients.map((patient, index) => (
            <ListItem
              key={patient.id}
              sx={{
                bgcolor: patient.status === 'in-service' ? 'action.hover' : 'inherit',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {patient.name}
                    <Chip
                      size="small"
                      label={patient.priority}
                      color={getPriorityColor(patient.priority)}
                    />
                    <Chip
                      size="small"
                      label={patient.status}
                      color={getStatusColor(patient.status)}
                    />
                  </Box>
                }
                secondary={`Chegada: ${new Date(patient.arrivalTime).toLocaleTimeString()} - Tempo estimado: ${patient.estimatedTime}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleMovePatient(patient.id, 'up')}
                  disabled={index === 0}
                  sx={{ mr: 1 }}
                >
                  <ArrowUpwardIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleMovePatient(patient.id, 'down')}
                  disabled={index === patients.length - 1}
                  sx={{ mr: 1 }}
                >
                  <ArrowDownwardIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleUpdateStatus(patient.id, 'in-service')}
                  disabled={patient.status !== 'waiting'}
                  sx={{ mr: 1 }}
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDeletePatient(patient.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedPatient?.id ? 'Editar Paciente' : 'Novo Paciente'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome do Paciente"
                value={selectedPatient?.name || ''}
                onChange={(e) => setSelectedPatient(prev => prev ? {
                  ...prev,
                  name: e.target.value,
                } : null)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Prioridade</InputLabel>
                <Select
                  value={selectedPatient?.priority || ''}
                  label="Prioridade"
                  onChange={(e) => setSelectedPatient(prev => prev ? {
                    ...prev,
                    priority: e.target.value as Patient['priority'],
                  } : null)}
                >
                  <MenuItem value="high">Alta</MenuItem>
                  <MenuItem value="medium">Média</MenuItem>
                  <MenuItem value="low">Baixa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tempo Estimado"
                value={selectedPatient?.estimatedTime || ''}
                onChange={(e) => setSelectedPatient(prev => prev ? {
                  ...prev,
                  estimatedTime: e.target.value,
                } : null)}
                margin="normal"
                placeholder="Ex: 30 minutos"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                multiline
                rows={4}
                value={selectedPatient?.notes || ''}
                onChange={(e) => setSelectedPatient(prev => prev ? {
                  ...prev,
                  notes: e.target.value,
                } : null)}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSavePatient} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WaitingList; 