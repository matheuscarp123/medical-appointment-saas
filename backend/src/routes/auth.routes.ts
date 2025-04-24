import express from 'express';
import Joi from 'joi';
import { adminAuth } from '../config/firebase-admin';
import { createUser, getUserByEmail } from '../services/user.service';
import { ApiErrorHandler } from '../middlewares/error.middleware';

const router = express.Router();

// Esquemas de validação Joi
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).required(),
  role: Joi.string().valid('admin', 'doctor', 'patient').default('patient')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const resetSchema = Joi.object({
  email: Joi.string().email().required()
});

/**
 * @route   POST /api/auth/register
 * @desc    Registrar um novo usuário
 * @access  Public
 * @body    { email, password, name, role }
 * @returns { status, message, data: { user } }
 * @example
 * {
 *   "email": "exemplo@email.com",
 *   "password": "123456",
 *   "name": "Maria Silva",
 *   "role": "doctor"
 * }
 */
router.post('/register', async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) throw ApiErrorHandler.badRequest(error.details[0].message);
    const { email, password, name, role } = value;

    // Verifica se já existe usuário
    try {
      await getUserByEmail(email);
      throw ApiErrorHandler.conflict('Já existe um usuário com este e-mail.');
    } catch (err: any) {
      if (err.code !== 'USER_NOT_FOUND') throw err;
    }

    // Criar usuário no Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    await adminAuth.setCustomUserClaims(userRecord.uid, { role });
    const newUser = await createUser({
      id: userRecord.uid,
      email,
      name,
      role,
    });

    res.status(201).json({
      status: 'success',
      message: 'Usuário registrado com sucesso',
      data: { user: newUser }
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuário
 * @access  Public
 * @body    { email, password }
 * @returns { status, message, data: { user } }
 * @example
 * {
 *   "email": "exemplo@email.com",
 *   "password": "123456"
 * }
 */
router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) throw ApiErrorHandler.badRequest(error.details[0].message);
    const { email } = value;
    // Verificar se o usuário existe no Firestore
    const user = await getUserByEmail(email);
    // O token JWT é gerado pelo Firebase Auth no frontend
    res.status(200).json({
      status: 'success',
      message: 'Login realizado com sucesso',
      data: { user }
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout de usuário
 * @access  Public
 */
router.post('/logout', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logout realizado com sucesso'
  });
});

/**
 * @route   POST /api/auth/reset-password
 * @desc    Enviar e-mail de redefinição de senha
 * @access  Public
 * @body    { email }
 * @returns { status, message }
 * @example
 * {
 *   "email": "exemplo@email.com"
 * }
 */
router.post('/reset-password', async (req, res, next) => {
  try {
    const { error, value } = resetSchema.validate(req.body);
    if (error) throw ApiErrorHandler.badRequest(error.details[0].message);
    const { email } = value;
    await adminAuth.generatePasswordResetLink(email);
    res.status(200).json({
      status: 'success',
      message: 'E-mail de redefinição de senha enviado com sucesso.'
    });
  } catch (error: any) {
    next(error);
  }
});

export default router;