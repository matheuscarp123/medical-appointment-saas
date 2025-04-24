import { Doctor, Appointment, Patient, DoctorAvailability } from '../types/entities';

export const validateDoctor = (doctor: Partial<Doctor>): string[] => {
  const errors: string[] = [];
  
  if (!doctor.nome) errors.push('Nome é obrigatório');
  if (!doctor.crm) errors.push('CRM é obrigatório');
  if (!doctor.especialidade) errors.push('Especialidade é obrigatória');
  if (!doctor.email) errors.push('Email é obrigatório');
  if (!doctor.telefone) errors.push('Telefone é obrigatório');
  if (!doctor.endereco) errors.push('Endereço é obrigatório');
  if (!doctor.disponibilidade || doctor.disponibilidade.length === 0) {
    errors.push('Disponibilidade é obrigatória');
  } else {
    doctor.disponibilidade.forEach((d: DoctorAvailability, index: number) => {
      if (d.diaSemana < 0 || d.diaSemana > 6) {
        errors.push(`Dia da semana inválido na disponibilidade ${index + 1}`);
      }
      if (!d.horaInicio || !d.horaFim) {
        errors.push(`Horário inválido na disponibilidade ${index + 1}`);
      }
    });
  }
  
  return errors;
};

export const validateAppointment = (appointment: Partial<Appointment>): string[] => {
  const errors: string[] = [];
  
  if (!appointment.dataHora) errors.push('Data e hora são obrigatórios');
  if (!appointment.medicoId) errors.push('Médico é obrigatório');
  if (!appointment.pacienteId) errors.push('Paciente é obrigatório');
  if (!appointment.tipo) errors.push('Tipo de consulta é obrigatório');
  if (!appointment.duration || appointment.duration < 15) {
    errors.push('Duração mínima é 15 minutos');
  }
  
  return errors;
};

export const validatePatient = (patient: Partial<Patient>): string[] => {
  const errors: string[] = [];
  
  if (!patient.nome) errors.push('Nome é obrigatório');
  if (!patient.cpf) errors.push('CPF é obrigatório');
  if (!patient.email) errors.push('Email é obrigatório');
  if (!patient.telefone) errors.push('Telefone é obrigatório');
  if (!patient.endereco) errors.push('Endereço é obrigatório');
  if (!patient.dataNascimento) errors.push('Data de nascimento é obrigatória');
  if (!patient.sexo) errors.push('Sexo é obrigatório');
  
  return errors;
};

export const validateTimeSlot = (
  startTime: string,
  endTime: string,
  duration: number
): string[] => {
  const errors: string[] = [];
  
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  if (start >= end) {
    errors.push('Horário de início deve ser anterior ao horário de fim');
  }
  
  const slotDuration = (end.getTime() - start.getTime()) / (1000 * 60);
  if (slotDuration < duration) {
    errors.push('Duração do slot deve ser maior ou igual à duração da consulta');
  }
  
  return errors;
}; 