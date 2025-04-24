import express from 'express';
import Joi from 'joi';
import { 
  createAppointment, 
  getAppointmentById, 
  getAppointments, 
  updateAppointment, 
  deleteAppointment,
  getDoctorAppointments
} from '../services/appointment.service';
import { ApiErrorHandler } from '../middlewares/error.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Validação Joi para novo agendamento
const appointmentSchema = Joi.object({
  doctorId: Joi.string().required(),
  patientId: Joi.string().required(),
  date: Joi.string().isoDate().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  reason: Joi.string().allow(''),
  notes: Joi.string().allow(''),
  paymentAmount: Joi.number().optional()
});

/**
 * @route   POST /api/appointments
 * @desc    Criar um novo agendamento
 * @access  Private
 * @body    { doctorId, patientId, date, startTime, endTime, reason, notes, paymentAmount }
 * @returns { status, message, data: { appointment } }
 * @example
 * {
 *   "doctorId": "abc123",
 *   "patientId": "xyz789",
 *   "date": "2025-04-16",
 *   "startTime": "14:00",
 *   "endTime": "14:30",
 *   "reason": "Consulta de rotina",
 *   "notes": "Paciente com histórico de pressão alta",
 *   "paymentAmount": 150
 * }
 */
/**
 * @route   POST /api/appointments
 * @desc    Criar um novo agendamento
 * @access  Private
 * @body    { doctorId, patientId, date, startTime, endTime, reason, notes, paymentAmount }
 * @returns { status, message, data: { appointment } }
 * @example
 * {
 *   "doctorId": "abc123",
 *   "patientId": "xyz789",
 *   "date": "2025-04-16",
 *   "startTime": "14:00",
 *   "endTime": "14:30",
 *   "reason": "Consulta de rotina",
 *   "notes": "Paciente com histórico de pressão alta",
 *   "paymentAmount": 150
 * }
 */
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = appointmentSchema.validate(req.body);
    if (error) throw ApiErrorHandler.badRequest(error.details[0].message);
    const { companyId } = req.user!;
    const newAppointment = await createAppointment(value, companyId);
    res.status(201).json({
      status: 'success',
      message: 'Agendamento criado com sucesso',
      data: { appointment: newAppointment }
    });
  } catch (error: any) {
    // Retorne erro detalhado para o frontend tratar corretamente
    if (error instanceof ApiErrorHandler) {
      return res.status(error.statusCode || 400).json({
        status: 'error',
        message: error.message,
        code: error.code || 'APPOINTMENT_ERROR',
        errors: error.errors || null
      });
    }
    next(error);
  }
});

/**
 * @route   GET /api/appointments
 * @desc    Obter todos os agendamentos
 * @access  Private
 */
/**
 * @route   GET /api/appointments
 * @desc    Obter todos os agendamentos da empresa
 * @access  Private
 * @query   ?doctorId=abc123&patientId=xyz789
 * @returns { status, results, data: { appointments } }
 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { companyId } = req.user!;
    const { doctorId, patientId } = req.query;
    let appointments;
    if (doctorId) {
      appointments = await getDoctorAppointments(String(doctorId), companyId);
    } else if (patientId) {
      appointments = await getPatientAppointments(String(patientId), companyId);
    } else {
      appointments = await getAppointments(companyId);
    }
    res.status(200).json({
      status: 'success',
      results: appointments.length,
      data: { appointments }
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * @route   GET /api/appointments/doctor/:doctorId
 * @desc    Obter agendamentos de um médico específico
 * @access  Private
 */
// OBSOLETO: usar GET /api/appointments?doctorId=abc123


/**
 * @route   GET /api/appointments/:id
 * @desc    Obter um agendamento pelo ID
 * @access  Private
 */
/**
 * @route   GET /api/appointments/:id
 * @desc    Obter um agendamento pelo ID
 * @access  Private
 * @returns { status, data: { appointment } }
 */
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user!;
    const appointment = await getAppointmentById(id, companyId);
    res.status(200).json({
      status: 'success',
      data: { appointment }
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * @route   GET /api/appointments/:id/full
 * @desc    Obter agendamento + dados completos de paciente e médico
 * @access  Private
 * @returns { status, data: { appointment, patient, doctor } }
 * @example
 * {
 *   "status": "success",
 *   "data": {
 *     "appointment": { ... },
 *     "patient": { ... },
 *     "doctor": { ... }
 *   }
 * }
 */
router.get('/:id/full', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user!;
    const appointment = await getAppointmentById(id, companyId);
    if (!appointment) return res.status(404).json({ status: 'error', message: 'Agendamento não encontrado' });
    // Buscar paciente e médico
    const patientRef = require('../services/patient.service');
    const doctorRef = require('../services/doctor.service');
    const [patient, doctor] = await Promise.all([
      patientRef.getPatientById(appointment.patientId, companyId),
      doctorRef.getDoctorById(appointment.doctorId, companyId)
    ]);
    res.status(200).json({
      status: 'success',
      data: { appointment, patient, doctor }
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * @route   PUT /api/appointments/:id
 * @desc    Atualizar um agendamento
 * @access  Private
 */
/**
 * @route   PUT /api/appointments/:id
 * @desc    Atualizar um agendamento
 * @access  Private
 * @body    { ...campos editáveis }
 * @returns { status, message, data: { appointment } }
 */
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointmentData = req.body;
    const { companyId } = req.user!;
    const updatedAppointment = await updateAppointment(id, appointmentData, companyId);
    res.status(200).json({
      status: 'success',
      message: 'Agendamento atualizado com sucesso',
      data: { appointment: updatedAppointment }
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * @route   DELETE /api/appointments/:id
 * @desc    Excluir um agendamento
 * @access  Private
 */
/**
 * @route   DELETE /api/appointments/:id
 * @desc    Excluir um agendamento
 * @access  Private
 * @returns { status, message }
 */
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user!;
    await deleteAppointment(id, companyId);
    res.status(200).json({
      status: 'success',
      message: 'Agendamento excluído com sucesso'
    });
  } catch (error: any) {
    next(error);
  }
});

export default router;