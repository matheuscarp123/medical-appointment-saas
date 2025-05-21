import { Timestamp } from 'firebase/firestore';
import { Doctor, Appointment, Patient, DoctorAvailability } from '../types/entities';

export const convertFirestoreDate = (timestamp: Timestamp): string => {
  return timestamp.toDate().toISOString();
};

export const convertToFirestoreDate = (date: string): Timestamp => {
  return Timestamp.fromDate(new Date(date));
};

export const convertFirestoreDoctor = (data: any, id: string): Doctor => {
  return {
    id,
    nome: data.nome,
    crm: data.crm,
    especialidade: data.especialidade,
    email: data.email,
    telefone: data.telefone,
    endereco: data.endereco,
    disponibilidade: data.disponibilidade.map((d: any) => ({
      diaSemana: d.diaSemana,
      horaInicio: d.horaInicio,
      horaFim: d.horaFim
    } as DoctorAvailability)),
    createdAt: convertFirestoreDate(data.createdAt),
    updatedAt: convertFirestoreDate(data.updatedAt)
  };
};

export const convertFirestoreAppointment = (data: any, id: string): Appointment => {
  return {
    id,
    dataHora: convertFirestoreDate(data.dataHora),
    status: data.status,
    medicoId: data.medicoId,
    pacienteId: data.pacienteId,
    tipo: data.tipo,
    observacoes: data.observacoes,
    duration: data.duration || 30,
    createdAt: convertFirestoreDate(data.createdAt),
    updatedAt: convertFirestoreDate(data.updatedAt)
  };
};

export const convertFirestorePatient = (data: any, id: string): Patient => {
  return {
    id,
    nome: data.nome,
    cpf: data.cpf,
    email: data.email,
    telefone: data.telefone,
    endereco: data.endereco,
    dataNascimento: data.dataNascimento,
    sexo: data.sexo,
    createdAt: convertFirestoreDate(data.createdAt),
    updatedAt: convertFirestoreDate(data.updatedAt)
  };
}; 