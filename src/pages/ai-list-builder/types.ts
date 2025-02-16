
export interface CustomerResult {
  clientid: number
  firstname: string
  lastname: string
  email: string
  mobile?: string
  dayphone?: string
  total_orders: number
  last_purchase: string
  total_tickets?: number
  open_tickets?: number
  last_ticket_date?: string
  recent_ticket_subjects?: string[]
  last_call?: {
    called_at: string
    outcome: 'unreachable' | 'no_answer' | 'contacted' | 'voicemail' | 'wrong_number' | 'do_not_call'
    notes?: string
  }
}

export interface SavedSegment {
  id: string
  name: string
  description: string | null
  natural_language_query: string
  created_at: string
  last_executed_at: string | null
}
