
export type CallOutcome = 'completed' | 'no_answer' | 'follow_up' | 'not_interested';

export interface CustomerResult {
  clientid: number
  firstname: string
  lastname: string
  email: string
  mobile?: string
  dayphone?: string
  total_orders: number
  last_purchase: string
  total_value: number
  risk_level?: number
  is_flagged?: boolean
  last_contacted?: string
  call_attempts?: number
  call_outcomes?: CallOutcome[]
  has_prescription?: boolean
  total_tickets?: number
  open_tickets?: number
  last_ticket_date?: string
  last_call?: string
  last_order_details?: {
    drug_name: string
    quantity: number
    value: number
    date: string
  }
}

export interface SavedSegment {
  id: string
  name: string
  created_by: string
  description: string | null
  natural_language_query: string
  structured_query: any // Changed to any to handle Supabase JSON type
  created_at: string
  last_executed_at: string | null
  next_refresh_at: string | null
  version: number
  is_active: boolean
  execution_count: number
  result_count: number
  metadata: {
    criteria?: Record<string, any>
    filters?: Record<string, any>
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  metadata?: {
    queryId?: string
    resultCount?: number
    error?: string
    suggestions?: string[]
  }
}
