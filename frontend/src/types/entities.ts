import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  uid?: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient' | 'receptionist';
  photoURL?: string;
  displayName?: string;
  token?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  status: 'active' | 'inactive';
  paymentStatus?: 'pending' | 'paid' | 'failed';
}

export type Specialty =
  | 'Cardiologia'
  | 'Dermatologia'
  | 'Endocrinologia'
  | 'Gastroenterologia'
  | 'Neurologia'
  | 'Oftalmologia'
  | 'Ortopedia'
  | 'Pediatria'
  | 'Psiquiatria'
  | 'Urologia';

export type AppointmentType = 'consultation' | 'followUp' | 'examination';

export type AppointmentStatus = 'agendado' | 'cancelado' | 'concluído' | 'confirmado' | 'noShow';

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Availability {
  dayOfWeek: number;
  isAvailable: boolean;
  startTime: string | null;
  endTime: string | null;
  appointmentDuration: number;
}

export interface Doctor {
  id: string;
  nome: string;
  crm: string;
  especialidade: DoctorSpecialty;
  email: string;
  telefone: string;
  endereco: string;
  disponibilidade: DoctorAvailability[];
  createdAt: string;
  updatedAt: string;
}

export interface DoctorAvailability {
  diaSemana: number;
  horaInicio: string;
  horaFim: string;
}

export type DoctorSpecialty = 
  | 'CLINICO_GERAL'
  | 'PEDIATRA'
  | 'GINECOLOGISTA'
  | 'ORTOPEDISTA'
  | 'DERMATOLOGISTA'
  | 'CARDIOLOGISTA'
  | 'NEUROLOGISTA'
  | 'PSIQUIATRA'
  | 'ENDOCRINOLOGISTA'
  | 'GASTROENTEROLOGISTA';

export interface Patient {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: string;
  dataNascimento: string;
  sexo: 'M' | 'F' | 'OUTRO';
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  dataHora: string;
  status: AppointmentStatus;
  medicoId: string;
  pacienteId: string;
  tipo: AppointmentType;
  observacoes?: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 'appointment' | 'system' | 'alert';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Timestamp;
}

export interface Payment {
  id: string;
  appointmentId: string;
  patientId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'refunded' | 'failed';
  method: 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash';
  transactionId?: string;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiagnosisCondition {
  id: string;
  name: string;
  confidence: number;
  description: string;
  symptoms: string[];
  matchingSymptoms?: string[];
  recommendedTests?: string[];
  recommendedTreatments?: string[];
  visualClass?: 'high-probability' | 'medium-probability' | 'low-probability';
}

export interface DiagnosisSuggestion {
  id: string;
  patientId?: string;
  patientName?: string;
  doctorId?: string;
  doctorName?: string;
  appointmentId?: string;
  symptoms: string[];
  suggestedDiagnoses: DiagnosisCondition[];
  description?: string;
  severity?: 'low' | 'medium' | 'high';
  aiModel?: string;
  aiConfidence?: number;
  alternativeDiagnoses?: { name: string; probability: number }[];
  doctorFeedback?: {
    correct: boolean;
    actualDiagnosis?: string;
    notes?: string;
  };
  recommendedTests?: string[];
  recommendedTreatments?: string[];
  disclaimer?: string;
  createdAt: Date | {
    toDate: () => Date;
    toMillis: () => number;
  };
  updatedAt?: Date | {
    toDate: () => Date;
    toMillis: () => number;
  };
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  type:
    | 'consultation'
    | 'examination'
    | 'prescription'
    | 'test_result'
    | 'vaccination'
    | 'surgery'
    | 'other';
  title: string;
  description: string;
  attachments?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}