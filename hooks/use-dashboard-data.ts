"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"

export interface DashboardStats {
  totalClicks: number
  totalConversions: number
  totalEarnings: number
  conversionRate: number
  activeLinks: number
  topPerformingLink: {
    title: string
    conversions: number
  } | null
}

export interface LinkData {
  id: string
  title: string
  url: string
  platform: string
  clicks: number
  conversions: number
  earnings: number
  created: string
}

export interface ReferralData {
  id: string
  user: string
  email: string
  status: string
  date: string
  earnings: number
  source: string
}

export interface RecentActivity {
  user: string
  action: string
  time: string
}

export function useDashboardData() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalClicks: 0,
    totalConversions: 0,
    totalEarnings: 0,
    conversionRate: 0,
    activeLinks: 0,
    topPerformingLink: null
  })
  const [links, setLinks] = useState<LinkData[]>([])
  const [referrals, setReferrals] = useState<ReferralData[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Fetch referral links
      const { data: linksData, error: linksError } = await supabase
        .from('referral_links')
        .select('*')
        .eq('influencer_id', user.id)
        .order('created_at', { ascending: false })

      if (linksError) throw linksError

      // Fetch referrals
      const { data: referralsData, error: referralsError } = await supabase
        .from('referrals')
        .select(`
          *,
          referral_links!inner(title, platform)
        `)
        .eq('influencer_id', user.id)
        .order('created_at', { ascending: false })

      if (referralsError) throw referralsError

      // Process links data
      const processedLinks: LinkData[] = (linksData || []).map(link => ({
        id: link.id,
        title: link.title,
        url: link.referral_url,
        platform: link.platform,
        clicks: link.clicks || 0,
        conversions: link.conversions || 0,
        earnings: parseFloat(String(link.earnings || '0')),
        created: new Date(link.created_at).toLocaleDateString()
      }))

      // Process referrals data
      const processedReferrals: ReferralData[] = (referralsData || []).map(referral => ({
        id: referral.id,
        user: referral.name,
        email: referral.email,
        status: referral.status,
        date: new Date(referral.created_at).toLocaleDateString(),
        earnings: parseFloat(String(referral.conversion_value || '0')),
        source: referral.source_platform
      }))

      // Calculate stats
      const totalClicks = processedLinks.reduce((sum, link) => sum + link.clicks, 0)
      const totalConversions = processedLinks.reduce((sum, link) => sum + link.conversions, 0)
      const totalEarnings = processedLinks.reduce((sum, link) => sum + link.earnings, 0)
      const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
      const activeLinks = processedLinks.filter(link => link.clicks > 0).length

      // Find top performing link
      const topPerformingLink = processedLinks.length > 0 
        ? processedLinks.reduce((top, current) => 
            current.conversions > (top?.conversions || 0) ? current : top
          )
        : null

      // Generate recent activity from referrals
      const recentActivityData: RecentActivity[] = processedReferrals
        .slice(0, 4)
        .map(referral => {
          const timeAgo = getTimeAgo(new Date(referral.date))
          let action = ""
          
          if (referral.status === "completed") {
            action = `Completed purchase - $${referral.earnings.toFixed(2)}`
          } else if (referral.status === "active") {
            action = `Signed up via your ${referral.source} link`
          } else {
            action = `Clicked your ${referral.source} link`
          }

          return {
            user: referral.user,
            action,
            time: timeAgo
          }
        })

      setStats({
        totalClicks,
        totalConversions,
        totalEarnings,
        conversionRate,
        activeLinks,
        topPerformingLink: topPerformingLink ? {
          title: topPerformingLink.title,
          conversions: topPerformingLink.conversions
        } : null
      })

      setLinks(processedLinks)
      setReferrals(processedReferrals)
      setRecentActivity(recentActivityData)

    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  return {
    stats,
    links,
    referrals,
    recentActivity,
    loading,
    error,
    refetch: fetchDashboardData
  }
} 