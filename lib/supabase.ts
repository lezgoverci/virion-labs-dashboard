import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mcynacktfmtzkkohctps.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jeW5hY2t0Zm10emtrb2hjdHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MjUwNTMsImV4cCI6MjA2NDAwMTA1M30.8RwxTIucQndsJ2e_q53p5TRNVM3xdhIfQuD2YxzQy70'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = 'influencer' | 'admin' | 'client'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: UserRole
  created_at: string
  updated_at: string
} 