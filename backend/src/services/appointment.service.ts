import { adminFirestore } from '../config/firebase-admin';
import { Appointment, AppointmentRating } from '../types/entities';
import { ApiErrorHandler } from '../middlewares/error.middleware';
import { getDoctorById } from './doctor.service';
import { getPatientById } from './patient.service';
import { v4 as uuidv4 } from 'uuid';

const appointmentCollection = adminFirestore.collection('appointments');

export const createAppointment = async (appointmentData: Partial<Appointment>): Promise<Appointment> => {
  try {
    // Verificar se o médico existe
    await getDoctorById(appointmentData.doctorId!);
    
    // Verificar se o paciente existe
    await getPatientById(appointmentData.patientId!);
    
    // Verificar se o horário está disponível
    await checkAppointmentAvailability(
      appointmentData.doctorId!,
      appointmentData.date!,
      appointmentData.startTime!,
      appointmentData.endTime!
    );
    
    const timestamp = new Date().toISOString();
    
    const newAppointment: Appointment = {
      id: uuidv4(),
      doctorId: appointmentData.doctorId!,
      patientId: appointmentData.patientId!,
      date: appointmentData.date!,
      startTime: appointmentData.startTime!,
      endTime: appointmentData.endTime!,
      status: 'scheduled',
      type: appointmentData.type || 'in_person',
      notes: appointmentData.notes || '',
      symptoms: appointmentData.symptoms || '',
      diagnosis: '',
      prescription: '',
      followUpNeeded: false,
      paymentStatus: 'pending',
      paymentAmount: appointmentData.paymentAmount || 0,
      documents: [],
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    await appointmentCollection.doc(newAppointment.id).set(newAppointment);
    
    console.log(`Agendamento criado com sucesso: ${newAppointment.id}`);
    return newAppointment;
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao criar agendamento:', error);
    throw new ApiErrorHandler(
      `Erro ao criar agendamento: ${error.message}`,
      500,
      'APPOINTMENT_CREATION_ERROR'
    );
  }
};

export const getAppointmentById = async (appointmentId: string): Promise<Appointment> => {
  try {
    const appointmentDoc = await appointmentCollection.doc(appointmentId).get();
    
    if (!appointmentDoc.exists) {
      throw new ApiErrorHandler(
        'Agendamento não encontrado',
        404,
        'APPOINTMENT_NOT_FOUND'
      );
    }
    
    return appointmentDoc.data() as Appointment;
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao buscar agendamento por ID:', error);
    throw new ApiErrorHandler(
      `Erro ao buscar agendamento: ${error.message}`,
      500,
      'APPOINTMENT_FETCH_ERROR'
    );
  }
};

export async function getAppointments(companyId: string): Promise<Appointment[]> {
  try {
    const snapshot = await appointmentCollection(companyId).get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Appointment[];
  } catch (error: any) {
    console.error('Erro ao buscar agendamentos:', error);
    throw new ApiErrorHandler(
      `Erro ao buscar agendamentos: ${error.message}`,
      500,
      'APPOINTMENT_FETCH_ERROR'
    );
  }
};

export async function updateAppointment(id: string, appointmentData: Partial<Appointment>, companyId: string): Promise<Appointment> {
  try {
    const ref = appointmentCollection(companyId).doc(id);
    
    // Se estiver alterando data/hora, verificar disponibilidade
    if (
      (appointmentData.date && appointmentData.date !== (await ref.get()).data()?.date) ||
      (appointmentData.startTime && appointmentData.startTime !== (await ref.get()).data()?.startTime) ||
      (appointmentData.endTime && appointmentData.endTime !== (await ref.get()).data()?.endTime)
    ) {
      await checkAppointmentAvailability(
        (await ref.get()).data()?.doctorId,
        appointmentData.date || (await ref.get()).data()?.date,
        appointmentData.startTime || (await ref.get()).data()?.startTime,
        appointmentData.endTime || (await ref.get()).data()?.endTime,
        id
      );
    }
    
    // Remover campos que não devem ser atualizados diretamente
    const { id, createdAt, ...updateData } = appointmentData;
    
    const updatedAppointment = {
      ...appointment,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await appointmentCollection.doc(appointmentId).update(updatedAppointment);
    
    return updatedAppointment as Appointment;
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao atualizar agendamento:', error);
    throw new ApiErrorHandler(
      `Erro ao atualizar agendamento: ${error.message}`,
      500,
      'APPOINTMENT_UPDATE_ERROR'
    );
  }
};

export const cancelAppointment = async (
  appointmentId: string,
  cancelReason?: string
): Promise<Appointment> => {
  try {
    const appointmentDoc = await appointmentCollection.doc(appointmentId).get();
    
    if (!appointmentDoc.exists) {
      throw new ApiErrorHandler(
        'Agendamento não encontrado',
        404,
        'APPOINTMENT_NOT_FOUND'
      );
    }
    
    const appointment = appointmentDoc.data() as Appointment;
    
    if (appointment.status === 'completed') {
      throw new ApiErrorHandler(
        'Não é possível cancelar um agendamento já concluído',
        400,
        'APPOINTMENT_ALREADY_COMPLETED'
      );
    }
    
    const updatedAppointment = {
      ...appointment,
      status: 'cancelled',
      notes: cancelReason 
        ? `${appointment.notes}\n\nCancelado: ${cancelReason}` 
        : appointment.notes,
      updatedAt: new Date().toISOString()
    };
    
    await appointmentCollection.doc(appointmentId).update(updatedAppointment);
    
    return updatedAppointment as Appointment;
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao cancelar agendamento:', error);
    throw new ApiErrorHandler(
      `Erro ao cancelar agendamento: ${error.message}`,
      500,
      'APPOINTMENT_CANCELLATION_ERROR'
    );
  }
};

export const completeAppointment = async (
  appointmentId: string,
  completionData: {
    diagnosis?: string;
    prescription?: string;
    followUpNeeded?: boolean;
    followUpDate?: string;
    notes?: string;
  }
): Promise<Appointment> => {
  try {
    const appointmentDoc = await appointmentCollection.doc(appointmentId).get();
    
    if (!appointmentDoc.exists) {
      throw new ApiErrorHandler(
        'Agendamento não encontrado',
        404,
        'APPOINTMENT_NOT_FOUND'
      );
    }
    
    const appointment = appointmentDoc.data() as Appointment;
    
    if (appointment.status === 'cancelled') {
      throw new ApiErrorHandler(
        'Não é possível concluir um agendamento cancelado',
        400,
        'APPOINTMENT_ALREADY_CANCELLED'
      );
    }
    
    if (appointment.status === 'completed') {
      throw new ApiErrorHandler(
        'Agendamento já foi concluído',
        400,
        'APPOINTMENT_ALREADY_COMPLETED'
      );
    }
    
    const updatedAppointment = {
      ...appointment,
      status: 'completed',
      diagnosis: completionData.diagnosis || appointment.diagnosis,
      prescription: completionData.prescription || appointment.prescription,
      followUpNeeded: completionData.followUpNeeded !== undefined 
        ? completionData.followUpNeeded 
        : appointment.followUpNeeded,
      followUpDate: completionData.followUpDate || appointment.followUpDate,
      notes: completionData.notes 
        ? `${appointment.notes}\n\n${completionData.notes}` 
        : appointment.notes,
      updatedAt: new Date().toISOString()
    };
    
    await appointmentCollection.doc(appointmentId).update(updatedAppointment);
    
    return updatedAppointment as Appointment;
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao concluir agendamento:', error);
    throw new ApiErrorHandler(
      `Erro ao concluir agendamento: ${error.message}`,
      500,
      'APPOINTMENT_COMPLETION_ERROR'
    );
  }
};

export const rateAppointment = async (
  appointmentId: string,
  rating: AppointmentRating
): Promise<Appointment> => {
  try {
    const appointmentDoc = await appointmentCollection.doc(appointmentId).get();
    
    if (!appointmentDoc.exists) {
      throw new ApiErrorHandler(
        'Agendamento não encontrado',
        404,
        'APPOINTMENT_NOT_FOUND'
      );
    }
    
    const appointment = appointmentDoc.data() as Appointment;
    
    if (appointment.status !== 'completed') {
      throw new ApiErrorHandler(
        'Apenas consultas concluídas podem ser avaliadas',
        400,
        'APPOINTMENT_NOT_COMPLETED'
      );
    }
    
    if (appointment.ratings) {
      throw new ApiErrorHandler(
        'Este agendamento já foi avaliado',
        400,
        'APPOINTMENT_ALREADY_RATED'
      );
    }
    
    const updatedAppointment = {
      ...appointment,
      ratings: {
        ...rating,
        timestamp: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    };
    
    await appointmentCollection.doc(appointmentId).update(updatedAppointment);
    
    // Atualizar a avaliação do médico
    const { updateDoctorRating } = require('./doctor.service');
    await updateDoctorRating(appointment.doctorId, rating.overallRating);
    
    return updatedAppointment as Appointment;
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao avaliar agendamento:', error);
    throw new ApiErrorHandler(
      `Erro ao avaliar agendamento: ${error.message}`,
      500,
      'APPOINTMENT_RATING_ERROR'
    );
  }
};

export const getPatientAppointments = async (patientId: string): Promise<Appointment[]> => {
  try {
    const appointmentsSnapshot = await appointmentCollection
      .where('patientId', '==', patientId)
      .orderBy('date', 'desc')
      .orderBy('startTime', 'desc')
      .get();
    
    return appointmentsSnapshot.docs.map(doc => doc.data() as Appointment);
  } catch (error: any) {
    console.error('Erro ao buscar agendamentos do paciente:', error);
    throw new ApiErrorHandler(
      `Erro ao buscar agendamentos: ${error.message}`,
      500,
      'PATIENT_APPOINTMENTS_FETCH_ERROR'
    );
  }
};

export const getDoctorAppointments = async (doctorId: string): Promise<Appointment[]> => {
  try {
    const appointmentsSnapshot = await appointmentCollection
      .where('doctorId', '==', doctorId)
      .orderBy('date', 'desc')
      .orderBy('startTime', 'desc')
      .get();
    
    return appointmentsSnapshot.docs.map(doc => doc.data() as Appointment);
  } catch (error: any) {
    console.error('Erro ao buscar agendamentos do médico:', error);
    throw new ApiErrorHandler(
      `Erro ao buscar agendamentos: ${error.message}`,
      500,
      'DOCTOR_APPOINTMENTS_FETCH_ERROR'
    );
  }
};

export const getDoctorAppointmentsByDate = async (
  doctorId: string,
  date: string
): Promise<Appointment[]> => {
  try {
    const appointmentsSnapshot = await appointmentCollection
      .where('doctorId', '==', doctorId)
      .where('date', '==', date)
      .orderBy('startTime', 'asc')
      .get();
    
    return appointmentsSnapshot.docs.map(doc => doc.data() as Appointment);
  } catch (error: any) {
    console.error('Erro ao buscar agendamentos do médico por data:', error);
    throw new ApiErrorHandler(
      `Erro ao buscar agendamentos: ${error.message}`,
      500,
      'DOCTOR_APPOINTMENTS_BY_DATE_FETCH_ERROR'
    );
  }
};

export const getPatientAppointmentsByDateRange = async (
  patientId: string,
  startDate: string,
  endDate: string
): Promise<Appointment[]> => {
  try {
    const appointmentsSnapshot = await appointmentCollection
      .where('patientId', '==', patientId)
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .orderBy('date', 'asc')
      .orderBy('startTime', 'asc')
      .get();
    
    return appointmentsSnapshot.docs.map(doc => doc.data() as Appointment);
  } catch (error: any) {
    console.error('Erro ao buscar agendamentos do paciente por intervalo de datas:', error);
    throw new ApiErrorHandler(
      `Erro ao buscar agendamentos: ${error.message}`,
      500,
      'PATIENT_APPOINTMENTS_BY_DATE_RANGE_FETCH_ERROR'
    );
  }
};

export const getDoctorAppointmentsByDateRange = async (
  doctorId: string,
  startDate: string,
  endDate: string
): Promise<Appointment[]> => {
  try {
    const appointmentsSnapshot = await appointmentCollection
      .where('doctorId', '==', doctorId)
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .orderBy('date', 'asc')
      .orderBy('startTime', 'asc')
      .get();
    
    return appointmentsSnapshot.docs.map(doc => doc.data() as Appointment);
  } catch (error: any) {
    console.error('Erro ao buscar agendamentos do médico por intervalo de datas:', error);
    throw new ApiErrorHandler(
      `Erro ao buscar agendamentos: ${error.message}`,
      500,
      'DOCTOR_APPOINTMENTS_BY_DATE_RANGE_FETCH_ERROR'
    );
  }
};

// Função auxiliar para verificar disponibilidade de horário
export const checkAppointmentAvailability = async (
  doctorId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeAppointmentId?: string
): Promise<boolean> => {
  try {
    // Buscar agendamentos do médico na data especificada
    const appointmentsSnapshot = await appointmentCollection
      .where('doctorId', '==', doctorId)
      .where('date', '==', date)
      .where('status', 'in', ['scheduled', 'confirmed'])
      .get();
    
    // Verificar se há conflito de horário
    const hasConflict = appointmentsSnapshot.docs.some(doc => {
      const appointment = doc.data() as Appointment;
      
      // Ignorar o próprio agendamento (no caso de atualização)
      if (excludeAppointmentId && appointment.id === excludeAppointmentId) {
        return false;
      }
      
      // Verificar conflito de horário
      return (
        (startTime >= appointment.startTime && startTime < appointment.endTime) ||
        (endTime > appointment.startTime && endTime <= appointment.endTime) ||
        (startTime <= appointment.startTime && endTime >= appointment.endTime)
      );
    });
    
    if (hasConflict) {
      throw new ApiErrorHandler(
        'Horário indisponível para agendamento',
        400,
        'APPOINTMENT_TIME_CONFLICT'
      );
    }
    
    return true;
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao verificar disponibilidade de horário:', error);
    throw new ApiErrorHandler(
      `Erro ao verificar disponibilidade: ${error.message}`,
      500,
      'APPOINTMENT_AVAILABILITY_CHECK_ERROR'
    );
  }
};
