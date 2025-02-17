
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Request received:', req.method)
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Safely parse request body
    let requestBody;
    try {
      requestBody = await req.json()
      console.log('Request body:', requestBody)
    } catch (e) {
      console.error('Error parsing request body:', e)
      throw new Error('Invalid JSON in request body')
    }

    const { query } = requestBody
    
    if (!query) {
      throw new Error('No query provided')
    }

    console.log('Processing query:', query)

    // For testing, let's use a simple query first
    const sqlQuery = `
      SELECT 
        c.clientid,
        c.firstname,
        c.lastname,
        c.email,
        c.mobile,
        c.dayphone,
        COUNT(DISTINCT o.orderid) as total_orders,
        MAX(o.orderdate) as last_purchase,
        COALESCE(SUM(o.totalsale), 0) as total_value
      FROM clients c
      LEFT JOIN orders o ON c.clientid = o.clientid 
      GROUP BY c.clientid, c.firstname, c.lastname, c.email, c.mobile, c.dayphone
      LIMIT 5
    `

    console.log('Executing query:', sqlQuery)
    
    const { data: results, error: queryError } = await supabaseClient.rpc(
      'execute_ai_query',
      { query_text: sqlQuery }
    )

    if (queryError) {
      console.error('Query error:', queryError)
      throw queryError
    }

    console.log('Query results:', results)

    const response = {
      message: `Found ${results?.[0]?.length || 0} results`,
      results: results?.[0] || [],
      queryId: crypto.randomUUID()
    }

    console.log('Sending response:', response)

    return new Response(
      JSON.stringify(response),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
      }
    )

  } catch (error) {
    console.error('Error processing request:', error)
    
    const errorResponse = {
      error: error instanceof Error ? error.message : 'Unknown error',
      message: "Failed to process query"
    }
    
    console.log('Sending error response:', errorResponse)
    
    return new Response(
      JSON.stringify(errorResponse),
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
