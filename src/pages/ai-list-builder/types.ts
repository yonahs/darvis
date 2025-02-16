
export interface CustomerResult {
  clientid: number
  firstname: string
  lastname: string
  email: string
  total_orders: number
  last_purchase: string
}

export interface SavedSegment {
  id: string
  name: string
  description: string | null
  natural_language_query: string
  created_at: string
  last_executed_at: string | null
}
