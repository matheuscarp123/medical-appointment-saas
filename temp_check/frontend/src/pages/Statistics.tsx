import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  LocalHospital as HospitalIcon,
  Event as EventIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  PieLabelRenderProps
} from 'recharts';

interface AppointmentData {
  name: string;
  value: number;
}

interface AppointmentType extends AppointmentData {
  name: string;
  value: number;
}

const Statistics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');

  // Dados mockados para exemplo
  const appointmentData: AppointmentData[] = [
    { name: 'Jan', value: 120 },
    { name: 'Fev', value: 150 },
    { name: 'Mar', value: 180 },
    { name: 'Abr', value: 140 },
    { name: 'Mai', value: 200 },
    { name: 'Jun', value: 220 }
  ];

  const revenueData: AppointmentData[] = [
    { name: 'Jan', value: 5000 },
    { name: 'Fev', value: 6000 },
    { name: 'Mar', value: 7500 },
    { name: 'Abr', value: 5500 },
    { name: 'Mai', value: 8000 },
    { name: 'Jun', value: 9000 }
  ];

  const appointmentTypes: AppointmentType[] = [
    { name: 'Consulta Regular', value: 60 },
    { name: 'Retorno', value: 25 },
    { name: 'Emergência', value: 10 },
    { name: 'Exame', value: 5 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const stats = [
    {
      title: 'Total de Consultas',
      value: '1.234',
      change: '+12%',
      trend: 'up',
      icon: <EventIcon />
    },
    {
      title: 'Pacientes Ativos',
      value: '856',
      change: '+8%',
      trend: 'up',
      icon: <PeopleIcon />
    },
    {
      title: 'Médicos Ativos',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: <HospitalIcon />
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 45.678',
      change: '+15%',
      trend: 'up',
      icon: <MoneyIcon />
    }
  ];

  const renderCustomizedLabel = ({ name, percent }: PieLabelRenderProps) => {
    return `${name} ${((percent || 0) * 100).toFixed(0)}%`;
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Estatísticas
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Período</InputLabel>
          <Select
            value={timeRange}
            label="Período"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="week">Última Semana</MenuItem>
            <MenuItem value="month">Último Mês</MenuItem>
            <MenuItem value="year">Último Ano</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      bgcolor: 'primary.main',
                      color: 'white'
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Chip
                    icon={stat.trend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                    label={stat.change}
                    color={stat.trend === 'up' ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Consultas por Mês
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Consultas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Tipos de Consulta
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={appointmentTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {appointmentTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Receita por Mês
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" name="Receita (R$)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Statistics; 