
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
  call_outcomes?: string[]
  has_prescription?: boolean
  total_tickets?: number
  open_tickets?: number
}

export interface SavedSegment {
  id: string
  name: string
  description: string | null
  natural_language_query: string
  created_at: string
  last_executed_at: string | null
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
