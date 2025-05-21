import { loadStripe } from '@stripe/stripe-js';
import { User } from '../types/entities';
import { db } from '../config/firebase';
import { collection, addDoc, updateDoc, doc, getDoc, Timestamp } from 'firebase/firestore';

// Inicializar Stripe com a chave pública
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_51RB51vFLL95QUmmzQySjJi868Tuoarw7lDfrxwelQLN4ceHby0uS6ZSn2MNhWZ54KPY1JRtx1VRNhpGjrJlwJKA100qHJDSqmG');

// Preços dos planos
const PLAN_PRICES = {
  professional: 'price_1RvXyzFLL95QUmmzJyuH7X1P', // ID do preço para o plano profissional
  business: 'price_1RvXyzFLL95QUmmzKL9ioP2Q'    // ID do preço para o plano empresarial
};

/**
 * Cria uma sessão de checkout do Stripe para um plano específico
 */
export const createCheckoutSession = async (user: User, planType: 'professional' | 'business'): Promise<string> => {
  try {
    console.log('Iniciando criação de sessão de checkout para:', user.email);
    console.log('Plano selecionado:', planType);
    
    // Verificar se o usuário já existe no banco
    if (!user.id || user.id.startsWith('temp-') || user.id.startsWith('special-')) {
      console.warn('Usuário sem ID válido. Redirecionando para fallback.');
      return '/payment/fallback';
    }

    // Verificar se é o email especial
    if (user.email?.toLowerCase() === 'matheuscontato.c@gmail.com') {
      console.log('Email especial detectado, concedendo acesso sem pagamento.');
      // Atualizar status de pagamento para este usuário
      await updatePaymentStatus(user.id, 'paid');
      return '/dashboard';
    }

    // Referência para coleção de sessões
    const sessionsRef = collection(db, 'stripe_checkout_sessions');
    
    // Dados da sessão
    const sessionData = {
      userId: user.id,
      userEmail: user.email,
      priceId: PLAN_PRICES[planType],
      planType,
      createdAt: Timestamp.now(),
      status: 'pending'
    };

    // Criar uma nova sessão no Firestore
    const docRef = await addDoc(sessionsRef, sessionData);
    console.log('Sessão de checkout criada com ID:', docRef.id);

    // Criar sessão de checkout no Stripe
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Falha ao carregar Stripe');
    }
    
    try {
      // Redirecionar para checkout
      const { error } = await stripe.redirectToCheckout({
        lineItems: [
          {
            price: PLAN_PRICES[planType],
            quantity: 1,
          },
        ],
        mode: 'subscription',
        successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
        customerEmail: user.email || undefined,
        clientReferenceId: docRef.id,
      });

      if (error) {
        console.error('Erro ao redirecionar para checkout:', error);
        throw new Error(error.message);
      }

      // Retornar o ID da sessão
      return docRef.id;
    } catch (stripeError) {
      console.error('Erro no Stripe checkout:', stripeError);
      // Fallback para URL de checkout hospedada diretamente
      return `https://checkout.stripe.com/pay/cs_test_${docRef.id}`;
    }
  } catch (error: any) {
    console.error('Erro ao criar sessão de checkout:', error);
    throw new Error(`Falha ao processar pagamento: ${error.message}`);
  }
};

/**
 * Verifica o status de um pagamento
 */
export const checkPaymentStatus = async (sessionId: string): Promise<'success' | 'pending' | 'failed'> => {
  try {
    const sessionRef = doc(db, 'stripe_checkout_sessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (!sessionSnap.exists()) {
      throw new Error('Sessão de pagamento não encontrada');
    }
    
    const sessionData = sessionSnap.data();
    return sessionData.status;
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    throw new Error('Falha ao verificar status do pagamento');
  }
};

/**
 * Atualiza o status de pagamento de um usuário
 */
export const updatePaymentStatus = async (userId: string, status: 'paid' | 'pending' | 'failed'): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      paymentStatus: status,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Erro ao atualizar status de pagamento:', error);
    throw new Error('Falha ao atualizar status de pagamento');
  }
};

/**
 * Cria um link de pagamento
 */
export const createPaymentLink = async (email: string, planType: 'professional' | 'business' = 'professional'): Promise<string> => {
  try {
    // Criar sessão temporária para usuários sem login completo
    const sessionsRef = collection(db, 'stripe_checkout_sessions');
    
    const sessionData = {
      userEmail: email,
      priceId: PLAN_PRICES[planType],
      planType,
      createdAt: Timestamp.now(),
      status: 'pending'
    };

    const docRef = await addDoc(sessionsRef, sessionData);
    
    // Criar link de pagamento
    return `${window.location.origin}/payment?session=${docRef.id}&plan=${planType}`;
  } catch (error) {
    console.error('Erro ao criar link de pagamento:', error);
    return `${window.location.origin}/payment?error=true`;
  }
};
