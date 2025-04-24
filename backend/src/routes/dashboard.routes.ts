import express from 'express';
import { adminFirestore } from '../config/firebase-admin';
import { ApiErrorHandler } from '../middlewares/error.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @route   GET /api/dashboard/stats
 * @desc    Obter estatísticas gerais do dashboard
 * @access  Private
 * @returns { status, data: { totalAppointments, totalPatients, totalDoctors, appointmentsByStatus } }
 * @example
 * {
 *   "status": "success",
 *   "data": {
 *     "totalAppointments": 120,
 *     "totalPatients": 85,
 *     "totalDoctors": 10,
 *     "appointmentsByStatus": {
 *       "scheduled": 40,
 *       "confirmed": 30,
 *       "cancelled": 10,
 *       "completed": 35,
 *       "no_show": 5
 *     }
 *   }
 * }
 */
router.get('/stats', authMiddleware, async (req, res, next) => {
  try {
    const appointmentsSnapshot = await adminFirestore.collection('appointments').get();
    const patientsSnapshot = await adminFirestore.collection('patients').get();
    const doctorsSnapshot = await adminFirestore.collection('doctors').get();
    
    // Calcular estatísticas
    const totalAppointments = appointmentsSnapshot.size;
    const totalPatients = patientsSnapshot.size;
    const totalDoctors = doctorsSnapshot.size;
    
    // Calcular consultas por status
    const appointmentsByStatus = {
      scheduled: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
      no_show: 0
    };
    
    appointmentsSnapshot.forEach(doc => {
      const appointment = doc.data();
      if (appointment.status && appointmentsByStatus.hasOwnProperty(appointment.status)) {
        appointmentsByStatus[appointment.status]++;
      }
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        totalAppointments,
        totalPatients,
        totalDoctors,
        appointmentsByStatus
      }
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * @route   GET /api/dashboard/recent-activity
 * @desc    Obter atividades recentes
 * @access  Private
 * @returns { status, data: { activities } }
 * @example
 * {
 *   "status": "success",
 *   "data": {
 *     "activities": [
 *       {
 *         "id": "appt1",
 *         "type": "appointment",
 *         "action": "created",
 *         "timestamp": "2025-04-15T10:00:00Z",
 *         "details": { "patientId": "xyz789", "doctorId": "abc123", "date": "2025-04-16", "status": "scheduled" }
 *       }
 *     ]
 *   }
 * }
 */
router.get('/recent-activity', authMiddleware, async (req, res, next) => {
  try {
    const recentAppointments = await adminFirestore
      .collection('appointments')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();
    
    const activities = recentAppointments.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        type: 'appointment',
        action: 'created',
        timestamp: data.createdAt,
        details: {
          patientId: data.patientId,
          doctorId: data.doctorId,
          date: data.date,
          status: data.status
        }
      };
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        activities
      }
    });
  } catch (error: any) {
    next(error);
  }
});

export default router;