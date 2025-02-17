
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oywnoebuanmnydyauail.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95d25vZWJ1YW5tbnlkeWF1YWlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NjUwNjQsImV4cCI6MjA1MjM0MTA2NH0.xgdlx3lugp4wcQougRDuYj8BDzdDvmH4ao7uUNhV-Fs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})
