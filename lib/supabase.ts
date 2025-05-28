import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mcynacktfmtzkkohctps.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jeW5hY2t0Zm10emtrb2hjdHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MjUwNTMsImV4cCI6MjA2NDAwMTA1M30.8RwxTIucQndsJ2e_q53p5TRNVM3xdhIfQuD2YxzQy70'

// Database types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bots: {
        Row: {
          auto_deploy: boolean | null
          avatar_url: string | null
          client_id: string
          commands_used: number | null
          created_at: string | null
          description: string | null
          discord_bot_id: string | null
          discord_token: string | null
          id: string
          invite_url: string | null
          last_online: string | null
          name: string
          prefix: string | null
          servers: number | null
          status: string
          template: string
          updated_at: string | null
          uptime_percentage: number | null
          users: number | null
          webhook_url: string | null
        }
        Insert: {
          auto_deploy?: boolean | null
          avatar_url?: string | null
          client_id: string
          commands_used?: number | null
          created_at?: string | null
          description?: string | null
          discord_bot_id?: string | null
          discord_token?: string | null
          id?: string
          invite_url?: string | null
          last_online?: string | null
          name: string
          prefix?: string | null
          servers?: number | null
          status?: string
          template?: string
          updated_at?: string | null
          uptime_percentage?: number | null
          users?: number | null
          webhook_url?: string | null
        }
        Update: {
          auto_deploy?: boolean | null
          avatar_url?: string | null
          client_id?: string
          commands_used?: number | null
          created_at?: string | null
          description?: string | null
          discord_bot_id?: string | null
          discord_token?: string | null
          id?: string
          invite_url?: string | null
          last_online?: string | null
          name?: string
          prefix?: string | null
          servers?: number | null
          status?: string
          template?: string
          updated_at?: string | null
          uptime_percentage?: number | null
          users?: number | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bots_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          bots: number | null
          contact_email: string | null
          created_at: string | null
          id: string
          industry: string
          influencers: number | null
          join_date: string
          logo: string | null
          name: string
          primary_contact: string | null
          status: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          bots?: number | null
          contact_email?: string | null
          created_at?: string | null
          id?: string
          industry: string
          influencers?: number | null
          join_date?: string
          logo?: string | null
          name: string
          primary_contact?: string | null
          status?: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          bots?: number | null
          contact_email?: string | null
          created_at?: string | null
          id?: string
          industry?: string
          influencers?: number | null
          join_date?: string
          logo?: string | null
          name?: string
          primary_contact?: string | null
          status?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export type UserRole = 'influencer' | 'admin' | 'client'
export type BotStatus = 'Online' | 'Offline' | 'Maintenance' | 'Error'
export type BotTemplate = 'standard' | 'advanced' | 'custom'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export type Client = Database['public']['Tables']['clients']['Row']
export type ClientInsert = Database['public']['Tables']['clients']['Insert']
export type ClientUpdate = Database['public']['Tables']['clients']['Update']

export type Bot = Database['public']['Tables']['bots']['Row']
export type BotInsert = Database['public']['Tables']['bots']['Insert']
export type BotUpdate = Database['public']['Tables']['bots']['Update']

// Extended Bot type with client information
export interface BotWithClient extends Bot {
  client?: {
    id: string
    name: string
    industry: string
  }
} 