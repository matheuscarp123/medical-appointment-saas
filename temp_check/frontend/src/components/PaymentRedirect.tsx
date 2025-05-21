import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createPaymentLink } from '../firebase';

const PaymentRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToPayment = async () => {
      const user = auth.currentUser;
      
      if (!user) {
        navigate('/');
        return;
      }

      try {
        const paymentLink = await createPaymentLink();
        window.location.href = paymentLink;
      } catch (error) {
        console.error('Error creating payment link:', error);
        navigate('/');
      }
    };

    redirectToPayment();
  }, [navigate]);

  return null;
};

export default PaymentRedirect;
