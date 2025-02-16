
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

    // Process the natural language query with OpenAI
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a SQL query generator specialized in pharmaceutical customer analysis. Convert natural language questions into SQL queries using these tables:
            
            Tables structure:
            - clients (clientid, firstname, lastname, email, mobile, dayphone)
            - orders (orderid, clientid, totalsale, orderdate, orderstatus, drugid, drugdetailid)
            - newdrugs (drugid, nameus, chemical) - contains the base drug information
            - newdrugdetails (id, drugid, nameil, strength) - contains specific drug variants
            
            Key guidelines for drug-related queries:
            1. Start with: SELECT DISTINCT c.clientid, c.firstname, c.lastname, c.email, c.mobile, c.dayphone
            2. Always add these metrics:
               MAX(o.orderdate) as last_purchase,
               COUNT(DISTINCT o.orderid) as total_orders
            3. For time-based conditions use: 
               - Recent: o.orderdate > CURRENT_DATE - INTERVAL '3 months'
               - Not recent: o.orderdate <= CURRENT_DATE - INTERVAL '3 months'
            4. For drug name matches use: LOWER(nd.nameus) LIKE LOWER('%drug_name%')
            5. Join pattern for drug queries:
               FROM clients c
               LEFT JOIN orders o ON o.clientid = c.clientid
               LEFT JOIN newdrugdetails ndd ON o.drugdetailid = ndd.id
               LEFT JOIN newdrugs nd ON ndd.drugid = nd.drugid
            6. Add recent call info:
               LEFT JOIN LATERAL (
                 SELECT called_at, outcome, notes 
                 FROM customer_call_logs ccl 
                 WHERE ccl.client_id = c.clientid 
                 ORDER BY called_at DESC LIMIT 1
               ) as last_call ON true
            7. Always group by client fields
            8. For multiple purchase conditions, use HAVING COUNT(DISTINCT o.orderid) > X
            
            For drug purchase patterns:
            - Check specific drug: LOWER(nd.nameus) LIKE LOWER('%drug_name%')
            - Multiple purchases: HAVING COUNT(DISTINCT o.orderid) > X
            - Recent/Not recent: Compare o.orderdate with intervals
            
            Only return the SQL query without any explanation.`
          },
          { role: 'user', content: query }
        ],
      }),
    });

    const aiData = await openAiResponse.json();
    const sqlQuery = aiData.choices[0].message.content;

    console.log('Generated SQL:', sqlQuery);

    // First, let's count how many rows this query would return
    const countQuery = `WITH base_query AS (${sqlQuery}) SELECT COUNT(*) as total_rows FROM base_query`;
    const { data: countResult, error: countError } = await supabaseClient.rpc('execute_ai_query', {
      query_text: countQuery
    });

    console.log('Count result:', countResult);

    // Now execute the actual query
    const { data: results, error } = await supabaseClient.rpc('execute_ai_query', {
      query_text: sqlQuery
    });

    if (error) {
      console.error('Error executing AI query:', error);
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
