
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    // Query to find lapsed Eliquis customers
    const sqlQuery = `
      WITH eliquis_customers AS (
        SELECT DISTINCT 
          c.clientid,
          c.firstname,
          c.lastname,
          c.email,
          c.mobile,
          c.dayphone,
          COUNT(DISTINCT o.orderid) as total_orders,
          SUM(o.totalsale) as total_value,
          MAX(o.orderdate) as last_purchase,
          MIN(o.orderdate) as first_purchase
        FROM clients c
        JOIN orders o ON c.clientid = o.clientid
        JOIN newdrugdetails ndd ON o.drugdetailid = ndd.id
        JOIN newdrugs nd ON ndd.drugid = nd.drugid
        WHERE 
          nd.nameus = 'Eliquis'
          AND o.cancelled = false
        GROUP BY 
          c.clientid, c.firstname, c.lastname, c.email, c.mobile, c.dayphone
        HAVING 
          COUNT(DISTINCT o.orderid) >= 2  -- At least 2 orders
          AND MAX(o.orderdate) < CURRENT_DATE - INTERVAL '3 months'  -- No orders in last 3 months
          AND MIN(o.orderdate) < MAX(o.orderdate)  -- Show purchasing history
      ),
      last_orders AS (
        SELECT DISTINCT ON (o.clientid)
          o.clientid,
          nd.nameus as drug_name,
          o.amount as quantity,
          o.totalsale as value,
          o.orderdate as date
        FROM orders o
        JOIN newdrugdetails ndd ON o.drugdetailid = ndd.id
        JOIN newdrugs nd ON ndd.drugid = nd.drugid
        JOIN eliquis_customers ec ON o.clientid = ec.clientid
        WHERE o.cancelled = false
        ORDER BY o.clientid, o.orderdate DESC
      ),
      call_stats AS (
        SELECT 
          client_id,
          COUNT(*) as call_attempts,
          string_agg(outcome::text, ',') as call_outcomes,
          MAX(called_at)::text as last_contacted
        FROM customer_call_logs
        GROUP BY client_id
      )
      SELECT 
        ec.*,
        json_build_object(
          'drug_name', lo.drug_name,
          'quantity', lo.quantity,
          'value', lo.value,
          'date', lo.date
        ) as last_order_details,
        cs.call_attempts,
        cs.call_outcomes,
        cs.last_contacted,
        EXISTS (SELECT 1 FROM clientrx cr WHERE cr.clientid = ec.clientid) as has_prescription
      FROM eliquis_customers ec
      LEFT JOIN last_orders lo ON ec.clientid = lo.clientid
      LEFT JOIN call_stats cs ON ec.clientid = cs.client_id
      ORDER BY ec.last_purchase DESC
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
        message: `Found ${formattedResults.length} lapsed Eliquis customers who haven't ordered in the last 3 months`,
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
