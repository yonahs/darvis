
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { query } = await req.json();

    console.log('Received query:', query);

    // Let's check what's in the tables first
    const tablesQuery = `
      SELECT 
        table_name,
        (SELECT COUNT(*) FROM ${table_name}) as row_count
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('newdrugs', 'newdrugdetails', 'orders', 'clients')
    `;

    const { data: tableInfo } = await supabaseClient.rpc('execute_ai_query', {
      query_text: tablesQuery
    });

    console.log('Table information:', tableInfo);

    // Let's look at a sample from each table
    const drugsQuery = `
      SELECT drugid, nameus, chemical 
      FROM newdrugs 
      LIMIT 5
    `;

    const drugDetailsQuery = `
      SELECT id, drugid, strength, nameil 
      FROM newdrugdetails 
      LIMIT 5
    `;

    const ordersQuery = `
      SELECT orderid, clientid, drugdetailid 
      FROM orders 
      ORDER BY orderdate DESC 
      LIMIT 5
    `;

    const { data: drugs } = await supabaseClient.rpc('execute_ai_query', {
      query_text: drugsQuery
    });

    const { data: drugDetails } = await supabaseClient.rpc('execute_ai_query', {
      query_text: drugDetailsQuery
    });

    const { data: orders } = await supabaseClient.rpc('execute_ai_query', {
      query_text: ordersQuery
    });

    console.log('Sample drugs:', drugs);
    console.log('Sample drug details:', drugDetails);
    console.log('Sample orders:', orders);

    return new Response(JSON.stringify({ 
      debug: {
        tableInfo,
        drugs,
        drugDetails,
        orders
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
