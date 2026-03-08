const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DODO_API_KEY = Deno.env.get('DODO_PAYMENTS_API_KEY');
    if (!DODO_API_KEY) {
      throw new Error('DODO_PAYMENTS_API_KEY is not configured');
    }

    const { customer_email, return_url } = await req.json();

    const response = await fetch('https://live.dodopayments.com/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DODO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_cart: [
          { product_id: 'pdt_0Na3QDJmu69afs90dYGGv', quantity: 1 },
        ],
        payment_link: true,
        return_url: return_url || undefined,
        customer: customer_email ? { email: customer_email } : undefined,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Dodo API error:', JSON.stringify(data));
      throw new Error(`Dodo API error [${response.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ checkout_url: data.checkout_url, session_id: data.session_id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating checkout:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
