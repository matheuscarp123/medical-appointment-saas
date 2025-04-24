import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import RoleBasedRoute from './components/RoleBasedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Payment from './pages/Payment';
import PaymentFallback from './pages/PaymentFallback';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import NewAppointment from './pages/NewAppointment';
import Patients from './pages/Patients';
import PatientProfile from './pages/PatientProfile';
import Doctors from './pages/Doctors';
import DoctorProfile from './pages/DoctorProfile';
import Settings from './pages/Settings';
import DiagnosisAssistantPage from './pages/DiagnosisAssistantPage';
import Notifications from './pages/Notifications';
import Calendar from './pages/Calendar';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment/fallback" element={<PaymentFallback />} />
      
      {/* Dashboard - acessível para todos os usuários autenticados */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      
      {/* Agendamento - acessível para admin, médico e recepcionista */}
      <Route
        path="/dashboard/nova-consulta"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['admin', 'doctor', 'receptionist']}>
              <NewAppointment />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      
      {/* Agenda - acessível para todos os usuários autenticados */}
      <Route
        path="/dashboard/agenda"
        element={
          <PrivateRoute>
            <Calendar />
          </PrivateRoute>
        }
      />
      
      {/* Consultas - acessível para todos os usuários autenticados */}
      <Route
        path="/appointments"
        element={
          <PrivateRoute>
            <Appointments />
          </PrivateRoute>
        }
      />
      
      {/* Pacientes - acessível para admin, médico e recepcionista */}
      <Route
        path="/patients"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['admin', 'doctor', 'receptionist']}>
              <Patients />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      
      {/* Perfil de paciente - acessível para admin, médico, recepcionista e o próprio paciente */}
      <Route
        path="/patients/:id"
        element={
          <PrivateRoute>
            <PatientProfile />
          </PrivateRoute>
        }
      />
      
      {/* Médicos - acessível para admin */}
      <Route
        path="/doctors"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <Doctors />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      
      {/* Perfil de médico - acessível para admin e o próprio médico */}
      <Route
        path="/doctors/:id"
        element={
          <PrivateRoute>
            <DoctorProfile />
          </PrivateRoute>
        }
      />

      {/* Assistente de diagnóstico - acessível apenas para médicos */}
      <Route
        path="/ai-assistant"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['doctor', 'admin']}>
              <DiagnosisAssistantPage />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      {/* Notificações - acessível para todos os usuários autenticados */}
      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <Notifications />
          </PrivateRoute>
        }
      />
      
      {/* Configurações - acessível para todos os usuários autenticados */}
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
