import express from 'express';
import { getProfile, updateProfile } from '../services/profile.service';
import { ApiErrorHandler } from '../middlewares/error.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @route   GET /api/profile
 * @desc    Obter perfil do usuário autenticado
 * @access  Private
 * @returns { status, data: { profile } }
 * @example
 * {
 *   "status": "success",
 *   "data": {
 *     "profile": { "uid": "abc123", "name": "João Silva", "email": "joao@email.com" }
 *   }
 * }
 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { uid } = req.user!;
    const profile = await getProfile(uid);
    res.status(200).json({
      status: 'success',
      data: { profile }
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * @route   PUT /api/profile
 * @desc    Atualizar perfil do usuário autenticado
 * @access  Private
 * @body    { name, phone, ... }
 * @returns { status, message, data: { profile } }
 * @example
 * {
 *   "name": "João Silva",
 *   "phone": "11999999999"
 * }
 */
router.put('/', authMiddleware, async (req, res, next) => {
  try {
    const { uid } = req.user!;
    const profileData = req.body;

    // Remover campos que não devem ser atualizados pelo usuário
    delete profileData.role;
    delete profileData.status;
    delete profileData.createdAt;

    const updatedProfile = await updateProfile(uid, profileData);
    res.status(200).json({
      status: 'success',
      message: 'Perfil atualizado com sucesso',
      data: { profile: updatedProfile }
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * @route   PUT /api/profile/notification-settings
 * @desc    Atualizar configurações de notificação
 * @access  Private
 * @body    { notificationSettings }
 * @returns { status, message, data: { notificationSettings } }
 * @example
 * {
 *   "notificationSettings": { "email": true, "sms": false }
 * }
 */
router.put('/notification-settings', authMiddleware, async (req, res, next) => {
  try {
    const { uid } = req.user!;
    const { notificationSettings } = req.body;

    if (!notificationSettings) {
      throw new ApiErrorHandler(
        'Configurações de notificação não fornecidas',
        400,
        'INVALID_DATA'
      );
    }

    const updatedProfile = await updateProfile(uid, { notificationSettings });

    res.status(200).json({
      status: 'success',
      message: 'Configurações de notificação atualizadas com sucesso',
      data: {
        notificationSettings: updatedProfile.notificationSettings
      }
    });
  } catch (error: any) {
    next(error);
  }
});

export default router;