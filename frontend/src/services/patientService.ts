import api from './api';
import { Patient } from '../types/entities';

/**
 * Busca todos os pacientes
 */
export const getPatients = async (): Promise<Patient[]> => {
  try {
    const response = await api.get('/patients');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    throw new Error('Falha ao carregar pacientes');
  }
};

/**
 * Busca um paciente pelo ID
 */
export const getPatientById = async (id: string): Promise<Patient> => {
  try {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar paciente ${id}:`, error);
    throw new Error('Falha ao carregar paciente');
  }
};

/**
 * Verifica se um CPF já está cadastrado
 */
export const checkCpfExists = async (cpf: string): Promise<boolean> => {
  try {
    const response = await api.get('/patients', { params: { cpf } });
    return response.data.length > 0;
  } catch (error) {
    console.error(`Erro ao verificar CPF ${cpf}:`, error);
    throw new Error('Falha ao verificar CPF');
  }
};

/**
 * Cria um novo paciente com validação de CPF único
 */
export const createPatient = async (data: Omit<Patient, 'id'>): Promise<Patient> => {
  try {
    const response = await api.post('/patients', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar paciente:', error);
    throw new Error('Falha ao criar paciente');
  }
};

/**
 * Atualiza um paciente existente
 */
export const updatePatient = async (id: string, data: Partial<Patient>): Promise<Patient> => {
  try {
    const response = await api.put(`/patients/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar paciente ${id}:`, error);
    throw new Error('Falha ao atualizar paciente');
  }
};

/**
 * Remove um paciente
 */
export const deletePatient = async (id: string): Promise<void> => {
  try {
    await api.delete(`/patients/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar paciente ${id}:`, error);
    throw new Error('Falha ao deletar paciente');
  }
};

/**
 * Busca registros médicos de um paciente
 */
export const getPatientMedicalRecords = async (patientId: string): Promise<any[]> => {
  try {
    const response = await api.get(`/patients/${patientId}/medical-records`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar prontuários do paciente ${patientId}:`, error);
    throw new Error('Falha ao carregar prontuários');
  }
};

/**
 * Busca consultas de um paciente
 */
export const getPatientAppointments = async (patientId: string): Promise<any[]> => {
  try {
    const response = await api.get(`/patients/${patientId}/appointments`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar consultas do paciente ${patientId}:`, error);
    throw new Error('Falha ao carregar consultas');
  }
};

/**
 * Busca pagamentos de um paciente
 */
export const getPatientPayments = async (patientId: string): Promise<any[]> => {
  try {
    const response = await api.get(`/patients/${patientId}/payments`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar pagamentos do paciente ${patientId}:`, error);
    throw new Error('Falha ao carregar pagamentos');
  }
};

/**
 * Busca prescrições de um paciente
 */
export const getPatientPrescriptions = async (patientId: string): Promise<any[]> => {
  try {
    const response = await api.get(`/patients/${patientId}/prescriptions`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar prescrições do paciente ${patientId}:`, error);
    throw new Error('Falha ao carregar prescrições');
  }
};

/**
 * Busca resultados de exames de um paciente
 */
export const getPatientTestResults = async (patientId: string): Promise<any[]> => {
  try {
    const response = await api.get(`/patients/${patientId}/test-results`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar resultados de exames do paciente ${patientId}:`, error);
    throw new Error('Falha ao carregar resultados de exames');
  }
};