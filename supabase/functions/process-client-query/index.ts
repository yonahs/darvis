
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@4.20.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const systemPrompt = `You are a SQL query generator for a pharmacy database. Generate SQL queries based on natural language requests.
The database has these main tables:
- clients (clientid, firstname, lastname, email, mobile, dayphone)
- orders (orderid, clientid, drugdetailid, orderdate, totalsale, cancelled)
- newdrugs (drugid, nameus, chemical)
- newdrugdetails (id, drugid, strength)
- customer_call_logs (client_id, outcome, called_at)
- clientrx (clientid, dateuploaded)

Some important notes:
1. Always use client_id when joining with customer_call_logs
2. Use drugdetailid to join orders with newdrugdetails
3. Filter out cancelled orders with "cancelled = false"
4. Use proper date intervals for time-based queries
5. Include relevant customer contact information
6. Always return results ordered by most relevant criteria first

Return ONLY the SQL query without any explanation or comments.`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { query } = await req.json()
    console.log('Processing natural language query:', query)

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    // Generate SQL query using GPT
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ]
    })

    const generatedQuery = completion.data.choices[0].message?.content || ''
    console.log('Generated SQL query:', generatedQuery)

    // Execute the generated query
    const { data: results, error: queryError } = await supabaseClient.rpc(
      'execute_ai_query',
      { query_text: generatedQuery }
    )

    if (queryError) {
      console.error('Query error:', queryError)
      throw queryError
    }

    console.log('Query results:', results)

    const formattedResults = results[0].map((row: any) => ({
      clientid: row.clientid,
      firstname: row.firstname,
      lastname: row.lastname,
      email: row.email,
      mobile: row.mobile,
      dayphone: row.dayphone,
      total_orders: row.total_orders,
      last_purchase: row.last_purchase,
      total_value: row.total_value,
      last_order_details: row.last_order_details,
      risk_level: row.risk_level,
      is_flagged: row.is_flagged,
      last_contacted: row.last_contacted,
      call_attempts: row.call_attempts,
      call_outcomes: row.call_outcomes?.split(','),
      has_prescription: row.has_prescription
    }))

    return new Response(
      JSON.stringify({
        message: `Found ${formattedResults.length} customers matching your criteria`,
        results: formattedResults,
        queryId: crypto.randomUUID()
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: "Failed to process query. Please try again."
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
      }
    )
  }
})
