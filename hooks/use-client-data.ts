"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"

export interface ClientStats {
  totalCampaigns: number
  activeInfluencers: number
  totalConversions: number
  roi: number
}

export interface CampaignData {
  name: string
  platform: string
  revenue: number
}

export interface InfluencerData {
  name: string
  handle: string
  conversions: number
}

export function useClientData() {
  const { user } = useAuth()
  const [stats, setStats] = useState<ClientStats>({
    totalCampaigns: 0,
    activeInfluencers: 0,
    totalConversions: 0,
    roi: 0
  })
  const [campaigns, setCampaigns] = useState<CampaignData[]>([])
  const [topInfluencers, setTopInfluencers] = useState<InfluencerData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    fetchClientData()
  }, [user])

  const fetchClientData = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // For now, we'll use mock data since we don't have campaign-specific tables
      // In a real implementation, you'd fetch data based on the client's ID
      
      // Fetch referral links to get campaign-like data
      const { data: linksData, error: linksError } = await supabase
        .from('referral_links')
        .select('*')
        .order('conversions', { ascending: false })
        .limit(10)

      if (linksError) throw linksError

      // Fetch referrals for conversion data
      const { data: referralsData, error: referralsError } = await supabase
        .from('referrals')
        .select(`
          *,
          referral_links!inner(title, platform, influencer_id)
        `)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })

      if (referralsError) throw referralsError

      // Fetch user profiles separately
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('id, full_name')

      if (usersError) throw usersError

      // Create a map of user IDs to names
      const userMap = new Map<string, string>()
      ;(usersData || []).forEach(user => {
        userMap.set(user.id, user.full_name)
      })

      // Process campaign data (using referral links as campaigns)
      const processedCampaigns: CampaignData[] = (linksData || []).slice(0, 3).map(link => ({
        name: link.title,
        platform: `${link.platform} Campaign`,
        revenue: parseFloat(String(link.earnings || '0'))
      }))

      // Process top influencers data
      const influencerStats = new Map<string, { name: string, conversions: number }>()
      
      ;(referralsData || []).forEach(referral => {
        const influencerName = userMap.get(referral.influencer_id) || 'Unknown'
        const existing = influencerStats.get(influencerName)
        
        if (existing) {
          existing.conversions += 1
        } else {
          influencerStats.set(influencerName, {
            name: influencerName,
            conversions: 1
          })
        }
      })

      const processedInfluencers: InfluencerData[] = Array.from(influencerStats.values())
        .sort((a, b) => b.conversions - a.conversions)
        .slice(0, 3)
        .map(inf => ({
          name: inf.name,
          handle: `@${inf.name.toLowerCase().replace(/\s+/g, '')}`,
          conversions: inf.conversions
        }))

      // Calculate stats
      const totalCampaigns = (linksData || []).length
      const activeInfluencers = new Set((referralsData || []).map(r => r.influencer_id)).size
      const totalConversions = (referralsData || []).length
      const totalRevenue = processedCampaigns.reduce((sum, campaign) => sum + campaign.revenue, 0)
      const roi = totalRevenue > 0 ? Math.round((totalRevenue / 1000) * 100) : 0 // Mock ROI calculation

      setStats({
        totalCampaigns,
        activeInfluencers,
        totalConversions,
        roi
      })

      setCampaigns(processedCampaigns)
      setTopInfluencers(processedInfluencers)

    } catch (err) {
      console.error('Error fetching client data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch client data')
    } finally {
      setLoading(false)
    }
  }

  return {
    stats,
    campaigns,
    topInfluencers,
    loading,
    error,
    refetch: fetchClientData
  }
} 