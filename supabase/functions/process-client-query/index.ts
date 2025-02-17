
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

    // Optimized query with simpler subqueries and better JOIN conditions
    const sqlQuery = `
      WITH base_customers AS (
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
          cra.risk_level,
          cra.is_flagged
        FROM clients c
        JOIN orders o ON c.clientid = o.clientid
        LEFT JOIN client_risk_assessments cra ON c.clientid = cra.client_id
        WHERE 
          o.orderdate >= CURRENT_DATE - INTERVAL '6 months'
          AND o.cancelled = false
        GROUP BY 
          c.clientid, c.firstname, c.lastname, c.email, c.mobile, c.dayphone,
          cra.risk_level, cra.is_flagged
        HAVING 
          COUNT(o.orderid) >= 2 
          AND SUM(o.totalsale) > 500
        LIMIT 100
      ),
      last_orders AS (
        SELECT DISTINCT ON (o.clientid)
          o.clientid,
          nd.nameus as drug_name,
          o.amount as quantity,
          o.totalsale as value,
          o.orderdate as date
        FROM orders o
        JOIN newdrugs nd ON o.drugid = nd.drugid
        JOIN base_customers bc ON o.clientid = bc.clientid
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
        JOIN base_customers bc ON client_id = bc.clientid
        GROUP BY client_id
      )
      SELECT 
        bc.*,
        json_build_object(
          'drug_name', lo.drug_name,
          'quantity', lo.quantity,
          'value', lo.value,
          'date', lo.date
        ) as last_order_details,
        cs.call_attempts,
        cs.call_outcomes,
        cs.last_contacted,
        EXISTS (SELECT 1 FROM clientrx cr WHERE cr.clientid = bc.clientid) as has_prescription
      FROM base_customers bc
      LEFT JOIN last_orders lo ON bc.clientid = lo.clientid
      LEFT JOIN call_stats cs ON bc.clientid = cs.client_id
      ORDER BY bc.total_value DESC
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
