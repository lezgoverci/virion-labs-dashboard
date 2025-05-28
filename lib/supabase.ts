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
      referral_links: {
        Row: {
          id: string
          influencer_id: string
          title: string
          description: string | null
          platform: string
          original_url: string
          referral_code: string
          referral_url: string
          thumbnail_url: string | null
          clicks: number
          conversions: number
          earnings: number
          conversion_rate: number | null
          is_active: boolean
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          influencer_id: string
          title: string
          description?: string | null
          platform: string
          original_url: string
          referral_code: string
          referral_url: string
          thumbnail_url?: string | null
          clicks?: number
          conversions?: number
          earnings?: number
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          influencer_id?: string
          title?: string
          description?: string | null
          platform?: string
          original_url?: string
          referral_code?: string
          referral_url?: string
          thumbnail_url?: string | null
          clicks?: number
          conversions?: number
          earnings?: number
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_links_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_analytics: {
        Row: {
          id: string
          link_id: string
          event_type: string
          user_agent: string | null
          ip_address: string | null
          referrer: string | null
          country: string | null
          city: string | null
          device_type: string | null
          browser: string | null
          conversion_value: number
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          link_id: string
          event_type: string
          user_agent?: string | null
          ip_address?: string | null
          referrer?: string | null
          country?: string | null
          city?: string | null
          device_type?: string | null
          browser?: string | null
          conversion_value?: number
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          link_id?: string
          event_type?: string
          user_agent?: string | null
          ip_address?: string | null
          referrer?: string | null
          country?: string | null
          city?: string | null
          device_type?: string | null
          browser?: string | null
          conversion_value?: number
          metadata?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_analytics_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "referral_links"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          id: string
          influencer_id: string
          referral_link_id: string
          referred_user_id: string | null
          name: string
          email: string
          discord_id: string | null
          age: number | null
          status: string
          source_platform: string
          conversion_value: number
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          influencer_id: string
          referral_link_id: string
          referred_user_id?: string | null
          name: string
          email: string
          discord_id?: string | null
          age?: number | null
          status?: string
          source_platform: string
          conversion_value?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          influencer_id?: string
          referral_link_id?: string
          referred_user_id?: string | null
          name?: string
          email?: string
          discord_id?: string | null
          age?: number | null
          status?: string
          source_platform?: string
          conversion_value?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referral_link_id_fkey"
            columns: ["referral_link_id"]
            isOneToOne: false
            referencedRelation: "referral_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
export type Platform = 'YouTube' | 'Instagram' | 'TikTok' | 'Twitter' | 'Facebook' | 'LinkedIn' | 'Other'
export type AnalyticsEventType = 'click' | 'conversion'

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

export type ReferralLink = Database['public']['Tables']['referral_links']['Row']
export type ReferralLinkInsert = Database['public']['Tables']['referral_links']['Insert']
export type ReferralLinkUpdate = Database['public']['Tables']['referral_links']['Update']

export type ReferralAnalytics = Database['public']['Tables']['referral_analytics']['Row']
export type ReferralAnalyticsInsert = Database['public']['Tables']['referral_analytics']['Insert']
export type ReferralAnalyticsUpdate = Database['public']['Tables']['referral_analytics']['Update']

export type Referral = Database['public']['Tables']['referrals']['Row']
export type ReferralInsert = Database['public']['Tables']['referrals']['Insert']
export type ReferralUpdate = Database['public']['Tables']['referrals']['Update']

// Extended Bot type with client information
export interface BotWithClient extends Bot {
  client?: {
    id: string
    name: string
    industry: string
  }
}

// Extended ReferralLink type with analytics
export interface ReferralLinkWithAnalytics extends ReferralLink {
  analytics?: {
    totalClicks: number
    totalConversions: number
    conversionRate: number
    totalEarnings: number
    recentClicks: number
    recentConversions: number
  }
}

// Extended Referral type with link information
export interface ReferralWithLink extends Referral {
  referral_link?: {
    id: string
    title: string
    platform: string
    referral_code: string
  }
} 