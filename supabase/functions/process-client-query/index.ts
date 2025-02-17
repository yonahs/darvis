
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { query } = await req.json()
    console.log('Received query:', query)

    // Test query to verify database connection
    const testQuery = `
      SELECT 
        COUNT(*) as count
      FROM clients
      LIMIT 1
    `

    console.log('Executing query:', testQuery)
    
    const { data: results, error: queryError } = await supabaseClient.rpc(
      'execute_ai_query',
      { query_text: testQuery }
    )

    if (queryError) {
      console.error('Query error:', queryError)
      throw queryError
    }

    console.log('Query results:', results)

    return new Response(
      JSON.stringify({
        message: "Query processed successfully",
        results,
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
