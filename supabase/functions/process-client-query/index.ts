
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

    // Basic query to find Eliquis customers
    const baseQuery = `
      SELECT DISTINCT 
        c.clientid,
        c.firstname,
        c.lastname,
        c.email,
        c.mobile,
        c.dayphone,
        MAX(o.orderdate) as last_purchase,
        COUNT(DISTINCT o.orderid) as total_orders,
        string_agg(DISTINCT nd.nameus, ', ') as drugs_purchased
      FROM clients c
      JOIN orders o ON c.clientid = o.clientid
      JOIN newdrugdetails ndd ON o.drugdetailid = ndd.id
      JOIN newdrugs nd ON ndd.drugid = nd.drugid
      WHERE LOWER(nd.nameus) LIKE '%eliquis%'
      AND NOT EXISTS (
        SELECT 1
        FROM orders o2
        WHERE o2.clientid = c.clientid
        AND o2.orderdate > CURRENT_DATE - INTERVAL '3 months'
      )
      GROUP BY 
        c.clientid,
        c.firstname,
        c.lastname,
        c.email,
        c.mobile,
        c.dayphone
      HAVING COUNT(DISTINCT o.orderid) > 2
      ORDER BY MAX(o.orderdate) DESC
    `;

    console.log('Executing query:', baseQuery);
    
    const { data: results, error } = await supabaseClient.rpc('execute_ai_query', {
      query_text: baseQuery
    });

    if (error) {
      console.error('Error executing query:', error);
      throw error;
    }

    console.log('Query results:', results);

    return new Response(JSON.stringify({ results }), {
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
