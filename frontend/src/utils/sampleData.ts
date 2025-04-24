import { Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

// Types
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
}

interface SampleAppointment {
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: Timestamp;
  type: 'consultation' | 'followUp' | 'examination';
  status: 'scheduled' | 'confirmed' | 'canceled' | 'completed' | 'missed';
  notes?: string;
  symptoms?: string[];
  createdAt: Timestamp;
}

// Sample doctors data
const sampleDoctors: Omit<Doctor, 'id'>[] = [
  {
    name: 'Dr. José Silva',
    specialty: 'Cardiologia',
    email: 'jose.silva@mediflow.com',
    phone: '(11) 99123-4567',
  },
  {
    name: 'Dra. Ana Souza',
    specialty: 'Dermatologia',
    email: 'ana.souza@mediflow.com',
    phone: '(11) 99234-5678',
  },
  {
    name: 'Dr. Carlos Oliveira',
    specialty: 'Neurologia',
    email: 'carlos.oliveira@mediflow.com',
    phone: '(11) 99345-6789',
  },
  {
    name: 'Dra. Mariana Santos',
    specialty: 'Pediatria',
    email: 'mariana.santos@mediflow.com',
    phone: '(11) 99456-7890',
  },
];

// Sample patients data
const samplePatients: Omit<Patient, 'id'>[] = [
  {
    name: 'Maria da Silva',
    email: 'maria.silva@email.com',
    phone: '(11) 98765-4321',
    birthDate: new Date(1985, 5, 15),
  },
  {
    name: 'João Oliveira',
    email: 'joao.oliveira@email.com',
    phone: '(11) 98654-3210',
    birthDate: new Date(1990, 8, 21),
  },
  {
    name: 'Luciana Costa',
    email: 'luciana.costa@email.com',
    phone: '(11) 98543-2109',
    birthDate: new Date(1978, 2, 10),
  },
  {
    name: 'Pedro Santos',
    email: 'pedro.santos@email.com',
    phone: '(11) 98432-1098',
    birthDate: new Date(1982, 11, 3),
  },
  {
    name: 'Juliana Pereira',
    email: 'juliana.pereira@email.com',
    phone: '(11) 98321-0987',
    birthDate: new Date(1995, 4, 27),
  },
];

// Sample appointment notes
const sampleNotes = [
  'Paciente relata dores de cabeça frequentes',
  'Retorno para avaliação do tratamento',
  'Exame de rotina anual',
  'Paciente com sintomas de gripe',
  'Consulta pré-operatória',
  'Acompanhamento pós-cirúrgico',
  'Primeira consulta - avaliação geral',
  'Paciente relata dores lombares',
  'Consulta para renovação de receita',
  'Avaliação de exames recentes',
];

// Sample symptoms
const sampleSymptoms = [
  ['febre', 'dor de cabeça', 'fadiga'],
  ['tosse', 'coriza', 'espirros'],
  ['dor abdominal', 'náusea'],
  ['insônia', 'ansiedade'],
  ['dor nas articulações', 'rigidez muscular'],
  ['falta de ar', 'dor no peito'],
  ['tontura', 'vertigem'],
  ['rash cutâneo', 'coceira'],
  ['perda de apetite', 'perda de peso'],
  ['pressão alta', 'palpitações'],
];

// Function to get a random item from an array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Function to get a random date within a range
const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Function to get a random time between 8:00 and 18:00
const getRandomTime = (date: Date): Date => {
  const hours = Math.floor(Math.random() * 10) + 8; // 8-18
  const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)]; // 0, 15, 30, or 45
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

// Function to generate sample data
export const generateSampleData = async (
  numAppointments: number = 20,
  startDate: Date = new Date(),
  endDate: Date = new Date(new Date().setMonth(new Date().getMonth() + 1))
) => {
  try {
    // First, check if we already have doctors and patients
    const doctorsRef = collection(db, 'doctors');
    const doctorsSnapshot = await getDocs(doctorsRef);
    let doctors: Doctor[] = [];

    if (doctorsSnapshot.empty) {
      // Add sample doctors
      console.log('Adding sample doctors...');
      for (const doctor of sampleDoctors) {
        const docRef = await addDoc(doctorsRef, doctor);
        doctors.push({ id: docRef.id, ...doctor });
      }
    } else {
      // Use existing doctors
      doctors = doctorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Omit<Doctor, 'id'> }));
    }

    // Check for patients
    const patientsRef = collection(db, 'patients');
    const patientsSnapshot = await getDocs(patientsRef);
    let patients: Patient[] = [];

    if (patientsSnapshot.empty) {
      // Add sample patients
      console.log('Adding sample patients...');
      for (const patient of samplePatients) {
        const docRef = await addDoc(patientsRef, {
          ...patient,
          birthDate: Timestamp.fromDate(patient.birthDate),
        });
        patients.push({ id: docRef.id, ...patient });
      }
    } else {
      // Use existing patients
      patients = patientsSnapshot.docs.map(doc => {
        const data = doc.data() as {
          name: string;
          email: string;
          phone: string;
          birthDate: Timestamp;
        };
        return {
          id: doc.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          birthDate: data.birthDate?.toDate() || new Date(),
        } as Patient;
      });
    }

    // Generate appointments
    console.log('Generating sample appointments...');
    const appointmentsRef = collection(db, 'appointments');

    // Check for existing appointments first
    const existingAppointmentsQuery = query(
      appointmentsRef,
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate))
    );
    const existingAppointmentsSnapshot = await getDocs(existingAppointmentsQuery);

    if (existingAppointmentsSnapshot.size >= numAppointments) {
      console.log(`Already have ${existingAppointmentsSnapshot.size} appointments in the date range.`);
      return;
    }

    const appointmentsToCreate = numAppointments - existingAppointmentsSnapshot.size;
    console.log(`Creating ${appointmentsToCreate} new sample appointments...`);

    const appointmentTypes: ('consultation' | 'followUp' | 'examination')[] = ['consultation', 'followUp', 'examination'];
    const appointmentStatuses: ('scheduled' | 'confirmed' | 'canceled' | 'completed' | 'missed')[] = [
      'scheduled', 'confirmed', 'canceled', 'completed', 'missed'
    ];

    // Distribution weights (higher weight = more common)
    const statusWeights = {
      scheduled: 4,
      confirmed: 3,
      completed: 2,
      canceled: 1,
      missed: 1,
    };

    // Flatten the array based on weights
    const weightedStatuses: ('scheduled' | 'confirmed' | 'canceled' | 'completed' | 'missed')[] = [];
    appointmentStatuses.forEach(status => {
      for (let i = 0; i < statusWeights[status]; i++) {
        weightedStatuses.push(status);
      }
    });

    for (let i = 0; i < appointmentsToCreate; i++) {
      const randomPatient = getRandomItem(patients);
      const randomDoctor = getRandomItem(doctors);
      const randomDate = getRandomDate(startDate, endDate);
      const appointmentDate = getRandomTime(randomDate);
      
      const appointment: SampleAppointment = {
        patientId: randomPatient.id,
        patientName: randomPatient.name,
        doctorId: randomDoctor.id,
        doctorName: randomDoctor.name,
        date: Timestamp.fromDate(appointmentDate),
        type: getRandomItem(appointmentTypes),
        status: getRandomItem(weightedStatuses),
        notes: Math.random() > 0.3 ? getRandomItem(sampleNotes) : undefined,
        symptoms: Math.random() > 0.5 ? getRandomItem(sampleSymptoms) : undefined,
        createdAt: Timestamp.fromDate(new Date(appointmentDate.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 7)), // 0-7 days before appointment
      };

      await addDoc(appointmentsRef, appointment);
    }

    console.log('Sample data generation complete!');
    return true;
  } catch (error) {
    console.error('Error generating sample data:', error);
    return false;
  }
};
