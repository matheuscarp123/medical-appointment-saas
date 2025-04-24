import { adminFirestore } from '../config/firebase-admin';
import { Patient, User } from '../types/entities';
import { ApiErrorHandler } from '../middlewares/error.middleware';
import { getUserById } from './user.service';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database';
import { cacheService } from './cache.service';
import { encryptionService } from './encryption.service';
import { queueService } from './queue.service';
import { logger } from '../utils/logger';

const patientCollection = adminFirestore.collection('patients');

const CACHE_TTL = 600; // 10 minutos
const PATIENTS_CACHE_KEY = 'patients:all';
const PATIENT_CACHE_KEY = (id: string) => `patient:${id}`;

export const createPatient = async (patientData: Partial<Patient>, userId: string): Promise<Patient> => {
  try {
    // Verificar se o usuário existe
    const user = await getUserById(userId);
    
    // Verificar se já existe um paciente com este userId
    const existingPatientSnapshot = await patientCollection
      .where('userId', '==', userId)
      .limit(1)
      .get();
    
    if (!existingPatientSnapshot.empty) {
      throw new ApiErrorHandler(
        'Já existe um perfil de paciente para este usuário',
        409,
        'PATIENT_ALREADY_EXISTS'
      );
    }
    
    const timestamp = new Date().toISOString();
    
    const newPatient: Patient = {
      id: uuidv4(),
      userId,
      birthDate: patientData.birthDate || '',
      gender: patientData.gender || 'prefer_not_to_say',
      bloodType: patientData.bloodType || '',
      height: patientData.height || 0,
      weight: patientData.weight || 0,
      allergies: patientData.allergies || [],
      chronicConditions: patientData.chronicConditions || [],
      medications: patientData.medications || [],
      emergencyContact: patientData.emergencyContact,
      insuranceInfo: patientData.insuranceInfo,
      medicalHistory: patientData.medicalHistory || [],
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    await patientCollection.doc(newPatient.id).set(newPatient);
    
    console.log(`Paciente criado com sucesso: ${newPatient.id}`);
    return newPatient;
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao criar paciente:', error);
    throw new ApiErrorHandler(
      `Erro ao criar paciente: ${error.message}`,
      500,
      'PATIENT_CREATION_ERROR'
    );
  }
};

export const getPatientById = async (patientId: string): Promise<{ patient: Patient; user: User }> => {
  try {
    const patientDoc = await patientCollection.doc(patientId).get();
    
    if (!patientDoc.exists) {
      throw new ApiErrorHandler(
        'Paciente não encontrado',
        404,
        'PATIENT_NOT_FOUND'
      );
    }
    
    const patient = patientDoc.data() as Patient;
    const user = await getUserById(patient.userId);
    
    return { patient, user };
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao buscar paciente por ID:', error);
    throw new ApiErrorHandler(
      `Erro ao buscar paciente: ${error.message}`,
      500,
      'PATIENT_FETCH_ERROR'
    );
  }
};

export const getPatientByUserId = async (userId: string): Promise<Patient> => {
  try {
    const patientsSnapshot = await patientCollection
      .where('userId', '==', userId)
      .limit(1)
      .get();
    
    if (patientsSnapshot.empty) {
      throw new ApiErrorHandler(
        'Paciente não encontrado',
        404,
        'PATIENT_NOT_FOUND'
      );
    }
    
    return patientsSnapshot.docs[0].data() as Patient;
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao buscar paciente por ID de usuário:', error);
    throw new ApiErrorHandler(
      `Erro ao buscar paciente: ${error.message}`,
      500,
      'PATIENT_FETCH_ERROR'
    );
  }
};

export const updatePatient = async (
  patientId: string,
  patientData: Partial<Patient>,
  companyId: string
): Promise<Patient> => {
  try {
    const patientDoc = await adminFirestore.collection('companies').doc(companyId).collection('patients').doc(patientId).get();
    
    if (!patientDoc.exists) {
      throw new ApiErrorHandler(
        'Paciente não encontrado',
        404,
        'PATIENT_NOT_FOUND'
      );
    }
    
    // Remover campos que não devem ser atualizados diretamente
    const { id, userId, createdAt, ...updateData } = patientData;
    
    const updatedPatient = {
      ...patientDoc.data(),
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await adminFirestore.collection('companies').doc(companyId).collection('patients').doc(patientId).update(updatedPatient);
    
    return updatedPatient as Patient;
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao atualizar paciente:', error);
    throw new ApiErrorHandler(
      `Erro ao atualizar paciente: ${error.message}`,
      500,
      'PATIENT_UPDATE_ERROR'
    );
  }
};

export const addMedicalRecord = async (
  patientId: string,
  medicalRecord: any
): Promise<Patient> => {
  try {
    const patientDoc = await patientCollection.doc(patientId).get();
    
    if (!patientDoc.exists) {
      throw new ApiErrorHandler(
        'Paciente não encontrado',
        404,
        'PATIENT_NOT_FOUND'
      );
    }
    
    const patient = patientDoc.data() as Patient;
    const medicalHistory = patient.medicalHistory || [];
    
    const updatedPatient = {
      ...patient,
      medicalHistory: [...medicalHistory, medicalRecord],
      updatedAt: new Date().toISOString()
    };
    
    await patientCollection.doc(patientId).update(updatedPatient);
    
    return updatedPatient as Patient;
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao adicionar histórico médico:', error);
    throw new ApiErrorHandler(
      `Erro ao adicionar histórico médico: ${error.message}`,
      500,
      'MEDICAL_RECORD_ADD_ERROR'
    );
  }
};

export const getAllPatients = async (): Promise<{ patient: Patient; user: User }[]> => {
  try {
    const patientsSnapshot = await patientCollection.get();
    const patientsWithUsers: { patient: Patient; user: User }[] = [];
    
    for (const patientDoc of patientsSnapshot.docs) {
      const patient = patientDoc.data() as Patient;
      try {
        const user = await getUserById(patient.userId);
        patientsWithUsers.push({ patient, user });
      } catch (error) {
        console.error(`Erro ao buscar usuário do paciente ${patient.id}:`, error);
        // Continuar com o próximo paciente
      }
    }
    
    return patientsWithUsers;
  } catch (error: any) {
    console.error('Erro ao buscar todos os pacientes:', error);
    throw new ApiErrorHandler(
      `Erro ao buscar pacientes: ${error.message}`,
      500,
      'PATIENTS_FETCH_ERROR'
    );
  }
};

export const searchPatients = async (searchTerm: string): Promise<{ patient: Patient; user: User }[]> => {
  try {
    // Buscar todos os pacientes e filtrar no lado do servidor
    const allPatients = await getAllPatients();
    
    return allPatients.filter(({ patient, user }) => {
      const searchTermLower = searchTerm.toLowerCase();
      const nameMatch = user.name.toLowerCase().includes(searchTermLower);
      const emailMatch = user.email.toLowerCase().includes(searchTermLower);
      
      return nameMatch || emailMatch;
    });
  } catch (error: any) {
    console.error('Erro ao pesquisar pacientes:', error);
    throw new ApiErrorHandler(
      `Erro ao pesquisar pacientes: ${error.message}`,
      500,
      'PATIENTS_SEARCH_ERROR'
    );
  }
};

export const getPatients = async (): Promise<Patient[]> => {
  return cacheService.getOrSet(
    PATIENTS_CACHE_KEY,
    async () => {
      const patients = await db.patients.findMany({
        orderBy: { name: 'asc' }
      });

      // Criptografar dados sensíveis
      return patients.map(patient => ({
        ...patient,
        cpf: encryptionService.encrypt(patient.cpf),
        phone: encryptionService.encrypt(patient.phone),
        email: encryptionService.encrypt(patient.email)
      }));
    },
    CACHE_TTL
  );
};

export const getPatientById = async (id: string): Promise<Patient> => {
  return cacheService.getOrSet(
    PATIENT_CACHE_KEY(id),
    async () => {
      const patient = await db.patients.findUnique({
        where: { id }
      });

      if (!patient) {
        throw new Error('Patient not found');
      }

      // Criptografar dados sensíveis
      return {
        ...patient,
        cpf: encryptionService.encrypt(patient.cpf),
        phone: encryptionService.encrypt(patient.phone),
        email: encryptionService.encrypt(patient.email)
      };
    },
    CACHE_TTL
  );
};

export const createPatient = async (data: Omit<Patient, 'id'>): Promise<Patient> => {
  // Verificar se CPF já existe
  const existingPatient = await db.patients.findFirst({
    where: {
      cpf: encryptionService.hash(data.cpf)
    }
  });

  if (existingPatient) {
    throw new Error('CPF already registered');
  }

  // Criar paciente com dados criptografados
  const patient = await db.patients.create({
    data: {
      ...data,
      cpf: encryptionService.hash(data.cpf),
      phone: encryptionService.encrypt(data.phone),
      email: encryptionService.encrypt(data.email)
    }
  });

  // Invalidar cache
  await cacheService.del(PATIENTS_CACHE_KEY);

  // Adicionar job para processamento assíncrono
  await queueService.addJob('patient-created', {
    patientId: patient.id,
    action: 'create'
  });

  return patient;
};

export const updatePatient = async (id: string, data: Partial<Patient>): Promise<Patient> => {
  const updateData: any = { ...data };

  // Criptografar dados sensíveis se presentes
  if (data.cpf) {
    updateData.cpf = encryptionService.hash(data.cpf);
  }
  if (data.phone) {
    updateData.phone = encryptionService.encrypt(data.phone);
  }
  if (data.email) {
    updateData.email = encryptionService.encrypt(data.email);
  }

  const patient = await db.patients.update({
    where: { id },
    data: updateData
  });

  // Invalidar cache
  await cacheService.del(PATIENTS_CACHE_KEY);
  await cacheService.del(PATIENT_CACHE_KEY(id));

  // Adicionar job para processamento assíncrono
  await queueService.addJob('patient-updated', {
    patientId: patient.id,
    action: 'update'
  });

  return patient;
};

export const deletePatient = async (id: string): Promise<void> => {
  await db.patients.delete({
    where: { id }
  });

  // Invalidar cache
  await cacheService.del(PATIENTS_CACHE_KEY);
  await cacheService.del(PATIENT_CACHE_KEY(id));

  // Adicionar job para processamento assíncrono
  await queueService.addJob('patient-deleted', {
    patientId: id,
    action: 'delete'
  });
};
