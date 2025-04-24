import { supabase } from './supabase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    document.body.appendChild(script);
  });
};

export const initializePayment = async (amount: number, planId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Call your backend to create order
    const response = await fetch(`${import.meta.env.VITE_API_URL}/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        userId: user.id,
        planId,
      }),
    });

    const { orderId } = await response.json();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      name: 'BrandBolt',
      description: 'Subscription Payment',
      order_id: orderId,
      handler: async (response: any) => {
        // Verify payment with backend
        const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/verify-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            userId: user.id,
            planId,
          }),
        });

        const verification = await verifyResponse.json();
        
        if (verification.success) {
          // Update subscription in Supabase
          const currentPeriodEnd = new Date();
          currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

          await supabase
            .from('subscriptions')
            .upsert({
              user_id: user.id,
              plan_id: planId,
              status: 'active',
              current_period_end: currentPeriodEnd.toISOString(),
            }, {
              onConflict: 'user_id'
            });
        }

        return verification;
      },
      prefill: {
        email: user.email,
      },
      theme: {
        color: '#2563EB',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    
  } catch (error) {
    console.error('Payment initialization failed:', error);
    throw error;
  }
};