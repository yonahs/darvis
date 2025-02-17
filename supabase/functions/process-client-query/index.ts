
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
    console.log('Received query:', query)

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl!, supabaseKey!)

    // First, let's check what medications we have in the database
    console.log('Checking available medications...')
    const { data: medications, error: medsError } = await supabase
      .from('newdrugs')
      .select('drugid, nameus, chemical')
      .or('nameus.ilike.%ozempic%,chemical.ilike.%semaglutide%')

    if (medsError) {
      console.error('Error fetching medications:', medsError)
      throw medsError
    }

    console.log('Available medications:', medications)

    // If we found any matching medications, let's get the customer orders
    let results = []
    if (medications && medications.length > 0) {
      const drugIds = medications.map(med => med.drugid)
      
      const searchQuery = `
        SELECT DISTINCT 
          c.clientid,
          c.firstname,
          c.lastname,
          c.email,
          o.orderdate,
          o.shipdate,
          o.totalsale,
          nd.nameus as medication_name,
          nd.chemical as medication_chemical
        FROM clients c
        JOIN orders o ON c.clientid = o.clientid
        JOIN newdrugs nd ON o.drugid = nd.drugid
        WHERE nd.drugid = ANY($1)
        ORDER BY o.shipdate DESC NULLS LAST
      `

      const { data: queryResults, error: queryError } = await supabase
        .rpc('execute_ai_query', {
          query_text: searchQuery.replace('$1', `'{${drugIds.join(',')}}'`)
        })

      if (queryError) {
        console.error('Error executing customer query:', queryError)
        throw queryError
      }

      results = queryResults?.[0] || []
      console.log(`Found ${results.length} customer orders`)
    } else {
      console.log('No matching medications found in the database')
    }

    // Prepare a more informative response
    let message = 'No matching medications found in our database.'
    if (results.length > 0) {
      message = `Found ${results.length} orders for Ozempic/Semaglutide, sorted by ship date.`
    }

    return new Response(
      JSON.stringify({
        message,
        results,
        debug: {
          medications_found: medications?.length || 0,
          medication_names: medications?.map(m => m.nameus)
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
    console.error('Error processing query:', error)
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
