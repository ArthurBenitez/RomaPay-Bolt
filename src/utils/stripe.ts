import { loadStripe } from '@stripe/stripe-js';

// Substitua pela sua chave pública do Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

export { stripePromise };

export const createPaymentIntent = async (amount: number) => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Stripe usa centavos
        currency: 'brl',
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};