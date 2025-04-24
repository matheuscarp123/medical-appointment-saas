import { collection, getDocs, query, where, Timestamp, addDoc, getDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  getAppointments,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  createAppointment,
  checkDoctorAvailability
} from './appointmentService';

// Mocks do Firebase
jest.mock('firebase/firestore');
jest.mock('../config/firebase', () => ({
  db: {},
}));

describe('appointmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAppointments', () => {
    it('deve buscar todas as consultas', async () => {
      // Configurar mocks
      const mockDocs = [
        {
          id: 'appointment1',
          data: () => ({
            medicoId: 'doctor1',
            pacienteId: 'patient1',
            dataHora: { toDate: () => new Date() },
            createdAt: { toDate: () => new Date() },
            updatedAt: { toDate: () => new Date() }
          })
        },
        {
          id: 'appointment2',
          data: () => ({
            medicoId: 'doctor2',
            pacienteId: 'patient2',
            dataHora: { toDate: () => new Date() },
            createdAt: { toDate: () => new Date() },
            updatedAt: { toDate: () => new Date() }
          })
        }
      ];

      const mockSnapshot = {
        docs: mockDocs,
      };

      (collection as jest.Mock).mockReturnValue('appointmentsRef');
      (query as jest.Mock).mockReturnValue('query');
      (getDocs as jest.Mock).mockResolvedValue(mockSnapshot);

      // Executar o serviço
      const result = await getAppointments();

      // Verificar resultado
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('appointment1');
      expect(result[1].id).toBe('appointment2');

      // Verificar chamadas de função
      expect(collection).toHaveBeenCalledWith(db, 'appointments');
      expect(query).toHaveBeenCalled();
      expect(getDocs).toHaveBeenCalledWith('query');
    });

    it('deve lidar com erros', async () => {
      (collection as jest.Mock).mockReturnValue('appointmentsRef');
      (query as jest.Mock).mockReturnValue('query');
      (getDocs as jest.Mock).mockRejectedValue(new Error('Erro ao buscar dados'));

      await expect(getAppointments()).rejects.toThrow('Falha ao carregar consultas');
    });
  });

  describe('getAppointmentsByPatient', () => {
    it('deve buscar consultas por paciente', async () => {
      const patientId = 'patient1';
      const mockDocs = [
        {
          id: 'appointment1',
          data: () => ({
            medicoId: 'doctor1',
            pacienteId: patientId,
            dataHora: { toDate: () => new Date() },
            createdAt: { toDate: () => new Date() },
            updatedAt: { toDate: () => new Date() }
          })
        }
      ];

      const mockSnapshot = {
        docs: mockDocs,
      };

      (collection as jest.Mock).mockReturnValue('appointmentsRef');
      (query as jest.Mock).mockReturnValue('query');
      (where as jest.Mock).mockReturnValue('whereClause');
      (getDocs as jest.Mock).mockResolvedValue(mockSnapshot);

      const result = await getAppointmentsByPatient(patientId);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('appointment1');
      expect(result[0].pacienteId).toBe(patientId);

      expect(collection).toHaveBeenCalledWith(db, 'appointments');
      expect(where).toHaveBeenCalledWith('pacienteId', '==', patientId);
      expect(query).toHaveBeenCalled();
      expect(getDocs).toHaveBeenCalledWith('query');
    });
  });

  describe('getAppointmentsByDoctor', () => {
    it('deve buscar consultas por médico', async () => {
      const doctorId = 'doctor1';
      const mockDocs = [
        {
          id: 'appointment1',
          data: () => ({
            medicoId: doctorId,
            pacienteId: 'patient1',
            dataHora: { toDate: () => new Date() },
            createdAt: { toDate: () => new Date() },
            updatedAt: { toDate: () => new Date() }
          })
        }
      ];

      const mockSnapshot = {
        docs: mockDocs,
      };

      (collection as jest.Mock).mockReturnValue('appointmentsRef');
      (query as jest.Mock).mockReturnValue('query');
      (where as jest.Mock).mockReturnValue('whereClause');
      (getDocs as jest.Mock).mockResolvedValue(mockSnapshot);

      const result = await getAppointmentsByDoctor(doctorId);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('appointment1');
      expect(result[0].medicoId).toBe(doctorId);

      expect(collection).toHaveBeenCalledWith(db, 'appointments');
      expect(where).toHaveBeenCalledWith('medicoId', '==', doctorId);
      expect(query).toHaveBeenCalled();
      expect(getDocs).toHaveBeenCalledWith('query');
    });
  });

  describe('createAppointment', () => {
    it('deve criar uma nova consulta', async () => {
      const mockAppointment = {
        medicoId: 'doctor1',
        pacienteId: 'patient1',
        dataHora: new Date(),
        tipo: 'consultation',
        observacoes: 'Consulta de rotina',
        status: 'agendado'
      };

      const mockDocRef = {
        id: 'newAppointmentId'
      };

      const mockDocSnapshot = {
        id: 'newAppointmentId',
        exists: () => true,
        data: () => ({
          ...mockAppointment,
          dataHora: { toDate: () => mockAppointment.dataHora },
          createdAt: { toDate: () => new Date() },
          updatedAt: { toDate: () => new Date() }
        })
      };

      (collection as jest.Mock).mockReturnValue('appointmentsRef');
      (query as jest.Mock).mockReturnValue('query');
      (where as jest.Mock).mockReturnValue('whereClause');
      (getDocs as jest.Mock).mockResolvedValue({ docs: [] });
      (addDoc as jest.Mock).mockResolvedValue(mockDocRef);
      (doc as jest.Mock).mockReturnValue('docRef');
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnapshot);

      // @ts-ignore - Ignorando verificação de tipo para o teste
      const result = await createAppointment(mockAppointment);

      expect(result.id).toBe('newAppointmentId');
      expect(addDoc).toHaveBeenCalled();
    });
  });

  describe('checkDoctorAvailability', () => {
    it('deve retornar slots disponíveis', async () => {
      const doctorId = 'doctor1';
      const date = new Date(2023, 5, 15); // 15 de junho de 2023

      const mockDocs = [
        {
          id: 'appointment1',
          data: () => ({
            medicoId: doctorId,
            dataHora: { toDate: () => new Date(2023, 5, 15, 10, 0) } // 15 de junho de 2023, 10:00
          })
        }
      ];

      const mockSnapshot = {
        docs: mockDocs,
      };

      (collection as jest.Mock).mockReturnValue('appointmentsRef');
      (query as jest.Mock).mockReturnValue('query');
      (where as jest.Mock).mockReturnValue('whereClause');
      (getDocs as jest.Mock).mockResolvedValue(mockSnapshot);
      (Timestamp.fromDate as jest.Mock).mockReturnValue('timestamp');

      const result = await checkDoctorAvailability(doctorId, date);

      expect(result.available).toBe(true);
      expect(Array.isArray(result.slots)).toBe(true);
      
      // Deve excluir o slot já agendado (10:00)
      const slot10am = result.slots.find(slot => 
        slot.getHours() === 10 && slot.getMinutes() === 0
      );
      expect(slot10am).toBeUndefined();

      expect(collection).toHaveBeenCalledWith(db, 'appointments');
      expect(query).toHaveBeenCalled();
      expect(where).toHaveBeenCalledWith('medicoId', '==', doctorId);
      expect(getDocs).toHaveBeenCalledWith('query');
    });
  });
}); 