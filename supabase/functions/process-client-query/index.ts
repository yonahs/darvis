
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

    const sqlQuery = `
      WITH customer_orders AS (
        SELECT 
          c.clientid,
          c.firstname,
          c.lastname,
          c.email,
          c.mobile,
          c.dayphone,
          COUNT(o.orderid) as total_orders,
          SUM(o.totalsale) as total_value,
          MAX(o.orderdate) as last_purchase,
          (
            SELECT row_to_json(last_order) FROM (
              SELECT 
                nd.nameus as drug_name,
                o2.amount as quantity,
                o2.totalsale as value,
                o2.orderdate as date
              FROM orders o2
              JOIN newdrugs nd ON o2.drugid = nd.drugid
              WHERE o2.clientid = c.clientid
              ORDER BY o2.orderdate DESC
              LIMIT 1
            ) last_order
          ) as last_order_details,
          (
            SELECT COUNT(*) 
            FROM customer_call_logs ccl 
            WHERE ccl.client_id = c.clientid
          ) as call_attempts,
          (
            SELECT string_agg(ccl.outcome::text, ',') 
            FROM customer_call_logs ccl 
            WHERE ccl.client_id = c.clientid
          ) as call_outcomes,
          cra.risk_level,
          cra.is_flagged,
          (
            SELECT MAX(called_at)::text 
            FROM customer_call_logs ccl 
            WHERE ccl.client_id = c.clientid
          ) as last_contacted
        FROM clients c
        JOIN orders o ON c.clientid = o.clientid
        LEFT JOIN client_risk_assessments cra ON c.clientid = cra.client_id
        WHERE 
          o.orderdate >= '2024-01-01'
          AND o.cancelled = false
        GROUP BY 
          c.clientid, c.firstname, c.lastname, c.email, c.mobile, c.dayphone,
          cra.risk_level, cra.is_flagged
        HAVING 
          COUNT(o.orderid) >= 2 
          AND SUM(o.totalsale) > 500
      )
      SELECT 
        *,
        EXISTS (
          SELECT 1 FROM clientrx cr WHERE cr.clientid = customer_orders.clientid
        ) as has_prescription
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
