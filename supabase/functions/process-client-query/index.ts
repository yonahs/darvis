
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
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
    console.log('Processing query:', query)

    // For testing, let's start with a simple query to verify the connection
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
        SUM(o.totalsale) as total_value
      FROM clients c
      LEFT JOIN orders o ON c.clientid = o.clientid
      WHERE o.cancelled = false
      GROUP BY c.clientid, c.firstname, c.lastname, c.email, c.mobile, c.dayphone
      LIMIT 10
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

    // Format the results
    const formattedResults = results[0]?.map((row: any) => ({
      clientid: row.clientid,
      firstname: row.firstname,
      lastname: row.lastname,
      email: row.email,
      mobile: row.mobile,
      dayphone: row.dayphone,
      total_orders: row.total_orders,
      last_purchase: row.last_purchase,
      total_value: row.total_value
    })) || []

    return new Response(
      JSON.stringify({
        message: `Found ${formattedResults.length} results`,
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
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: "Failed to process query"
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
