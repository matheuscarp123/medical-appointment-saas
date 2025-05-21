import api from './api';
import { DiagnosisSuggestion } from '../types/entities';

export const createDiagnosisSuggestion = async (data: {
  patientId: string;
  doctorId: string;
  appointmentId: string;
  symptoms: string[];
}): Promise<DiagnosisSuggestion> => {
  const response = await api.post('/diagnosis-suggestions', data);
  return response.data;
};

export const getDiagnosisSuggestionById = async (id: string): Promise<DiagnosisSuggestion> => {
  const response = await api.get(`/diagnosis-suggestions/${id}`);
  return response.data;
};

export const getDiagnosisSuggestionsByPatient = async (patientId: string): Promise<DiagnosisSuggestion[]> => {
  const response = await api.get(`/diagnosis-suggestions/patient/${patientId}`);
  return response.data;
};

export const getDiagnosisSuggestionsByDoctor = async (doctorId: string): Promise<DiagnosisSuggestion[]> => {
  const response = await api.get(`/diagnosis-suggestions/doctor/${doctorId}`);
  return response.data;
};

export const updateDiagnosisSuggestion = async (
  id: string,
  data: Partial<DiagnosisSuggestion>
): Promise<DiagnosisSuggestion> => {
  const response = await api.put(`/diagnosis-suggestions/${id}`, data);
  return response.data;
};

export const deleteDiagnosisSuggestion = async (id: string): Promise<void> => {
  await api.delete(`/diagnosis-suggestions/${id}`);
};

export const provideDoctorFeedback = async (
  id: string,
  feedback: {
    correct: boolean;
    actualDiagnosis?: string;
    notes?: string;
  }
): Promise<DiagnosisSuggestion> => {
  const response = await api.post(`/diagnosis-suggestions/${id}/feedback`, feedback);
  return response.data;
};

export const getDiagnosisStatistics = async (params?: {
  doctorId?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<{
  totalSuggestions: number;
  correctSuggestions: number;
  accuracyRate: number;
  topDiagnoses: Array<{
    name: string;
    count: number;
    accuracy: number;
  }>;
  modelPerformance: {
    aiModel: string;
    averageConfidence: number;
    accuracyRate: number;
  }[];
}> => {
  const response = await api.get('/diagnosis-suggestions/statistics', { params });
  return response.data;
};