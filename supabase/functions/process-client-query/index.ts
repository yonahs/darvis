
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
    console.log('Processing query:', query)

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Extract the order number if it's an order query
    const orderMatch = query.match(/order\s+#?\s*(\d+)/i)
    const orderNumber = orderMatch ? orderMatch[1] : null

    // First, get the order details
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl!, supabaseKey!)

    const orderQuery = `
      SELECT 
        o.*,
        c.firstname, 
        c.lastname,
        c.email,
        c.address,
        c.city,
        c.state,
        c.country,
        nd.nameus as medication_name,
        nd.chemical,
        ndd.strength,
        ndd.packsize,
        p.name as processor_name,
        s.display_name as shipper_name,
        sl.status as order_status,
        string_agg(DISTINCT oc.comment, ' | ') as comments
      FROM orders o
      LEFT JOIN clients c ON o.clientid = c.clientid
      LEFT JOIN newdrugs nd ON o.drugid = nd.drugid
      LEFT JOIN newdrugdetails ndd ON o.drugdetailid = ndd.id
      LEFT JOIN processor p ON o.processorid = p.autoid
      LEFT JOIN shippers s ON o.shipperid = s.shipperid
      LEFT JOIN statuslist sl ON o.status = sl.id
      LEFT JOIN ordercomments oc ON o.orderid = oc.orderid
      WHERE o.orderid = ${orderNumber}
      GROUP BY 
        o.orderid, c.clientid, nd.drugid, ndd.id, 
        p.autoid, s.shipperid, sl.id
    `

    // Get order data
    const { data: orderData, error: queryError } = await supabase
      .rpc('execute_ai_query', { query_text: orderQuery })

    if (queryError) {
      console.error('Error fetching order:', queryError)
      throw queryError
    }

    const orderInfo = orderData?.[0]?.[0]
    
    if (!orderInfo) {
      return new Response(
        JSON.stringify({
          message: `I couldn't find any order with ID ${orderNumber}.`,
          results: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Now use GPT to generate a natural language summary
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
            content: `You are a helpful pharmacy order assistant. Analyze the order information and provide a clear, natural summary. Include important details about:
            - Order status and dates
            - Customer information
            - Medication details
            - Payment and shipping status
            - Any issues or special notes
            Be concise but comprehensive.`
          },
          {
            role: 'user',
            content: `Analyze this order information and provide a natural summary: ${JSON.stringify(orderInfo)}`
          }
        ],
      }),
    })

    const openAIData = await openAIResponse.json()
    const summary = openAIData.choices[0].message.content

    return new Response(
      JSON.stringify({
        message: summary,
        results: [orderInfo],
        metadata: {
          queryId: crypto.randomUUID(),
          resultCount: 1
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing query:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
        message: 'I encountered an error while retrieving the order information. Please try again.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
