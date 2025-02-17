
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query, metadata } = await req.json()
    console.log('Received query:', query)

    // Get OpenAI API key from environment
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found')
    }

    console.log('Sending query to OpenAI for SQL generation...')
    
    // Send to OpenAI to generate SQL
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a SQL expert that converts natural language queries about pharmacy customers into SQL queries.
            Available tables:
            - orders (orderid, clientid, drugid, orderdate, shipdate)
            - clients (clientid, firstname, lastname, email)
            - newdrugs (drugid, nameus, chemical)
            Always include client details and ensure proper joins.`
          },
          {
            role: 'user',
            content: query
          }
        ],
      }),
    })

    const openAIData = await openAIResponse.json()
    const generatedSQL = openAIData.choices[0].message.content
    console.log('Generated SQL:', generatedSQL)

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl!, supabaseKey!)

    // Execute the generated SQL
    console.log('Executing SQL query...')
    const { data: results, error: queryError } = await supabase.rpc(
      'execute_ai_query',
      { query_text: generatedSQL }
    )

    if (queryError) {
      console.error('Query execution error:', queryError)
      throw queryError
    }

    console.log(`Query returned ${results?.[0]?.length || 0} results`)

    return new Response(
      JSON.stringify({
        message: `Here are the customers who ordered Ozempic, sorted by ship date:`,
        results: results?.[0] || [],
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing query:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
