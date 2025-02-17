
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    console.log('Received query:', query)

    // If it's a test query, let's run a simple count
    if (query.toLowerCase().includes('test connection')) {
      const testQuery = `
        SELECT 
          COUNT(*) as total_clients,
          COUNT(DISTINCT c.clientid) as unique_clients,
          COUNT(DISTINCT o.orderid) as total_orders,
          COALESCE(SUM(o.totalsale), 0) as total_sales
        FROM clients c
        LEFT JOIN orders o ON c.clientid = o.clientid
        WHERE o.cancelled = false OR o.cancelled IS NULL
      `

      console.log('Executing test query:', testQuery)
      
      const { data: results, error: queryError } = await supabaseClient.rpc(
        'execute_ai_query',
        { query_text: testQuery }
      )

      if (queryError) {
        console.error('Query error:', queryError)
        throw queryError
      }

      console.log('Test query results:', results)

      return new Response(
        JSON.stringify({
          message: "Connection test successful! Here's a summary of your data:",
          results: results[0],
          queryId: crypto.randomUUID()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // For regular queries, let's get customer data
    const customerQuery = `
      WITH customer_summary AS (
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
        WHERE (o.cancelled = false OR o.cancelled IS NULL)
        GROUP BY c.clientid, c.firstname, c.lastname, c.email, c.mobile, c.dayphone
        HAVING COUNT(DISTINCT o.orderid) > 0
        ORDER BY MAX(o.orderdate) DESC
        LIMIT 10
      )
      SELECT * FROM customer_summary
    `

    console.log('Executing query:', customerQuery)

    const { data: results, error: queryError } = await supabaseClient.rpc(
      'execute_ai_query',
      { query_text: customerQuery }
    )

    if (queryError) {
      console.error('Query error:', queryError)
      throw queryError
    }

    console.log('Query results:', results)

    return new Response(
      JSON.stringify({
        message: "Here are some recent customers:",
        results,
        queryId: crypto.randomUUID()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
