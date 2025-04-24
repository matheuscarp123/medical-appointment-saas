export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  email: string;
  name: string;
  photoURL?: string;
  role: 'admin' | 'doctor' | 'patient';
  status: 'active' | 'inactive';
  lastLogin?: string;
  phoneNumber?: string;
  address?: Address;
  notificationSettings?: NotificationSettings;
}

export interface Doctor extends BaseEntity {
  userId: string;
  specialization: string;
  crm: string;
  bio?: string;
  consultationPrice?: number;
  availableHours?: AvailableHour[];
  rating?: number;
  reviewCount?: number;
  education?: Education[];
  experience?: Experience[];
  skills?: string[];
  languages?: string[];
  acceptingNewPatients: boolean;
  appointmentDuration: number; // em minutos
}

export interface Patient extends BaseEntity {
  userId: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  bloodType?: string;
  height?: number;
  weight?: number;
  allergies?: string[];
  chronicConditions?: string[];
  medications?: string[];
  emergencyContact?: EmergencyContact;
  insuranceInfo?: InsuranceInfo;
  medicalHistory?: MedicalRecord[];
}

export interface Appointment extends BaseEntity {
  doctorId: string;
  patientId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  type: 'in_person' | 'video_call';
  notes?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  followUpNeeded?: boolean;
  followUpDate?: string;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  paymentAmount?: number;
  meetingLink?: string;
  documents?: Document[];
  ratings?: AppointmentRating;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  reminderTimeBeforeAppointment: 15 | 30 | 60 | 1440; // em minutos (15, 30, 60 minutos ou 1 dia)
}

export interface AvailableHour {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo, 6 = sábado
  startTime: string; // formato "HH:MM"
  endTime: string; // formato "HH:MM"
  isAvailable: boolean;
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  description?: string;
}

export interface Experience {
  institution: string;
  position: string;
  startYear: number;
  endYear?: number; // se for undefined, significa que é o trabalho atual
  description?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  expirationDate?: string;
  coverage?: string;
}

export interface MedicalRecord {
  date: string;
  condition: string;
  treatment: string;
  notes?: string;
  doctorId?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface AppointmentRating {
  overallRating: number; // 1-5
  punctuality: number; // 1-5
  bedside: number; // 1-5
  clarity: number; // 1-5
  comment?: string;
  timestamp: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  appointmentsStats: AppointmentsStats;
  patientsStats: PatientsStats;
  financialStats: FinancialStats;
  recentActivities: Activity[];
}

export interface AppointmentsStats {
  total: number;
  upcoming: number;
  completed: number;
  cancelled: number;
  noShow: number;
  mostPopularTime?: string;
  mostPopularDay?: string;
}

export interface PatientsStats {
  total: number;
  new: number; // últimos 30 dias
  returning: number;
  averageAge?: number;
  genderDistribution?: {
    male: number;
    female: number;
    other: number;
  };
}

export interface FinancialStats {
  totalRevenue: number;
  pendingPayments: number;
  refundedAmount: number;
  monthlyRevenue: { month: string; amount: number }[];
}

export interface Activity {
  id: string;
  type: 'appointment_created' | 'appointment_cancelled' | 'payment_received' | 'new_patient' | 'review_received' | 'document_uploaded';
  description: string;
  timestamp: string;
  entityId?: string; // ID do usuário, consulta, etc. relacionado
  metadata?: Record<string, any>; // Dados adicionais específicos da atividade
}
