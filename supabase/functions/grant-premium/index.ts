import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify the caller is admin
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await anonClient.auth.getUser();
    if (!caller || caller.email !== "wrapperdom@gmail.com") {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });
    }

    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400, headers: corsHeaders });
    }

    // Use service role to find user by email
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers();
    if (listError) {
      return new Response(JSON.stringify({ error: "Failed to list users" }), { status: 500, headers: corsHeaders });
    }

    const targetUser = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (!targetUser) {
      return new Response(JSON.stringify({ error: "User not found with that email" }), { status: 404, headers: corsHeaders });
    }

    // Check if already has premium
    const { data: existing } = await adminClient
      .from("purchases")
      .select("id")
      .eq("user_id", targetUser.id)
      .eq("status", "succeeded")
      .limit(1);

    if (existing && existing.length > 0) {
      return new Response(JSON.stringify({ message: "User already has premium access" }), { headers: corsHeaders });
    }

    // Insert purchase record
    const { error: insertError } = await adminClient.from("purchases").insert({
      user_id: targetUser.id,
      payment_id: `admin_grant_${Date.now()}`,
      product_id: "admin_granted",
      amount: 0,
      status: "succeeded",
      currency: "USD",
    });

    if (insertError) {
      return new Response(JSON.stringify({ error: "Failed to grant access" }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ message: "Premium access granted successfully" }), { headers: corsHeaders });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
});
