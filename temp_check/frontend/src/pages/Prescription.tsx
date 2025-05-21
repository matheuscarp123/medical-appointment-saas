import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Print as PrintIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
} from '@mui/icons-material';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
}

interface Prescription {
  id: string;
  patientName: string;
  date: string;
  medicines: Medicine[];
  instructions: string;
}

const Prescription = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [newMedicine, setNewMedicine] = useState<Medicine | null>(null);

  // Exemplo de medicamentos (em um sistema real, viria de uma API)
  const medicineOptions = [
    { id: '1', name: 'Dipirona', dosage: '500mg' },
    { id: '2', name: 'Paracetamol', dosage: '750mg' },
    { id: '3', name: 'Ibuprofeno', dosage: '600mg' },
  ];

  const handleOpenDialog = (prescription?: Prescription) => {
    setSelectedPrescription(prescription || {
      id: Math.random().toString(),
      patientName: '',
      date: new Date().toISOString().split('T')[0],
      medicines: [],
      instructions: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedPrescription(null);
    setOpenDialog(false);
  };

  const handleSavePrescription = () => {
    if (selectedPrescription) {
      const isNew = !prescriptions.find(p => p.id === selectedPrescription.id);
      if (isNew) {
        setPrescriptions([...prescriptions, selectedPrescription]);
      } else {
        setPrescriptions(prescriptions.map(p => 
          p.id === selectedPrescription.id ? selectedPrescription : p
        ));
      }
    }
    handleCloseDialog();
  };

  const handleDeletePrescription = (id: string) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  const handlePrintPrescription = (prescription: Prescription) => {
    // Implementar lógica de impressão
    console.log('Imprimindo prescrição:', prescription);
  };

  const handleAddMedicine = () => {
    if (newMedicine && selectedPrescription) {
      setSelectedPrescription({
        ...selectedPrescription,
        medicines: [...selectedPrescription.medicines, newMedicine],
      });
      setNewMedicine(null);
    }
  };

  const handleRemoveMedicine = (medicineId: string) => {
    if (selectedPrescription) {
      setSelectedPrescription({
        ...selectedPrescription,
        medicines: selectedPrescription.medicines.filter(m => m.id !== medicineId),
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">
            Prescrição Eletrônica
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nova Prescrição
          </Button>
        </Box>

        <List>
          {prescriptions.map((prescription) => (
            <ListItem key={prescription.id}>
              <ListItemText
                primary={prescription.patientName}
                secondary={`Data: ${new Date(prescription.date).toLocaleDateString()}`}
              />
              <ListItemSecondaryAction>
                <IconButton 
                  edge="end" 
                  onClick={() => handlePrintPrescription(prescription)}
                  sx={{ mr: 1 }}
                >
                  <PrintIcon />
                </IconButton>
                <IconButton 
                  edge="end"
                  onClick={() => handleDeletePrescription(prescription.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPrescription?.id ? 'Editar Prescrição' : 'Nova Prescrição'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome do Paciente"
                value={selectedPrescription?.patientName || ''}
                onChange={(e) => setSelectedPrescription(prev => prev ? {
                  ...prev,
                  patientName: e.target.value,
                } : null)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data"
                type="date"
                value={selectedPrescription?.date || ''}
                onChange={(e) => setSelectedPrescription(prev => prev ? {
                  ...prev,
                  date: e.target.value,
                } : null)}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Autocomplete
                  fullWidth
                  options={medicineOptions}
                  getOptionLabel={(option) => `${option.name} - ${option.dosage}`}
                  value={newMedicine}
                  onChange={(event, newValue) => setNewMedicine(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Adicionar Medicamento" />
                  )}
                />
                <Button
                  variant="contained"
                  onClick={handleAddMedicine}
                  disabled={!newMedicine}
                >
                  Adicionar
                </Button>
              </Box>

              <List>
                {selectedPrescription?.medicines.map((medicine) => (
                  <ListItem key={medicine.id}>
                    <ListItemText
                      primary={medicine.name}
                      secondary={medicine.dosage}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveMedicine(medicine.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Instruções"
                multiline
                rows={4}
                value={selectedPrescription?.instructions || ''}
                onChange={(e) => setSelectedPrescription(prev => prev ? {
                  ...prev,
                  instructions: e.target.value,
                } : null)}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSavePrescription} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Prescription; 