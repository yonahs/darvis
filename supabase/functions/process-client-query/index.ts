
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

    // First, let's just find the drug in newdrugs table
    const drugQuery = `
      SELECT drugid, nameus, chemical 
      FROM newdrugs 
      WHERE 
        nameus ILIKE '%eliq%' OR 
        nameus ILIKE '%apix%' OR
        chemical ILIKE '%eliq%' OR 
        chemical ILIKE '%apix%'
    `;

    const { data: drugResults, error: drugError } = await supabaseClient.rpc('execute_ai_query', {
      query_text: drugQuery
    });

    console.log('Drug search results:', drugResults);

    // If we found the drug, let's look for orders
    if (drugResults && drugResults.length > 0) {
      const drugIds = drugResults.map((d: any) => d.drugid).join(',');
      
      const ordersQuery = `
        SELECT DISTINCT 
          c.clientid,
          c.firstname,
          c.lastname,
          c.email,
          c.mobile,
          c.dayphone,
          o.orderdate as last_purchase,
          nd.nameus as drug_name
        FROM clients c
        JOIN orders o ON c.clientid = o.clientid
        JOIN newdrugdetails ndd ON o.drugdetailid = ndd.id
        JOIN newdrugs nd ON ndd.drugid = nd.drugid
        WHERE nd.drugid IN (${drugIds})
        ORDER BY o.orderdate DESC
        LIMIT 10
      `;

      const { data: results, error } = await supabaseClient.rpc('execute_ai_query', {
        query_text: ordersQuery
      });

      console.log('Order results:', results);

      return new Response(JSON.stringify({ 
        results,
        debug: {
          drugResults,
          drugQuery,
          ordersQuery
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If we didn't find the drug, let's see what drugs we do have
    const sampleDrugsQuery = `
      SELECT drugid, nameus, chemical 
      FROM newdrugs 
      WHERE nameus IS NOT NULL 
      ORDER BY nameus 
      LIMIT 10
    `;

    const { data: sampleDrugs } = await supabaseClient.rpc('execute_ai_query', {
      query_text: sampleDrugsQuery
    });

    console.log('Sample drugs in database:', sampleDrugs);

    return new Response(JSON.stringify({ 
      results: [],
      debug: {
        sampleDrugs,
        drugQuery
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
