import express from 'express';
import Joi from 'joi';
import { createPatient, getPatientById, getPatients, updatePatient, deletePatient, searchPatients, getAllPatients } from '../services/patient.service';
import { ApiErrorHandler } from '../middlewares/error.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Validação Joi
const patientSchema = Joi.object({
  birthDate: Joi.string().isoDate().optional(),
  gender: Joi.string().valid('male', 'female', 'other').optional(),
  phone: Joi.string().allow(''),
  insuranceInfo: Joi.object().optional(),
  medicalHistory: Joi.array().items(Joi.object()).optional()
});

/**
 * @route   POST /api/patients
 * @desc    Criar um novo perfil de paciente
 * @access  Private
 * @body    { birthDate, gender, phone, insuranceInfo, medicalHistory }
 * @returns { status, message, data: { patient } }
 * @example
 * {
 *   "birthDate": "1990-01-01",
 *   "gender": "female",
 *   "phone": "11999999999",
 *   "insuranceInfo": { "provider": "Unimed", "policyNumber": "12345" },
 *   "medicalHistory": []
 * }
 */
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = patientSchema.validate(req.body);
    if (error) throw ApiErrorHandler.badRequest(error.details[0].message);
    const { uid, companyId } = req.user!;
    const newPatient = await createPatient(value, uid, companyId);
    res.status(201).json({
      status: 'success',
      message: 'Perfil de paciente criado com sucesso',
      data: { patient: newPatient }
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * @route   GET /api/patients
 * @desc    Obter todos os pacientes ou buscar por nome/email
 * @access  Private
 * @query   ?q=nome-ou-email
 * @returns { status, results, data: { patients } }
 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { q } = req.query;
    const { companyId } = req.user!;
    let patients;
    if (q) {
      patients = await searchPatients(String(q), companyId);
    } else {
      patients = await getAllPatients(companyId);
    }
    res.status(200).json({
      status: 'success',
      results: patients.length,
      data: { patients }
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * @route   GET /api/patients/:id
 * @desc    Obter um paciente pelo ID
 * @access  Private
 * @returns { status, data: { patient } }
 */
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user!;
    const patient = await getPatientById(id, companyId);
    res.status(200).json({
      status: 'success',
      data: { patient }
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * @route   PUT /api/patients/:id
 * @desc    Atualizar um paciente
 * @access  Private
 * @body    { birthDate, gender, phone, insuranceInfo, medicalHistory }
 * @returns { status, message, data: { patient } }
 */
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = patientSchema.validate(req.body);
    if (error) throw ApiErrorHandler.badRequest(error.details[0].message);
    const { id } = req.params;
    const { companyId } = req.user!;
    const updatedPatient = await updatePatient(id, value, companyId);
    res.status(200).json({
      status: 'success',
      message: 'Perfil de paciente atualizado com sucesso',
      data: { patient: updatedPatient }
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * @route   DELETE /api/patients/:id
 * @desc    Excluir um paciente
 * @access  Private
 * @returns { status, message }
 */
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user!;
    await deletePatient(id, companyId);
    res.status(200).json({
      status: 'success',
      message: 'Perfil de paciente excluído com sucesso'
    });
  } catch (error: any) {
    next(error);
  }
});

export default router;