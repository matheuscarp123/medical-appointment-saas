import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Page components
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import PatientList from '../pages/PatientList';
import PatientDetail from '../pages/PatientDetail';
import DoctorList from '../pages/DoctorList';
import DoctorDetail from '../pages/DoctorDetail';
import AppointmentList from '../pages/AppointmentList';
import AppointmentDetail from '../pages/AppointmentDetail';
import NewAppointment from '../pages/NewAppointment';
import MedicalRecordList from '../pages/MedicalRecordList';
import DiagnosisAssistant from '../pages/DiagnosisAssistant';
import Diagnoses from '../pages/Diagnoses';
import DiagnosisDetail from '../pages/DiagnosisDetail';
import NotFound from '../pages/NotFound';

// Layout
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';

// Routes configuration
const Routes: React.FC = () => {
  const { user, loading } = useAuth();

  // If auth is loading, show nothing
  if (loading) {
    return null;
  }

  // Define routes based on authentication status
  const routes = useRoutes([
    {
      path: '/',
      element: user ? <AppLayout /> : <Navigate to="/login" />,
      children: [
        { path: '/', element: <Dashboard /> },
        { path: '/patients', element: <PatientList /> },
        { path: '/patients/:id', element: <PatientDetail /> },
        { path: '/doctors', element: <DoctorList /> },
        { path: '/doctors/:id', element: <DoctorDetail /> },
        { path: '/appointments', element: <AppointmentList /> },
        { path: '/appointments/:id', element: <AppointmentDetail /> },
        { path: '/appointments/new', element: <NewAppointment /> },
        { path: '/medicalrecords', element: <MedicalRecordList /> },
        { path: '/diagnosis-assistant', element: <DiagnosisAssistant /> },
        { path: '/diagnoses', element: <Diagnoses /> },
        { path: '/diagnoses/:id', element: <DiagnosisDetail /> },
        { path: '*', element: <NotFound /> }
      ]
    },
    {
      path: '/',
      element: !user ? <AuthLayout /> : <Navigate to="/" />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '*', element: <Navigate to="/login" /> }
      ]
    }
  ]);

  return routes;
};

export default Routes;