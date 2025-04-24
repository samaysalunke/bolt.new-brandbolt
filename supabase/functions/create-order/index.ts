import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Razorpay from 'npm:razorpay';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const razorpay = new Razorpay({
  key_id: Deno.env.get('RAZORPAY_KEY_ID'),
  key_secret: Deno.env.get('RAZORPAY_KEY_SECRET'),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, userId, planId } = await req.json();

    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `order_${userId}_${Date.now()}`,
      notes: {
        userId,
        planId,
      },
    });

    return new Response(
      JSON.stringify({ orderId: order.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});