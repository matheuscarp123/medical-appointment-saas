import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, Timestamp, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import api from './api';
import { NotificationType, Notification } from '../types/entities';

const notificationsRef = collection(db, 'notifications');

export const createNotification = async (notification: Omit<Notification, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notification,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    throw new Error('Falha ao criar notificação. Por favor, tente novamente.');
  }
};

export const markAsRead = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'notifications', id);
    await updateDoc(docRef, {
      read: true
    });
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    throw new Error('Falha ao marcar notificação como lida. Por favor, tente novamente.');
  }
};

export const markAllAsRead = async (userId: string): Promise<void> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    const querySnapshot = await getDocs(q);
    
    const batch = db.batch();
    querySnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Erro ao marcar todas as notificações como lidas:', error);
    throw new Error('Falha ao marcar notificações como lidas. Por favor, tente novamente.');
  }
};

export const deleteNotification = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'notifications', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Erro ao deletar notificação:', error);
    throw new Error('Falha ao deletar notificação. Por favor, tente novamente.');
  }
};

export const getNotification = async (id: string): Promise<Notification | null> => {
  try {
    const docRef = doc(db, 'notifications', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Notification;
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar notificação:', error);
    throw new Error('Falha ao buscar notificação. Por favor, tente novamente.');
  }
};

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Notification[];
  } catch (error) {
    console.error('Erro ao buscar notificações do usuário:', error);
    throw new Error('Falha ao buscar notificações. Por favor, tente novamente.');
  }
};

export const getUnreadNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const q = query(notificationsRef, where('userId', '==', userId), where('read', '==', false));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Notification));
  } catch (error) {
    console.error('Error getting unread notifications:', error);
    throw error;
  }
};

export const getNotifications = async (params?: {
  userId?: string;
  type?: NotificationType;
  read?: boolean;
  page?: number;
  limit?: number;
}) => {
  const response = await api.get('/notifications', { params });
  return response.data;
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, { read: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.put('/notifications/read-all');
  return response.data;
};

export const deleteNotificationApi = async (id: string) => {
  await api.delete(`/notifications/${id}`);
};

export const subscribeToNotifications = async (subscription: PushSubscription) => {
  const response = await api.post('/notifications/subscribe', subscription);
  return response.data;
};

export const unsubscribeFromNotifications = async () => {
  await api.post('/notifications/unsubscribe');
};

export const sendAppointmentReminder = async (appointmentId: string) => {
  const response = await api.post(`/notifications/appointment-reminder/${appointmentId}`);
  return response.data;
};

export const sendAppointmentConfirmation = async (appointmentId: string) => {
  const response = await api.post(`/notifications/appointment-confirmation/${appointmentId}`);
  return response.data;
};

export const sendExamResult = async (patientId: string, examId: string) => {
  const response = await api.post(`/notifications/exam-result`, {
    patientId,
    examId
  });
  return response.data;
};

export const sendPrescriptionNotification = async (patientId: string, prescriptionId: string) => {
  const response = await api.post(`/notifications/prescription`, {
    patientId,
    prescriptionId
  });
  return response.data;
};

export const sendPaymentReminder = async (paymentId: string) => {
  const response = await api.post(`/notifications/payment-reminder/${paymentId}`);
  return response.data;
};

export const getNotificationPreferences = async () => {
  const response = await api.get('/notifications/preferences');
  return response.data;
};

export const updateNotificationPreferences = async (preferences: {
  email: boolean;
  push: boolean;
  sms: boolean;
  whatsapp: boolean;
  appointmentReminders: boolean;
  examResults: boolean;
  prescriptions: boolean;
  payments: boolean;
}) => {
  const response = await api.put('/notifications/preferences', preferences);
  return response.data;
};

export const sendNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(notificationsRef, {
      ...notification,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

export const sendAppointmentNotification = async (
  userId: string,
  appointmentId: string,
  status: 'created' | 'updated' | 'cancelled' | 'reminder'
): Promise<string> => {
  const messages = {
    created: 'Your appointment has been scheduled successfully.',
    updated: 'Your appointment has been updated.',
    cancelled: 'Your appointment has been cancelled.',
    reminder: 'You have an upcoming appointment in 24 hours.'
  };

  return sendNotification({
    userId,
    type: 'appointment',
    title: 'Appointment Update',
    message: messages[status],
    data: { appointmentId },
    read: false
  });
};