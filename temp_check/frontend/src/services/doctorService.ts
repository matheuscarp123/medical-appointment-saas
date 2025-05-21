import { Timestamp, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit, DocumentData, runTransaction, addDoc, serverTimestamp } from 'firebase/firestore';
import { startOfDay, endOfDay, addMinutes, isBefore, isAfter, format, parse, isSameDay } from 'date-fns';
import { db } from '../config/firebase';
import { Doctor, Appointment, Patient, Specialty, DoctorAvailability, DoctorSpecialty } from '../types/entities';
import { hasTimeConflict } from './appointmentService';

const doctorsRef = collection(db, 'doctors');
const specialtiesRef = collection(db, 'specialties');
const appointmentsRef = collection(db, 'appointments');
const patientsRef = collection(db, 'patients');

interface FirestoreDoctor extends DocumentData {
  nome: string;
  crm: string;
  especialidade: DoctorSpecialty;
  email: string;
  telefone: string;
  endereco: string;
  disponibilidade: DoctorAvailability[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Converte um objeto Date para Timestamp do Firestore
 */
const dateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

/**
 * Busca todos os médicos
 */
export const getDoctors = async (): Promise<Doctor[]> => {
  try {
    const querySnapshot = await getDocs(query(doctorsRef, orderBy('nome')));
    
    const doctors = querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreDoctor;
      return {
        id: doc.id,
        nome: data.nome,
        crm: data.crm,
        especialidade: data.especialidade,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco,
        disponibilidade: data.disponibilidade,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString()
      } as Doctor;
    });
    
    return doctors;
  } catch (error) {
    console.error('Erro ao buscar médicos:', error);
    throw new Error('Falha ao carregar médicos');
  }
};

/**
 * Busca um médico pelo ID
 */
export const getDoctorById = async (id: string): Promise<Doctor | null> => {
  try {
    const docRef = doc(doctorsRef, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data() as FirestoreDoctor;
    
    return {
      id: docSnap.id,
      nome: data.nome,
      crm: data.crm,
      especialidade: data.especialidade,
      email: data.email,
      telefone: data.telefone,
      endereco: data.endereco,
      disponibilidade: data.disponibilidade,
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt.toDate().toISOString()
    } as Doctor;
  } catch (error) {
    console.error(`Erro ao buscar médico ${id}:`, error);
    throw new Error('Falha ao carregar médico');
  }
};

/**
 * Verifica se um CRM já está cadastrado
 */
export const checkCrmExists = async (crm: string, uf: string): Promise<boolean> => {
  try {
    const q = query(
      doctorsRef, 
      where('CRM', '==', crm),
      where('CRMUF', '==', uf)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error(`Erro ao verificar CRM ${crm}/${uf}:`, error);
    throw new Error('Falha ao verificar CRM');
  }
};

/**
 * Cria um novo médico
 */
export const createDoctor = async (data: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Doctor> => {
  try {
    const newDoctor = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(doctorsRef, newDoctor);
    
    return {
      id: docRef.id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Doctor;
  } catch (error) {
    console.error('Erro ao criar médico:', error);
    throw new Error('Falha ao criar médico');
  }
};

/**
 * Atualiza um médico existente
 */
export const updateDoctor = async (id: string, data: Partial<Doctor>): Promise<Doctor> => {
  try {
    const docRef = doc(doctorsRef, id);
    const updateData = {
      ...data,
      updatedAt: new Date()
    };
    
    await updateDoc(docRef, updateData);
    
    const updatedDoc = await getDoc(docRef);
    const updatedData = updatedDoc.data() as FirestoreDoctor;
    
    return {
      id: updatedDoc.id,
      nome: updatedData.nome,
      crm: updatedData.crm,
      especialidade: updatedData.especialidade,
      email: updatedData.email,
      telefone: updatedData.telefone,
      endereco: updatedData.endereco,
      disponibilidade: updatedData.disponibilidade,
      createdAt: updatedData.createdAt.toDate().toISOString(),
      updatedAt: updatedData.updatedAt.toDate().toISOString()
    } as Doctor;
  } catch (error) {
    console.error(`Erro ao atualizar médico ${id}:`, error);
    throw new Error('Falha ao atualizar médico');
  }
};

/**
 * Remove um médico
 */
export const deleteDoctor = async (id: string): Promise<void> => {
  try {
    const docRef = doc(doctorsRef, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Erro ao remover médico ${id}:`, error);
    throw new Error('Falha ao remover médico');
  }
};

/**
 * Busca médicos por especialidade
 */
export const getDoctorsBySpecialty = async (specialty: DoctorSpecialty): Promise<Doctor[]> => {
  try {
    const q = query(doctorsRef, where('especialidade', '==', specialty), orderBy('nome'));
    const querySnapshot = await getDocs(q);
    
    const doctors = querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreDoctor;
      return {
        id: doc.id,
        nome: data.nome,
        crm: data.crm,
        especialidade: data.especialidade,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco,
        disponibilidade: data.disponibilidade,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString()
      } as Doctor;
    });
    
    return doctors;
  } catch (error) {
    console.error(`Erro ao buscar médicos da especialidade ${specialty}:`, error);
    throw new Error('Falha ao carregar médicos');
  }
};

/**
 * Busca todas as especialidades médicas
 */
export const getSpecialties = async (): Promise<Specialty[]> => {
  try {
    const querySnapshot = await getDocs(query(specialtiesRef, orderBy('nome')));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as unknown as Specialty[];
  } catch (error) {
    console.error('Erro ao buscar especialidades:', error);
    throw new Error('Falha ao carregar especialidades');
  }
};

/**
 * Busca uma especialidade pelo ID
 */
export const getSpecialtyById = async (id: string): Promise<Specialty> => {
  try {
    const docRef = doc(specialtiesRef, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Especialidade não encontrada');
    }
    
    return { id: docSnap.id, ...docSnap.data() } as Specialty;
  } catch (error) {
    console.error(`Erro ao buscar especialidade ${id}:`, error);
    throw new Error('Falha ao carregar especialidade');
  }
};

/**
 * Cria uma nova especialidade
 */
export const createSpecialty = async (data: Omit<Specialty, 'id'>): Promise<Specialty> => {
  try {
    // Verificar se já existe especialidade com o mesmo nome
    const q = query(specialtiesRef, where('nome', '==', data.nome));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error(`Especialidade '${data.nome}' já existe`);
    }
    
    const docRef = await addDoc(specialtiesRef, data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Erro ao criar especialidade:', error);
    throw error;
  }
};

/**
 * Atualiza uma especialidade
 */
export const updateSpecialty = async (id: string, data: Partial<Specialty>): Promise<Specialty> => {
  try {
    const specialtyRef = doc(specialtiesRef, id);
    const specialtySnap = await getDoc(specialtyRef);
    
    if (!specialtySnap.exists()) {
      throw new Error('Especialidade não encontrada');
    }
    
    // Verificar se já existe outra especialidade com o mesmo nome
    if (data.nome) {
      const q = query(specialtiesRef, where('nome', '==', data.nome));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty && querySnapshot.docs[0].id !== id) {
        throw new Error(`Especialidade '${data.nome}' já existe`);
      }
    }
    
    await updateDoc(specialtyRef, data);
    
    const updatedSnap = await getDoc(specialtyRef);
    return { id, ...updatedSnap.data() } as Specialty;
  } catch (error) {
    console.error(`Erro ao atualizar especialidade ${id}:`, error);
    throw error;
  }
};

/**
 * Remove uma especialidade
 */
export const deleteSpecialty = async (id: string): Promise<void> => {
  try {
    // Verificar se há médicos com esta especialidade
    const q = query(doctorsRef, where('especialidade', '==', id));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('Não é possível excluir especialidade com médicos vinculados');
    }
    
    await deleteDoc(doc(specialtiesRef, id));
  } catch (error) {
    console.error(`Erro ao excluir especialidade ${id}:`, error);
    throw error;
  }
};

/**
 * Busca os horários disponíveis de um médico em uma data específica
 */
export const getDoctorAvailability = async (doctorId: string, date: Date): Promise<Date[]> => {
  try {
    const { slots } = await checkDoctorAvailability(doctorId, date);
    return slots;
  } catch (error) {
    console.error(`Erro ao buscar disponibilidade do médico ${doctorId}:`, error);
    throw new Error('Falha ao verificar disponibilidade');
  }
};

/**
 * Verifica a disponibilidade de um médico em uma data/hora específica
 */
export const checkDoctorAvailability = async (
  doctorId: string,
  date: Date
): Promise<{ available: boolean; reason?: string }> => {
  try {
    const doctor = await getDoctorById(doctorId);
    
    if (!doctor) {
      return { available: false, reason: 'Médico não encontrado' };
    }
    
    // Verificar se o médico tem disponibilidade no dia da semana
    const dayOfWeek = date.getDay();
    const dayAvailability = doctor.disponibilidade.find(d => d.diaSemana === dayOfWeek);
    
    if (!dayAvailability) {
      return { available: false, reason: 'Médico não atende neste dia da semana' };
    }
    
    // Verificar se o horário está dentro do período de atendimento
    const appointmentTime = format(date, 'HH:mm');
    const startTime = format(parse(dayAvailability.horaInicio, 'HH:mm', new Date()), 'HH:mm');
    const endTime = format(parse(dayAvailability.horaFim, 'HH:mm', new Date()), 'HH:mm');
    
    if (appointmentTime < startTime || appointmentTime > endTime) {
      return { available: false, reason: 'Horário fora do período de atendimento' };
    }
    
    return { available: true };
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    return { available: false, reason: 'Erro ao verificar disponibilidade' };
  }
};

/**
 * Gera todos os slots de horário disponíveis em um dia para um médico
 */
const generateAvailableTimeSlots = (
  date: Date,
  availability: { startTime: string, endTime: string, appointmentDuration: number },
  bookedSlots: { startTime: Date, duration: number }[]
): Date[] => {
  const slots: Date[] = [];
  
  // Definir horário de início e fim
  const [startHour, startMinute] = availability.startTime.split(':').map(Number);
  const [endHour, endMinute] = availability.endTime.split(':').map(Number);
  
  const startDate = new Date(date);
  startDate.setHours(startHour, startMinute, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(endHour, endMinute, 0, 0);
  
  // Duração da consulta em minutos
  const slotDuration = availability.appointmentDuration || 30;
  
  // Adicionar slots
  let currentSlot = new Date(startDate);
  while (currentSlot < endDate) {
    const slotEndTime = new Date(currentSlot);
    slotEndTime.setMinutes(slotEndTime.getMinutes() + slotDuration);
    
    // Verificar se o slot não se sobrepõe a nenhum horário já reservado
    const isAvailable = !bookedSlots.some(bookedSlot => 
      hasTimeConflict(
        currentSlot,
        slotDuration,
        bookedSlot.startTime,
        bookedSlot.duration
      )
    );
    
    if (isAvailable) {
      slots.push(new Date(currentSlot));
    }
    
    // Avançar para o próximo slot
    currentSlot.setMinutes(currentSlot.getMinutes() + slotDuration);
  }
  
  return slots;
};

/**
 * Bloqueia um horário ou dia específico para um médico
 */
export const blockDoctorTime = async (
  doctorId: string,
  blockingData: {
    date: Date;
    type: 'full_day' | 'time_slot';
    startTime?: Date;
    endTime?: Date;
    reason?: string;
  }
): Promise<string> => {
  try {
    const blockingsRef = collection(db, 'doctorBlockings');
    
    const newBlocking = {
      doctorId,
      date: startOfDay(blockingData.date),
      type: blockingData.type,
      startTime: blockingData.startTime ? dateToTimestamp(blockingData.startTime) : null,
      endTime: blockingData.endTime ? dateToTimestamp(blockingData.endTime) : null,
      reason: blockingData.reason || '',
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(blockingsRef, newBlocking);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao bloquear horário do médico:', error);
    throw new Error('Falha ao bloquear horário');
  }
};

/**
 * Remove um bloqueio de horário de um médico
 */
export const unblockDoctorTime = async (blockingId: string): Promise<void> => {
  try {
    const blockingRef = doc(collection(db, 'doctorBlockings'), blockingId);
    await deleteDoc(blockingRef);
  } catch (error) {
    console.error('Erro ao desbloquear horário do médico:', error);
    throw new Error('Falha ao desbloquear horário');
  }
};

/**
 * Busca as consultas de um médico
 */
export const getDoctorAppointments = async (doctorId: string, params?: {
  startDate?: Date;
  endDate?: Date;
  status?: string;
}): Promise<Appointment[]> => {
  try {
    const q = query(
      appointmentsRef,
      where('medicoId', '==', doctorId),
      params?.startDate && where('data', '>=', params.startDate),
      params?.endDate && where('data', '<=', params.endDate),
      params?.status && where('status', '==', params.status)
    );
    
    const querySnapshot = await getDocs(q);
    const appointments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as unknown as Appointment[];
    
    return appointments;
  } catch (error) {
    console.error(`Erro ao buscar consultas do médico ${doctorId}:`, error);
    throw new Error('Falha ao carregar consultas');
  }
};

/**
 * Busca os pacientes de um médico
 */
export const getDoctorPatients = async (doctorId: string): Promise<Patient[]> => {
  try {
    const q = query(
      patientsRef,
      where('medicoId', '==', doctorId)
    );
    
    const querySnapshot = await getDocs(q);
    const patients = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as unknown as Patient[];
    
    return patients;
  } catch (error) {
    console.error(`Erro ao buscar pacientes do médico ${doctorId}:`, error);
    throw new Error('Falha ao carregar pacientes');
  }
};

/**
 * Busca as estatísticas de um médico
 */
export const getDoctorStats = async (doctorId: string, period: 'day' | 'week' | 'month' | 'year'): Promise<{
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  averageRating: number;
  totalPatients: number;
  totalRevenue: number;
}> => {
  try {
    const stats: any = {};
    
    // Buscar consultas do médico
    const appointments = await getDoctorAppointments(doctorId);
    
    // Calcular estatísticas de consultas
    stats.totalAppointments = appointments.length;
    stats.completedAppointments = appointments.filter(appointment => appointment.status === 'completed').length;
    stats.cancelledAppointments = appointments.filter(appointment => appointment.status === 'cancelled').length;
    stats.noShowAppointments = appointments.filter(appointment => appointment.status === 'no-show').length;
    
    // Buscar pacientes do médico
    const patients = await getDoctorPatients(doctorId);
    
    // Calcular estatísticas de pacientes
    stats.totalPatients = patients.length;
    
    // Calcular estatísticas de receita
    stats.totalRevenue = appointments.reduce((acc, appointment) => acc + appointment.price, 0);
    
    // Calcular estatísticas de avaliação
    const ratings = appointments.filter(appointment => appointment.rating).map(appointment => appointment.rating);
    stats.averageRating = ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
    
    return stats;
  } catch (error) {
    console.error(`Erro ao buscar estatísticas do médico ${doctorId}:`, error);
    throw new Error('Falha ao carregar estatísticas');
  }
};