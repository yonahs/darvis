
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

    // Add debug logging
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
            content: `You are a SQL query generator. Convert natural language questions about customers into SQL queries using these tables and views:
            - clients (clientid, firstname, lastname, email, country, state)
            - orders (orderid, clientid, totalsale, orderdate, orderstatus, problemorder)
            - clientrx (id, clientid, dateuploaded, image)
            - clientrxdetails (id, rxid, drugid, refills, filled, rxdate)
            - zendesk_tickets (client_id, status, created_at, subject)
            - vw_client_risk_summary (clientid, risk_level, is_flagged)
            - payment_methods (client_id, payment_type, is_default)

            Generate only a SELECT query that:
            1. Always starts with SELECT DISTINCT c.clientid, c.firstname, c.lastname, c.email
            2. Uses proper table aliases (c for clients, o for orders, etc)
            3. Always joins from the clients table (use LEFT JOIN for optional data)
            4. Groups by the core client fields when using aggregations
            5. Returns only one row per client
            
            Only return the SQL query without any explanation.`
          },
          { role: 'user', content: query }
        ],
      }),
    });

    const aiData = await openAiResponse.json();
    const sqlQuery = aiData.choices[0].message.content;

    console.log('Generated SQL:', sqlQuery);

    // First try to execute the query directly
    try {
      const { data: directResults, error: directError } = await supabaseClient
        .from('clients')
        .select(`
          clientid,
          firstname,
          lastname,
          email,
          orders (
            orderid,
            totalsale,
            orderdate
          )
        `)
        .limit(1);

      console.log('Direct query test results:', directResults);
      if (directError) console.error('Direct query test error:', directError);
    } catch (e) {
      console.error('Direct query test failed:', e);
    }

    // Now execute the AI-generated query
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
