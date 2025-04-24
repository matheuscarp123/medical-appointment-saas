import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { adminFirestore } from './config/firebase-admin';

// Rotas
import authRoutes from './routes/auth.routes';
import doctorRoutes from './routes/doctor.routes';
import patientRoutes from './routes/patient.routes';
import appointmentRoutes from './routes/appointment.routes';
import dashboardRoutes from './routes/dashboard.routes';
import profileRoutes from './routes/profile.routes';

// Middlewares
import { errorHandler } from './middlewares/error.middleware';
import { authMiddleware } from './middlewares/auth.middleware';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Verificar conexão com Firestore
adminFirestore
  .collection('system_status')
  .doc('server')
  .set({
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
  .then(() => console.log('Firestore conectado com sucesso'))
  .catch((error) => console.error('Erro ao conectar ao Firestore:', error));

// Rotas públicas
app.use('/api/auth', authRoutes);

// Rotas protegidas
app.use('/api/doctors', authMiddleware, doctorRoutes);
app.use('/api/patients', authMiddleware, patientRoutes);
app.use('/api/appointments', authMiddleware, appointmentRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/profile', authMiddleware, profileRoutes);

// Rota de status
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API MediFlow está operando normalmente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`⚡️ Servidor rodando na porta ${PORT}`);
  console.log(`🔗 Acesse: http://localhost:${PORT}/api/status`);
});

export default app;
