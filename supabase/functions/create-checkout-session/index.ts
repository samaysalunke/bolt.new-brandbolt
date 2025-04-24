import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { stripe } from '../_shared/stripe.ts';
import { createClient } from 'npm:@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { priceId, userId } = await req.json();

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get user details
    const { data: { user }, error: userError } = await supabaseClient.auth.admin.getUserById(userId);

    if (userError || !user) {
      throw new Error('User not found');
    }

    // Create or retrieve Stripe customer
    let stripeCustomerId: string;
    const { data: subscription } = await supabaseClient
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (subscription?.stripe_customer_id) {
      stripeCustomerId = subscription.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabaseUserId: userId,
        },
      });
      stripeCustomerId = customer.id;
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/pricing`,
      metadata: {
        userId,
      },
    });

    return new Response(
      JSON.stringify({ sessionId: session.id }),
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