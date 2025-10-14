import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
  typescript: true,
});

export const STRIPE_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    analysesPerMonth: 10,
    features: [
      '10 price analyses per month',
      'Basic competitor data',
      'Pricing recommendations',
      'Profit projections'
    ]
  },
  PREMIUM: {
    name: 'Premium',
    priceId: process.env.STRIPE_PRICE_ID || 'price_premium',
    price: 1.00,
    analysesPerMonth: -1, // Unlimited
    features: [
      'Unlimited price analyses',
      'Advanced competitor insights',
      'Historical analysis tracking',
      'Export reports',
      'Priority support'
    ]
  }
};
