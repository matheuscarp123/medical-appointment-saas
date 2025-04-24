import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { DashboardData } from '../types/dashboard';
import { Appointment, Payment, Patient } from '../types/entities';

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    if (!db) {
      throw new Error('Firebase não está inicializado corretamente');
    }

    console.log('Iniciando busca de dados do dashboard...');
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Fetch appointments
    console.log('Buscando consultas...');
    const appointmentsRef = collection(db, 'appointments');
    const appointmentsQuery = query(
      appointmentsRef,
      where('date', '>=', Timestamp.fromDate(startOfMonth)),
      where('date', '<=', Timestamp.fromDate(endOfMonth))
    );
    
    let appointments: Appointment[] = [];
    try {
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      appointments = appointmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];
      console.log(`Encontradas ${appointments.length} consultas`);
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
      appointments = []; // Fallback para array vazio em caso de erro
    }

    // Calculate metrics
    const completed = appointments.filter(apt => apt.status === 'completed').length;
    const scheduled = appointments.filter(apt => apt.status === 'scheduled').length;
    const cancelled = appointments.filter(apt => apt.status === 'cancelled').length;

    // Fetch financial data
    console.log('Buscando dados financeiros...');
    const paymentsRef = collection(db, 'payments');
    const paymentsQuery = query(
      paymentsRef,
      where('date', '>=', Timestamp.fromDate(startOfMonth)),
      where('date', '<=', Timestamp.fromDate(endOfMonth))
    );
    
    let payments: Payment[] = [];
    try {
      const paymentsSnapshot = await getDocs(paymentsQuery);
      payments = paymentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Payment[];
      console.log(`Encontrados ${payments.length} pagamentos`);
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      payments = []; // Fallback para array vazio em caso de erro
    }

    const monthlyRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const dailyRevenue = payments
      .filter(payment => {
        const paymentDate = payment.date.toDate();
        return paymentDate.toDateString() === now.toDateString();
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    // Fetch patients data
    console.log('Buscando dados dos pacientes...');
    const patientsRef = collection(db, 'patients');
    
    let totalPatients = 0;
    let newPatients = 0;
    
    try {
      const patientsSnapshot = await getDocs(patientsRef);
      totalPatients = patientsSnapshot.size;

      const newPatientsQuery = query(
        patientsRef,
        where('createdAt', '>=', Timestamp.fromDate(startOfMonth)),
        where('createdAt', '<=', Timestamp.fromDate(endOfMonth))
      );
      const newPatientsSnapshot = await getDocs(newPatientsQuery);
      newPatients = newPatientsSnapshot.size;
      console.log(`Total de pacientes: ${totalPatients}, Novos este mês: ${newPatients}`);
    } catch (error) {
      console.error('Erro ao buscar dados dos pacientes:', error);
      // Fallback para valores padrão em caso de erro
      totalPatients = 0;
      newPatients = 0;
    }

    // Get recent and upcoming appointments
    console.log('Processando consultas recentes e futuras...');
    const recentAppointments = appointments
      .filter(apt => apt.status === 'completed')
      .sort((a, b) => b.date.toDate() - a.date.toDate())
      .slice(0, 5)
      .map(apt => ({
        id: apt.id,
        patientName: apt.patientName,
        doctorName: apt.doctorName,
        date: apt.date.toDate().toISOString().split('T')[0],
        status: apt.status
      }));

    const upcomingAppointments = appointments
      .filter(apt => apt.status === 'scheduled' && apt.date.toDate() > now)
      .sort((a, b) => a.date.toDate() - b.date.toDate())
      .slice(0, 5)
      .map(apt => ({
        id: apt.id,
        patientName: apt.patientName,
        doctorName: apt.doctorName,
        date: apt.date.toDate().toISOString().split('T')[0],
        time: apt.date.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

    console.log('Dados do dashboard processados com sucesso');

    return {
      appointments: {
        total: appointments.length,
        completed,
        scheduled,
        cancelled
      },
      financial: {
        dailyRevenue,
        monthlyRevenue,
        pendingPayments: 0, // Implementar lógica de pagamentos pendentes
        averageTicket: monthlyRevenue / (completed || 1) // Evitar divisão por zero
      },
      patients: {
        total: totalPatients,
        newThisMonth: newPatients,
        returningRate: 0 // Implementar lógica de taxa de retorno
      },
      recentAppointments,
      upcomingAppointments
    };
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error);
    throw new Error('Falha ao carregar dados do dashboard. Por favor, verifique sua conexão e tente novamente.');
  }
}; 