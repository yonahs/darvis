
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
            content: `You are a SQL query generator. Convert natural language questions about customers into SQL queries using these tables and views:
            - clients (clientid, firstname, lastname, email, mobile, dayphone)
            - orders (orderid, clientid, totalsale, orderdate, orderstatus, drugid, drugdetailid)
            - newdrugs (drugid, nameus, chemical)
            - newdrugdetails (id, drugid, nameil, strength)
            - zendesk_tickets (client_id, status, created_at, subject)
            - customer_call_logs (id, client_id, outcome, called_at, notes)
            
            Generate only a SELECT query that:
            1. Always starts with SELECT DISTINCT c.clientid, c.firstname, c.lastname, c.email, c.mobile, c.dayphone
            2. Uses proper table aliases (c for clients, o for orders, etc)
            3. Always joins from the clients table (use LEFT JOIN for optional data)
            4. For drug-related queries, join orders with newdrugdetails and newdrugs
            5. When counting orders, use COUNT(DISTINCT o.orderid)
            6. Returns only one row per client
            7. Use LOWER() for drug name comparisons
            8. Include the most recent call info if available
            
            Only return the SQL query without any explanation.`
          },
          { role: 'user', content: query }
        ],
      }),
    });

    const aiData = await openAiResponse.json();
    const sqlQuery = aiData.choices[0].message.content;

    console.log('Generated SQL:', sqlQuery);

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
