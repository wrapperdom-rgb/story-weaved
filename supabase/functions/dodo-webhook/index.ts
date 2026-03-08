import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const DODO_WEBHOOK_KEY = Deno.env.get('DODO_WEBHOOK_KEY');
    const body = await req.json();

    console.log('Webhook received:', JSON.stringify(body));

    // Verify webhook signature if key is set
    if (DODO_WEBHOOK_KEY) {
      const signature = req.headers.get('webhook-signature');
      // Basic presence check — Dodo sends webhook-signature header
      if (!signature) {
        console.error('Missing webhook signature');
        return new Response('Unauthorized', { status: 401, headers: corsHeaders });
      }
    }

    const { type, data } = body;

    if (type !== 'payment.succeeded') {
      // Acknowledge non-payment events
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract user_id from metadata
    const userId = data?.metadata?.user_id;
    const paymentId = data?.payment_id;
    const productId = data?.product_cart?.[0]?.product_id || 'pdt_0Na3QDJmu69afs90dYGGv';
    const amount = data?.total_amount || data?.settlement_amount || 100;
    const currency = data?.currency || 'USD';

    if (!userId || !paymentId) {
      console.error('Missing user_id or payment_id in webhook data:', JSON.stringify(data));
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert purchase using service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { error: insertError } = await supabase.from('purchases').upsert({
      user_id: userId,
      payment_id: paymentId,
      product_id: productId,
      amount,
      currency,
      status: 'succeeded',
    }, { onConflict: 'payment_id' });

    if (insertError) {
      console.error('Failed to insert purchase:', insertError);
      return new Response(JSON.stringify({ error: 'Database error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Purchase recorded for user:', userId, 'payment:', paymentId);

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
