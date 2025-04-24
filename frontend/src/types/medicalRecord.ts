export interface Vitals {
  temperature: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  weight: number;
  height: number;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  prescribedDate: Date;
  endDate?: Date;
}

export interface Exam {
  id: string;
  type: string;
  requestDate: Date;
  resultDate?: Date;
  status: 'requested' | 'completed' | 'cancelled';
  result?: string;
  fileUrl?: string;
  notes?: string;
}

export interface Diagnosis {
  code: string;
  description: string;
  type: 'primary' | 'secondary';
  date: Date;
  status: 'active' | 'resolved' | 'recurrent';
  notes?: string;
}

export interface ConsultationNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  date: Date;
  type: 'initial' | 'follow-up' | 'emergency';
  chiefComplaint: string;
  vitals: Vitals;
  consultationNote: ConsultationNote;
  diagnoses: Diagnosis[];
  prescriptions: Prescription[];
  exams: Exam[];
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadDate: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
} 