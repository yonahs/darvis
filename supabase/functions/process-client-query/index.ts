
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

    // First let's find customers who have ordered Eliquis
    const customerQuery = `
      WITH eliquis_orders AS (
        SELECT DISTINCT 
          o.clientid,
          o.orderdate,
          COUNT(*) OVER (PARTITION BY o.clientid) as order_count,
          MAX(o.orderdate) OVER (PARTITION BY o.clientid) as last_order_date
        FROM orders o
        JOIN newdrugdetails ndd ON o.drugdetailid = ndd.id
        JOIN newdrugs nd ON ndd.drugid = nd.drugid
        WHERE 
          (nd.nameus ILIKE '%eliquis%' OR nd.chemical ILIKE '%apixaban%')
          AND o.cancelled = false
      )
      SELECT DISTINCT
        c.clientid,
        c.firstname,
        c.lastname,
        c.email,
        c.mobile,
        c.dayphone,
        eo.last_order_date as last_purchase,
        eo.order_count as total_orders
      FROM clients c
      JOIN eliquis_orders eo ON c.clientid = eo.clientid
      WHERE 
        eo.order_count > 2 
        AND eo.last_order_date < NOW() - INTERVAL '3 months'
      ORDER BY eo.last_order_date DESC;
    `;

    console.log('Executing query:', customerQuery);

    const { data: results, error } = await supabaseClient.rpc('execute_ai_query', {
      query_text: customerQuery
    });

    if (error) {
      console.error('Query error:', error);
      throw error;
    }

    console.log('Query results:', results);

    // Also get some sample data to verify our tables have data
    const verificationQuery = `
      SELECT 
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT COUNT(*) FROM newdrugs WHERE nameus ILIKE '%eliquis%' OR chemical ILIKE '%apixaban%') as eliquis_drugs,
        (SELECT COUNT(*) FROM newdrugdetails) as total_drug_details,
        (SELECT COUNT(*) FROM clients) as total_clients;
    `;

    const { data: verificationData } = await supabaseClient.rpc('execute_ai_query', {
      query_text: verificationQuery
    });

    console.log('Verification data:', verificationData);

    return new Response(JSON.stringify({ 
      results,
      debug: {
        verificationData,
        query: customerQuery
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
