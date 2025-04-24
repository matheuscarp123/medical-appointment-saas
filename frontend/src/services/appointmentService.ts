import { Timestamp, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit, serverTimestamp, runTransaction, addDoc, DocumentData, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Appointment, AppointmentStatus, AppointmentType } from '../types/entities';
import { startOfDay, endOfDay, addMinutes, isBefore, isAfter, format, parse, isSameDay } from 'date-fns';

const appointmentsRef = collection(db, 'appointments');

interface FirestoreAppointment extends DocumentData {
  dataHora: Timestamp;
  status: AppointmentStatus;
  medicoId: string;
  pacienteId: string;
  tipo: AppointmentType;
  observacoes?: string;
  duration: number;
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
 * Converte um Timestamp do Firestore para Date
 */
const timestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

/**
 * Verifica se há conflito de horário entre duas consultas
 * @param appointmentDate Data e hora da consulta para verificar
 * @param duration Duração da consulta em minutos (default 30 min)
 * @param existingAppointmentDate Data e hora de consulta existente
 * @param existingDuration Duração da consulta existente em minutos (default 30 min)
 */
export const hasTimeConflict = (
  appointmentDate: Date,
  duration: number = 30,
  existingAppointmentDate: Date,
  existingDuration: number = 30
): boolean => {
  const appointmentEnd = addMinutes(appointmentDate, duration);
  const existingAppointmentEnd = addMinutes(existingAppointmentDate, existingDuration);

  // Verifica sobreposição
  return (
    (isAfter(appointmentDate, existingAppointmentDate) && isBefore(appointmentDate, existingAppointmentEnd)) ||
    (isAfter(appointmentEnd, existingAppointmentDate) && isBefore(appointmentEnd, existingAppointmentEnd)) ||
    (isBefore(appointmentDate, existingAppointmentDate) && isAfter(appointmentEnd, existingAppointmentEnd)) ||
    appointmentDate.getTime() === existingAppointmentDate.getTime()
  );
};

/**
 * Busca todas as consultas
 */
export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const querySnapshot = await getDocs(query(appointmentsRef, orderBy('dataHora', 'desc')));
    
    const appointments = querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreAppointment;
      return {
        id: doc.id,
        dataHora: data.dataHora.toDate().toISOString(),
        status: data.status,
        medicoId: data.medicoId,
        pacienteId: data.pacienteId,
        tipo: data.tipo,
        observacoes: data.observacoes,
        duration: data.duration,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString()
      } as Appointment;
    });
    
    return appointments;
  } catch (error) {
    console.error('Erro ao buscar consultas:', error);
    throw new Error('Falha ao carregar consultas');
  }
};

/**
 * Busca consultas por status
 */
export const getAppointmentsByStatus = async (status: AppointmentStatus): Promise<Appointment[]> => {
  try {
    const q = query(
      appointmentsRef,
      where('status', '==', status),
      orderBy('dataHora', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const appointments = querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreAppointment;
      return {
        id: doc.id,
        dataHora: data.dataHora ? data.dataHora.toDate() : null,
        status: data.status,
        medicoId: data.medicoId,
        pacienteId: data.pacienteId,
        tipo: data.tipo,
        observacoes: data.observacoes,
        duration: data.duration || 30,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null
      } as Appointment;
    });
    
    return appointments;
  } catch (error) {
    console.error(`Erro ao buscar consultas com status ${status}:`, error);
    throw new Error('Falha ao carregar consultas');
  }
};

/**
 * Busca consultas por paciente
 */
export const getAppointmentsByPatient = async (patientId: string): Promise<Appointment[]> => {
  try {
    const q = query(
      appointmentsRef,
      where('pacienteId', '==', patientId),
      orderBy('dataHora', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const appointments = querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreAppointment;
      return {
        id: doc.id,
        dataHora: data.dataHora ? data.dataHora.toDate() : null,
        status: data.status,
        medicoId: data.medicoId,
        pacienteId: data.pacienteId,
        tipo: data.tipo,
        observacoes: data.observacoes,
        duration: data.duration || 30,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null
      } as Appointment;
    });
    
    return appointments;
  } catch (error) {
    console.error(`Erro ao buscar consultas do paciente ${patientId}:`, error);
    throw new Error('Falha ao carregar consultas');
  }
};

/**
 * Busca consultas por médico
 */
export const getAppointmentsByDoctor = async (doctorId: string): Promise<Appointment[]> => {
  try {
    const q = query(
      appointmentsRef,
      where('medicoId', '==', doctorId),
      orderBy('dataHora', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const appointments = querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreAppointment;
      return {
        id: doc.id,
        dataHora: data.dataHora ? data.dataHora.toDate() : null,
        status: data.status,
        medicoId: data.medicoId,
        pacienteId: data.pacienteId,
        tipo: data.tipo,
        observacoes: data.observacoes,
        duration: data.duration || 30,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null
      } as Appointment;
    });
    
    return appointments;
  } catch (error) {
    console.error(`Erro ao buscar consultas do médico ${doctorId}:`, error);
    throw new Error('Falha ao carregar consultas');
  }
};

/**
 * Busca consultas por data
 */
export const getAppointmentsByDate = async (date: Date): Promise<Appointment[]> => {
  try {
    const startDate = startOfDay(date);
    const endDate = endOfDay(date);
    
    const q = query(
      appointmentsRef,
      where('dataHora', '>=', dateToTimestamp(startDate)),
      where('dataHora', '<=', dateToTimestamp(endDate)),
      orderBy('dataHora', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const appointments = querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreAppointment;
      return {
        id: doc.id,
        dataHora: data.dataHora ? data.dataHora.toDate() : null,
        status: data.status,
        medicoId: data.medicoId,
        pacienteId: data.pacienteId,
        tipo: data.tipo,
        observacoes: data.observacoes,
        duration: data.duration || 30,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null
      } as Appointment;
    });
    
    return appointments;
  } catch (error) {
    console.error(`Erro ao buscar consultas da data ${date}:`, error);
    throw new Error('Falha ao carregar consultas');
  }
};

/**
 * Busca consultas por intervalo de datas
 */
export const getAppointmentsByDateRange = async (startDate: Date, endDate: Date): Promise<Appointment[]> => {
  try {
    const q = query(
      appointmentsRef,
      where('dataHora', '>=', dateToTimestamp(startDate)),
      where('dataHora', '<=', dateToTimestamp(endDate)),
      orderBy('dataHora', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const appointments = querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreAppointment;
      return {
        id: doc.id,
        dataHora: data.dataHora ? data.dataHora.toDate() : null,
        status: data.status,
        medicoId: data.medicoId,
        pacienteId: data.pacienteId,
        tipo: data.tipo,
        observacoes: data.observacoes,
        duration: data.duration || 30,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null
      } as Appointment;
    });
    
    return appointments;
  } catch (error) {
    console.error('Erro ao buscar consultas por intervalo de datas:', error);
    throw new Error('Falha ao carregar consultas por período');
  }
};

/**
 * Busca uma consulta pelo ID
 */
export const getAppointmentById = async (id: string): Promise<Appointment> => {
  try {
    const docRef = doc(appointmentsRef, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Consulta não encontrada');
    }
    
    const data = docSnap.data() as FirestoreAppointment;
    
    return {
      id: docSnap.id,
      dataHora: data.dataHora ? data.dataHora.toDate() : null,
      status: data.status,
      medicoId: data.medicoId,
      pacienteId: data.pacienteId,
      tipo: data.tipo,
      observacoes: data.observacoes,
      duration: data.duration || 30,
      createdAt: data.createdAt ? data.createdAt.toDate() : null,
      updatedAt: data.updatedAt ? data.updatedAt.toDate() : null
    } as Appointment;
  } catch (error) {
    console.error(`Erro ao buscar consulta ${id}:`, error);
    throw new Error('Falha ao carregar consulta');
  }
};

/**
 * Cria uma nova consulta com validação de disponibilidade
 */
export const createAppointment = async (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> => {
  try {
    // Verificar disponibilidade do médico
    const appointmentDate = new Date(data.dataHora);
    const { available } = await checkDoctorAvailability(data.medicoId, appointmentDate);
    
    if (!available) {
      throw new Error('Médico não disponível no horário selecionado');
    }
    
    // Buscar consultas do médico na mesma data para verificar conflitos
    const startDate = startOfDay(appointmentDate);
    const endDate = endOfDay(appointmentDate);
    
    const q = query(
      appointmentsRef,
      where('medicoId', '==', data.medicoId),
      where('dataHora', '>=', dateToTimestamp(startDate)),
      where('dataHora', '<=', dateToTimestamp(endDate)),
      where('status', 'in', ['AGENDADO', 'CONFIRMADO'])
    );
    
    const querySnapshot = await getDocs(q);
    
    const existingAppointments = querySnapshot.docs.map(doc => {
      const appointmentData = doc.data() as FirestoreAppointment;
      return {
        id: doc.id,
        dataHora: appointmentData.dataHora.toDate(),
        duration: appointmentData.duration
      };
    });
    
    // Verificar se há conflito de horário com consultas existentes
    const hasConflict = existingAppointments.some(appointment => 
      hasTimeConflict(
        appointmentDate,
        data.duration,
        appointment.dataHora,
        appointment.duration
      )
    );
    
    if (hasConflict) {
      throw new Error('Existe um conflito de horário com outra consulta');
    }
    
    // Criar a consulta
    const newAppointment = {
      ...data,
      dataHora: dateToTimestamp(appointmentDate),
      status: 'AGENDADO' as AppointmentStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(appointmentsRef, newAppointment);
    
    return {
      id: docRef.id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Appointment;
  } catch (error) {
    console.error('Erro ao criar consulta:', error);
    throw error;
  }
};

/**
 * Atualiza uma consulta existente
 */
export const updateAppointment = async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
  try {
    const docRef = doc(appointmentsRef, id);
    
    // Se estiver atualizando a data da consulta, verificar conflitos
    if (data.dataHora && data.medicoId) {
      const appointmentDate = data.dataHora;
      const appointmentDuration = data.duration || 30;
      
      // Verificar conflitos de horário, excluindo a própria consulta
      const conflictQuery = query(
        appointmentsRef,
        where('medicoId', '==', data.medicoId),
        where('dataHora', '>=', dateToTimestamp(startOfDay(appointmentDate))),
        where('dataHora', '<=', dateToTimestamp(endOfDay(appointmentDate))),
        where('status', 'in', ['agendado', 'confirmado'])
      );
      
      const conflictSnapshot = await getDocs(conflictQuery);
      
      // Verificar se existe conflito de horário
      const conflictingAppointment = conflictSnapshot.docs.find(doc => {
        // Ignorar a própria consulta
        if (doc.id === id) return false;
        
        const existingData = doc.data() as FirestoreAppointment;
        const existingDate = existingData.dataHora.toDate();
        const existingDuration = existingData.duration || 30;
        
        return hasTimeConflict(appointmentDate, appointmentDuration, existingDate, existingDuration);
      });
      
      if (conflictingAppointment) {
        throw new Error('Existe um conflito de horário com outra consulta');
      }
    }
    
    // Preparar dados para atualização
    const updateData: any = {
      ...data,
      updatedAt: serverTimestamp()
    };
    
    // Converter Date para Timestamp se existir
    if (data.dataHora) {
      updateData.dataHora = dateToTimestamp(data.dataHora);
    }
    
    // Atualizar consulta
    await updateDoc(docRef, updateData);
    
    // Buscar consulta atualizada
    const updatedDoc = await getDoc(docRef);
    if (!updatedDoc.exists()) {
      throw new Error('Consulta não encontrada após atualização');
    }
    
    const updatedData = updatedDoc.data() as FirestoreAppointment;
    
    return {
      id: updatedDoc.id,
      dataHora: updatedData.dataHora ? updatedData.dataHora.toDate() : null,
      status: updatedData.status,
      medicoId: updatedData.medicoId,
      pacienteId: updatedData.pacienteId,
      tipo: updatedData.tipo,
      observacoes: updatedData.observacoes,
      duration: updatedData.duration || 30,
      createdAt: updatedData.createdAt ? updatedData.createdAt.toDate() : null,
      updatedAt: updatedData.updatedAt ? updatedData.updatedAt.toDate() : null
    } as Appointment;
  } catch (error) {
    console.error(`Erro ao atualizar consulta ${id}:`, error);
    throw error;
  }
};

/**
 * Atualiza o status de uma consulta
 */
export const updateAppointmentStatus = async (id: string, status: AppointmentStatus): Promise<Appointment> => {
  try {
    const docRef = doc(appointmentsRef, id);
    
    const updateData = {
      status,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, updateData);
    
    // Buscar consulta atualizada
    const updatedDoc = await getDoc(docRef);
    if (!updatedDoc.exists()) {
      throw new Error('Consulta não encontrada após atualização de status');
    }
    
    const updatedData = updatedDoc.data() as FirestoreAppointment;
    
    return {
      id: updatedDoc.id,
      dataHora: updatedData.dataHora ? updatedData.dataHora.toDate() : null,
      status: updatedData.status,
      medicoId: updatedData.medicoId,
      pacienteId: updatedData.pacienteId,
      tipo: updatedData.tipo,
      observacoes: updatedData.observacoes,
      duration: updatedData.duration || 30,
      createdAt: updatedData.createdAt ? updatedData.createdAt.toDate() : null,
      updatedAt: updatedData.updatedAt ? updatedData.updatedAt.toDate() : null
    } as Appointment;
  } catch (error) {
    console.error(`Erro ao atualizar status da consulta ${id}:`, error);
    throw error;
  }
};

/**
 * Remove uma consulta
 */
export const deleteAppointment = async (id: string): Promise<void> => {
  try {
    const docRef = doc(appointmentsRef, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Erro ao excluir consulta ${id}:`, error);
    throw new Error('Falha ao excluir consulta');
  }
};

/**
 * Verifica a disponibilidade de um médico em uma determinada data
 */
export const checkDoctorAvailability = async (
  doctorId: string,
  date: Date
): Promise<{ available: boolean; slots: Date[] }> => {
  try {
    // Buscar todas as consultas do médico no mês
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const q = query(
      appointmentsRef,
      where('medicoId', '==', doctorId),
      where('dataHora', '>=', dateToTimestamp(startOfMonth)),
      where('dataHora', '<=', dateToTimestamp(endOfMonth)),
      where('status', '!=', 'canceled')
    );
    
    const querySnapshot = await getDocs(q);
    const appointments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dataHora: doc.data().dataHora.toDate()
    }));
    
    // Gerar slots disponíveis (30 minutos cada)
    const slots: Date[] = [];
    const currentDate = new Date(startOfMonth);
    
    while (currentDate <= endOfMonth) {
      // Verificar se é dia útil (segunda a sexta)
      if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
        // Horário comercial (8h às 18h)
        for (let hour = 8; hour < 18; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const slotDate = new Date(currentDate);
            slotDate.setHours(hour, minute, 0, 0);
            
            // Verificar se o slot está disponível
            const isAvailable = !appointments.some(appointment => {
              const appointmentDate = appointment.dataHora;
              return (
                isSameDay(appointmentDate, slotDate) &&
                appointmentDate.getHours() === hour &&
                appointmentDate.getMinutes() === minute
              );
            });
            
            if (isAvailable) {
              slots.push(new Date(slotDate));
            }
          }
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return {
      available: slots.length > 0,
      slots
    };
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    throw new Error('Falha ao verificar disponibilidade');
  }
};

/**
 * Configura um listener para obter atualizações em tempo real de consultas
 * @param callback Função a ser chamada quando houver mudanças
 * @param filters Filtros opcionais (médico, paciente, data)
 * @returns Função para desinscrever o listener
 */
export const subscribeToAppointments = (
  callback: (appointments: Appointment[]) => void,
  filters?: {
    doctorId?: string;
    patientId?: string;
    startDate?: Date;
    endDate?: Date;
    status?: AppointmentStatus;
  }
): (() => void) => {
  let q = query(appointmentsRef, orderBy('dataHora', 'desc'));
  
  if (filters) {
    if (filters.doctorId) {
      q = query(q, where('medicoId', '==', filters.doctorId));
    }
    
    if (filters.patientId) {
      q = query(q, where('pacienteId', '==', filters.patientId));
    }
    
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    if (filters.startDate && filters.endDate) {
      q = query(
        q,
        where('dataHora', '>=', dateToTimestamp(filters.startDate)),
        where('dataHora', '<=', dateToTimestamp(filters.endDate))
      );
    }
  }
  
  return onSnapshot(q, (querySnapshot) => {
    const appointments = querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreAppointment;
      return {
        id: doc.id,
        dataHora: data.dataHora ? data.dataHora.toDate() : null,
        status: data.status,
        medicoId: data.medicoId,
        pacienteId: data.pacienteId,
        tipo: data.tipo,
        observacoes: data.observacoes,
        duration: data.duration || 30,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null
      } as Appointment;
    });
    
    callback(appointments);
  });
};