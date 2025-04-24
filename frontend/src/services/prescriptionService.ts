import { db } from '../config/firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, query, where, orderBy, Timestamp, DocumentData } from 'firebase/firestore';
import QRCode from 'qrcode';

interface TimestampFields {
  prescriptionDate?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

function convertTimestamps<T extends DocumentData & TimestampFields>(data: T): T {
  const result = { ...data };
  if (result.prescriptionDate instanceof Timestamp) {
    result.prescriptionDate = result.prescriptionDate.toDate() as T['prescriptionDate'];
  }
  if (result.createdAt instanceof Timestamp) {
    result.createdAt = result.createdAt.toDate() as T['createdAt'];
  }
  if (result.updatedAt instanceof Timestamp) {
    result.updatedAt = result.updatedAt.toDate() as T['updatedAt'];
  }
  return result;
}

interface PrescriptionData {
  id?: string;
  patientId: string;
  doctorId: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  instructions: string;
  prescriptionDate: Date;
  createdAt: Date;
  updatedAt: Date;
  qrCode?: string;
}

interface PrescriptionTemplateData {
  id?: string;
  doctorId: string;
  name: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  instructions: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  diagnosis: string;
  medications: Medication[];
  notes?: string;
  prescriptionDate: Timestamp;
  validUntil: Timestamp;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const COLLECTION = 'prescriptions';

export const createPrescription = async (prescription: Omit<Prescription, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...prescription,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar prescrição:', error);
    throw new Error('Falha ao criar prescrição. Por favor, tente novamente.');
  }
};

export const updatePrescription = async (id: string, prescription: Partial<Prescription>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
      ...prescription,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Erro ao atualizar prescrição:', error);
    throw new Error('Falha ao atualizar prescrição. Por favor, tente novamente.');
  }
};

export const deletePrescription = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Erro ao deletar prescrição:', error);
    throw new Error('Falha ao deletar prescrição. Por favor, tente novamente.');
  }
};

export const getPrescription = async (id: string): Promise<Prescription | null> => {
  try {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Prescription;
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar prescrição:', error);
    throw new Error('Falha ao buscar prescrição. Por favor, tente novamente.');
  }
};

export const getPrescriptionsByPatient = async (patientId: string): Promise<Prescription[]> => {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('patientId', '==', patientId),
      orderBy('prescriptionDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Prescription[];
  } catch (error) {
    console.error('Erro ao buscar prescrições do paciente:', error);
    throw new Error('Falha ao buscar prescrições. Por favor, tente novamente.');
  }
};

export const getPrescriptionsByDoctor = async (doctorId: string): Promise<Prescription[]> => {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('doctorId', '==', doctorId),
      orderBy('prescriptionDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Prescription[];
  } catch (error) {
    console.error('Erro ao buscar prescrições do médico:', error);
    throw new Error('Falha ao buscar prescrições. Por favor, tente novamente.');
  }
};

export const getActivePrescriptions = async (patientId: string): Promise<Prescription[]> => {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('patientId', '==', patientId),
      where('status', '==', 'active'),
      where('validUntil', '>', Timestamp.now()),
      orderBy('validUntil', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Prescription[];
  } catch (error) {
    console.error('Erro ao buscar prescrições ativas:', error);
    throw new Error('Falha ao buscar prescrições. Por favor, tente novamente.');
  }
};

export const createPrescriptionTemplate = async (templateData: Omit<PrescriptionTemplateData, 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = new Date();
    const docRef = await addDoc(collection(db, 'prescriptionTemplates'), {
      ...templateData,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating prescription template:', error);
    throw error;
  }
};

export const updatePrescriptionTemplate = async (id: string, templateData: Partial<PrescriptionTemplateData>): Promise<void> => {
  try {
    const templateRef = doc(db, 'prescriptionTemplates', id);
    await updateDoc(templateRef, {
      ...templateData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating prescription template:', error);
    throw error;
  }
};

export const getPrescriptionTemplates = async (doctorId: string): Promise<PrescriptionTemplateData[]> => {
  try {
    const q = query(
      collection(db, 'prescriptionTemplates'),
      where('doctorId', '==', doctorId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...(convertTimestamps(doc.data()) as PrescriptionTemplateData),
      id: doc.id
    }));
  } catch (error) {
    console.error('Error getting prescription templates:', error);
    throw error;
  }
}; 