import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download as DownloadIcon } from '@mui/icons-material';

const Reports = () => {
  const [timeRange, setTimeRange] = useState('month');

  // Dados mockados para exemplo
  const appointmentData = [
    { name: 'Jan', value: 120 },
    { name: 'Fev', value: 150 },
    { name: 'Mar', value: 180 },
    { name: 'Abr', value: 160 },
    { name: 'Mai', value: 200 },
    { name: 'Jun', value: 220 },
  ];

  const revenueData = [
    { name: 'Jan', value: 12000 },
    { name: 'Fev', value: 15000 },
    { name: 'Mar', value: 18000 },
    { name: 'Abr', value: 16000 },
    { name: 'Mai', value: 20000 },
    { name: 'Jun', value: 22000 },
  ];

  const specialtyData = [
    { name: 'Clínico Geral', value: 30 },
    { name: 'Cardiologista', value: 25 },
    { name: 'Ortopedista', value: 20 },
    { name: 'Pediatra', value: 15 },
    { name: 'Ginecologista', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const topDoctors = [
    {
      name: 'Dr. Carlos Silva',
      specialty: 'Clínico Geral',
      appointments: 150,
      revenue: 15000,
      rating: 4.8,
    },
    {
      name: 'Dra. Ana Oliveira',
      specialty: 'Cardiologista',
      appointments: 120,
      revenue: 18000,
      rating: 4.9,
    },
    {
      name: 'Dr. Pedro Santos',
      specialty: 'Ortopedista',
      appointments: 100,
      revenue: 16000,
      rating: 4.7,
    },
  ];

  const handleTimeRangeChange = (event: any) => {
    setTimeRange(event.target.value);
  };

  const handleDownloadReport = () => {
    // Aqui seria implementada a lógica para download do relatório
    console.log('Downloading report...');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          Relatórios e Análises
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Período</InputLabel>
            <Select
              value={timeRange}
              label="Período"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="week">Última Semana</MenuItem>
              <MenuItem value="month">Último Mês</MenuItem>
              <MenuItem value="quarter">Último Trimestre</MenuItem>
              <MenuItem value="year">Último Ano</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadReport}
          >
            Exportar Relatório
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Consultas por Mês
              </Typography>
              <BarChart
                width={500}
                height={300}
                data={appointmentData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Consultas" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Receita por Mês
              </Typography>
              <LineChart
                width={500}
                height={300}
                data={revenueData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#82ca9d"
                  name="Receita (R$)"
                />
              </LineChart>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribuição por Especialidade
              </Typography>
              <PieChart width={500} height={300}>
                <Pie
                  data={specialtyData}
                  cx={250}
                  cy={150}
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {specialtyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Médicos
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Médico</TableCell>
                      <TableCell>Especialidade</TableCell>
                      <TableCell align="right">Consultas</TableCell>
                      <TableCell align="right">Receita</TableCell>
                      <TableCell align="right">Avaliação</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topDoctors.map((doctor, index) => (
                      <TableRow key={index}>
                        <TableCell>{doctor.name}</TableCell>
                        <TableCell>{doctor.specialty}</TableCell>
                        <TableCell align="right">{doctor.appointments}</TableCell>
                        <TableCell align="right">
                          R$ {doctor.revenue.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={doctor.rating}
                            color="primary"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports; 