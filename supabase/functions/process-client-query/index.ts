
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
    console.log('Processing natural language query:', query)

    // For this example, we'll construct a specific SQL query to get customer data
    const sqlQuery = `
      WITH customer_orders AS (
        SELECT 
          c.clientid,
          c.firstname,
          c.lastname,
          c.email,
          COUNT(o.orderid) as total_orders,
          SUM(o.totalsale) as total_value,
          MAX(o.orderdate) as last_purchase
        FROM clients c
        JOIN orders o ON c.clientid = o.clientid
        WHERE 
          o.orderdate >= '2024-01-01'
          AND o.cancelled = false
        GROUP BY c.clientid, c.firstname, c.lastname, c.email
        HAVING 
          COUNT(o.orderid) >= 2 
          AND SUM(o.totalsale) > 500
      )
      SELECT 
        clientid,
        firstname,
        lastname,
        email,
        total_orders,
        total_value,
        last_purchase,
        false as has_prescription,
        null as last_contacted
      FROM customer_orders
      ORDER BY total_value DESC
      LIMIT 100
    `

    console.log('Executing SQL query:', sqlQuery)
    
    const { data: results, error: queryError } = await supabaseClient.rpc(
      'execute_ai_query',
      { query_text: sqlQuery }
    )

    if (queryError) {
      console.error('Query error:', queryError)
      throw queryError
    }

    console.log('Query results:', results)

    // Format the results to match the CustomerResult type
    const formattedResults = results[0].map((row: any) => ({
      clientid: row.clientid,
      firstname: row.firstname,
      lastname: row.lastname,
      email: row.email,
      total_orders: row.total_orders,
      last_purchase: row.last_purchase,
      total_value: row.total_value,
      has_prescription: row.has_prescription,
      last_contacted: row.last_contacted
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
