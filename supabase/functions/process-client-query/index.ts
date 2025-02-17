
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
    const { query } = await req.json()
    console.log('Processing natural language query:', query)

    // Get OpenAI API key from environment
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // First, have OpenAI understand the query and generate SQL
    console.log('Asking LLM to interpret query and generate SQL...')
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
            content: `You are an AI assistant that converts natural language queries into SQL queries.
            The database contains pharmacy customer and order data with these main tables:
            - clients (clientid, firstname, lastname, email, address, city, state, country)
            - orders (orderid, clientid, drugid, drugdetailid, orderdate, shipdate, totalsale, cancelled)
            - newdrugs (drugid, nameus, chemical, prescription)
            - newdrugdetails (id, drugid, strength, packsize)
            
            Generate a SQL query that:
            1. Always includes relevant customer information
            2. Properly joins necessary tables
            3. Excludes cancelled orders unless specifically requested
            4. Returns clear, meaningful column names
            5. Responds only with the SQL query, no other text
            `
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
    console.log('LLM generated SQL:', generatedSQL)

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl!, supabaseKey!)

    // Execute the generated SQL
    console.log('Executing generated SQL...')
    const { data: queryResults, error: queryError } = await supabase
      .rpc('execute_ai_query', { query_text: generatedSQL })

    if (queryError) {
      console.error('Error executing query:', queryError)
      throw queryError
    }

    const results = queryResults?.[0] || []
    console.log(`Query returned ${results.length} results`)

    // Return results
    return new Response(
      JSON.stringify({
        message: `Found ${results.length} results based on your query.`,
        results,
        metadata: {
          queryId: crypto.randomUUID(),
          resultCount: results.length
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in process-client-query:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
        message: 'Error processing your query. Please try again.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
