import express from 'express';
import Joi from 'joi';
import { createDoctor, getDoctorById, getDoctors, updateDoctor, deleteDoctor, searchDoctors, getAllDoctors } from '../services/doctor.service';
import { ApiErrorHandler } from '../middlewares/error.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Validação Joi
const doctorSchema = Joi.object({
  specialization: Joi.string().min(2).required(),
  bio: Joi.string().allow(''),
  phone: Joi.string().allow(''),
  acceptingNewPatients: Joi.boolean().default(true),
  appointmentDuration: Joi.number().integer().min(10).max(180).default(30)
});

/**
 * @route   POST /api/doctors
 * @desc    Criar um novo perfil de médico
 * @access  Private
 * @body    { specialization, bio, phone, acceptingNewPatients, appointmentDuration }
 * @returns { status, message, data: { doctor } }
 * @example
 * {
 *   "specialization": "Cardiologia",
 *   "bio": "Especialista em cardiologia clínica.",
 *   "phone": "11999999999",
 *   "acceptingNewPatients": true,
 *   "appointmentDuration": 30
 * }
 */
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = doctorSchema.validate(req.body);
    if (error) throw ApiErrorHandler.badRequest(error.details[0].message);
    const { uid } = req.user!;
    const newDoctor = await createDoctor(value, uid);
    res.status(201).json({
      status: 'success',
      message: 'Perfil de médico criado com sucesso',
      data: { doctor: newDoctor }
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * @route   GET /api/doctors
 * @desc    Obter todos os médicos ou buscar por nome/especialidade
 * @access  Private
 * @query   ?q=nome-ou-especialidade
 * @returns { status, results, data: { doctors } }
 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { q, specialization } = req.query;
    let doctors;
    if (q) {
      doctors = await searchDoctors(String(q));
    } else if (specialization) {
      doctors = await getAllDoctors(String(specialization));
    } else {
      doctors = await getDoctors();
    }
    res.status(200).json({
      status: 'success',
      results: doctors.length,
      data: { doctors }
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * @route   GET /api/doctors/:id
 * @desc    Obter um médico pelo ID
 * @access  Private
 * @returns { status, data: { doctor } }
 */
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await getDoctorById(id);
    res.status(200).json({
      status: 'success',
      data: { doctor }
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * @route   PUT /api/doctors/:id
 * @desc    Atualizar um médico
 * @access  Private
 * @body    { specialization, bio, phone, acceptingNewPatients, appointmentDuration }
 * @returns { status, message, data: { doctor } }
 */
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = doctorSchema.validate(req.body);
    if (error) throw ApiErrorHandler.badRequest(error.details[0].message);
    const { id } = req.params;
    const updatedDoctor = await updateDoctor(id, value);
    res.status(200).json({
      status: 'success',
      message: 'Perfil de médico atualizado com sucesso',
      data: { doctor: updatedDoctor }
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * @route   DELETE /api/doctors/:id
 * @desc    Excluir um médico
 * @access  Private
 * @returns { status, message }
 */
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteDoctor(id);
    res.status(200).json({
      status: 'success',
      message: 'Perfil de médico excluído com sucesso'
    });
  } catch (error: any) {
    next(error);
  }
});

export default router;