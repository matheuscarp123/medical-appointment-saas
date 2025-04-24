import { db } from '../config/firebase';
import { doc, updateDoc, Timestamp, collection, addDoc } from 'firebase/firestore';
import { User } from '../types/entities';

/**
 * Serviço de simulação de pagamento para quando o Stripe não está funcionando
 * Oferece uma alternativa para testes e demonstração
 */

/**
 * Simula um processamento de pagamento e retorna um resultado após um delay
 */
export const simulatePaymentProcessing = async (
  user: User,
  planType: 'professional' | 'business'
): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    // Simular um delay de processamento
    setTimeout(async () => {
      try {
        // Registrar o pagamento simulado
        await registerSimulatedPayment(user, planType);
        
        // Atualizar o status do usuário
        await updateUserPaymentStatus(user.id, 'paid');
        
        resolve({
          success: true,
          message: 'Pagamento processado com sucesso'
        });
      } catch (error) {
        console.error('Erro na simulação de pagamento:', error);
        resolve({
          success: false,
          message: 'Falha ao processar o pagamento simulado'
        });
      }
    }, 2000); // 2 segundos de delay para simular processamento
  });
};

/**
 * Registra um pagamento simulado no Firestore
 */
export const registerSimulatedPayment = async (
  user: User,
  planType: 'professional' | 'business'
): Promise<string> => {
  try {
    // Registrar na coleção de pagamentos simulados
    const paymentsRef = collection(db, 'simulated_payments');
    
    const paymentData = {
      userId: user.id,
      userEmail: user.email,
      planType,
      amount: planType === 'professional' ? 9990 : 19990, // em centavos
      currency: 'BRL',
      status: 'succeeded',
      paymentMethod: 'simulated',
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(paymentsRef, paymentData);
    console.log('Pagamento simulado registrado com ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('Erro ao registrar pagamento simulado:', error);
    throw new Error('Falha ao registrar pagamento simulado');
  }
};

/**
 * Atualiza o status de pagamento de um usuário
 */
export const updateUserPaymentStatus = async (
  userId: string,
  status: 'paid' | 'pending' | 'failed'
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      paymentStatus: status,
      subscriptionStatus: status === 'paid' ? 'active' : 'inactive',
      updatedAt: Timestamp.now()
    });
    
    console.log(`Status de pagamento do usuário ${userId} atualizado para: ${status}`);
  } catch (error) {
    console.error('Erro ao atualizar status de pagamento do usuário:', error);
    throw new Error('Falha ao atualizar status de pagamento');
  }
};

/**
 * Verifica se um usuário tem status de pagamento aprovado
 */
export const checkUserPaymentStatus = async (userId: string): Promise<boolean> => {
  try {
    // Use a função do serviço de stripe que já existe
    const { checkPaymentStatus } = await import('./stripeService');
    
    // Esta é uma implementação simplificada
    // Em um sistema real, você consultaria o banco de dados
    const status = await checkPaymentStatus(userId);
    return status === 'success';
  } catch (error) {
    console.error('Erro ao verificar status de pagamento:', error);
    return false;
  }
};
