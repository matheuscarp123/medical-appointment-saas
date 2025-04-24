import api from './api';
import { Payment } from '../types/entities';

export const getPayments = async (params?: {
  patientId?: string;
  appointmentId?: string;
  status?: Payment['status'];
  method?: Payment['method'];
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}) => {
  const response = await api.get('/payments', { params });
  return response.data;
};

export const getPaymentById = async (id: string) => {
  const response = await api.get(`/payments/${id}`);
  return response.data;
};

export const createPayment = async (data: Partial<Payment>) => {
  const response = await api.post('/payments', data);
  return response.data;
};

export const updatePayment = async (id: string, data: Partial<Payment>) => {
  const response = await api.put(`/payments/${id}`, data);
  return response.data;
};

export const deletePayment = async (id: string) => {
  await api.delete(`/payments/${id}`);
};

export const processPayment = async (id: string, paymentMethod: {
  type: Payment['method'];
  cardNumber?: string;
  cardHolder?: string;
  cardExpiry?: string;
  cardCvv?: string;
  installments?: number;
}) => {
  const response = await api.post(`/payments/${id}/process`, paymentMethod);
  return response.data;
};

export const refundPayment = async (id: string, reason?: string) => {
  const response = await api.post(`/payments/${id}/refund`, { reason });
  return response.data;
};

export const getPaymentReceipt = async (id: string) => {
  const response = await api.get(`/payments/${id}/receipt`);
  return response.data;
};

export const getPatientPaymentHistory = async (patientId: string) => {
  const response = await api.get(`/payments/patient/${patientId}/history`);
  return response.data;
};

export const getDoctorPayments = async (doctorId: string, params?: {
  startDate?: Date;
  endDate?: Date;
  status?: Payment['status'];
}) => {
  const response = await api.get(`/payments/doctor/${doctorId}`, { params });
  return response.data;
};

export const generatePaymentReport = async (params: {
  startDate: Date;
  endDate: Date;
  type?: 'daily' | 'weekly' | 'monthly';
  doctorId?: string;
  method?: Payment['method'];
}) => {
  const response = await api.get('/payments/report', { params });
  return response.data;
};

export const getPaymentSettings = async () => {
  const response = await api.get('/payments/settings');
  return response.data;
};

export const updatePaymentSettings = async (settings: {
  acceptedMethods: Payment['method'][];
  maxInstallments: number;
  minInstallmentValue: number;
  automaticConfirmation: boolean;
  sendReceipts: boolean;
}) => {
  const response = await api.put('/payments/settings', settings);
  return response.data;
};