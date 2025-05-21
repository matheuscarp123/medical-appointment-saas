export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Insurance {
  provider: string;
  planNumber: string;
  validUntil: string;
}

export interface MedicalHistory {
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
  surgeries: string[];
  familyHistory: string[];
}

export interface Patient {
  id?: string;
  name: string;
  cpf: string;
  rg?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  phone: string;
  email: string;
  occupation?: string;
  address: Address;
  emergencyContact: EmergencyContact;
  insurance?: Insurance;
  medicalHistory: MedicalHistory;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PatientFormData extends Omit<Patient, 'id' | 'createdAt' | 'updatedAt'> {} 