import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Tabs,
  Tab,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Share as ShareIcon,
} from '@mui/icons-material';

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
      id={`medical-record-tabpanel-${index}`}
      aria-labelledby={`medical-record-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MedicalRecord = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (record?: any) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedRecord(null);
    setOpenDialog(false);
  };

  const handleSaveRecord = () => {
    // Implementar lógica de salvamento
    handleCloseDialog();
  };

  const handlePrintRecord = () => {
    window.print();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">
            Prontuário Eletrônico
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Novo Registro
          </Button>
        </Box>

        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Informações Gerais" />
          <Tab label="Histórico" />
          <Tab label="Exames" />
          <Tab label="Prescrições" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome do Paciente"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Data de Nascimento"
                type="date"
                variant="outlined"
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Alergias"
                variant="outlined"
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Histórico Familiar"
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                label="Observações"
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <List>
            {[1, 2, 3].map((item) => (
              <React.Fragment key={item}>
                <ListItem>
                  <ListItemText
                    primary={`Consulta ${item}`}
                    secondary={`Data: ${new Date().toLocaleDateString()}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleOpenDialog(item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={2}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1">Exame {item}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Data: {new Date().toLocaleDateString()}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button size="small" startIcon={<PrintIcon />}>
                      Imprimir
                    </Button>
                    <Button size="small" startIcon={<ShareIcon />}>
                      Compartilhar
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <List>
            {[1, 2, 3].map((item) => (
              <React.Fragment key={item}>
                <ListItem>
                  <ListItemText
                    primary={`Prescrição ${item}`}
                    secondary={`Data: ${new Date().toLocaleDateString()}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={handlePrintRecord}>
                      <PrintIcon />
                    </IconButton>
                    <IconButton edge="end">
                      <ShareIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </TabPanel>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRecord ? 'Editar Registro' : 'Novo Registro'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Data"
                type="date"
                variant="outlined"
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Prescrição"
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveRecord} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicalRecord; 