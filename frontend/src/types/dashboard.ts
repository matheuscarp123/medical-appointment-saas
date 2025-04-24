export interface AppointmentMetrics {
  total: number;
  completed: number;
  scheduled: number;
  cancelled: number;
}

export interface FinancialMetrics {
  dailyRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  averageTicket: number;
}

export interface PatientMetrics {
  total: number;
  newThisMonth: number;
  returningRate: number;
}

export interface DashboardData {
  appointments: AppointmentMetrics;
  financial: FinancialMetrics;
  patients: PatientMetrics;
  recentAppointments: Array<{
    id: string;
    patientName: string;
    doctorName: string;
    date: string;
    status: 'scheduled' | 'completed' | 'cancelled';
  }>;
  upcomingAppointments: Array<{
    id: string;
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
  }>;
} 