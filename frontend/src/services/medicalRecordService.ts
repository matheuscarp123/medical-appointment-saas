import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { MedicalRecord } from '../types/medicalRecord';

const COLLECTION_NAME = 'medicalRecords';

export const createMedicalRecord = async (record: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...record,
      date: Timestamp.fromDate(record.date),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating medical record:', error);
    throw error;
  }
};

export const updateMedicalRecord = async (id: string, record: Partial<MedicalRecord>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...record,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating medical record:', error);
    throw error;
  }
};

export const getMedicalRecord = async (id: string): Promise<MedicalRecord | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as MedicalRecord;
    }

    return null;
  } catch (error) {
    console.error('Error fetching medical record:', error);
    throw error;
  }
};

export const getPatientMedicalRecords = async (patientId: string): Promise<MedicalRecord[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('patientId', '==', patientId),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as MedicalRecord;
    });
  } catch (error) {
    console.error('Error fetching patient medical records:', error);
    throw error;
  }
};

export const uploadAttachment = async (file: File, patientId: string, recordId: string): Promise<string> => {
  try {
    const fileRef = ref(storage, `medical-records/${patientId}/${recordId}/${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading attachment:', error);
    throw error;
  }
};

export const generatePDF = async (record: MedicalRecord): Promise<Blob> => {
  try {
    // This is a placeholder for PDF generation logic
    // In a real application, you would use a library like pdfmake or jspdf
    // to generate a properly formatted PDF with the medical record data
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}; 