"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export interface AdminStats {
  totalClients: number
  totalBots: number
  totalActiveUsers: number
  mostActiveServer: {
    name: string
    users: number
  } | null
}

export interface ClientData {
  id: string
  name: string
  bots: number
  influencers: number
  lastActive: string
  status: string
}

export interface BotData {
  id: string
  name: string
  client: string
  status: string
  servers: number
}

export interface AdminActivity {
  icon: any
  title: string
  description: string
  time: string
}

export function useAdminData() {
  const [stats, setStats] = useState<AdminStats>({
    totalClients: 0,
    totalBots: 0,
    totalActiveUsers: 0,
    mostActiveServer: null
  })
  const [clients, setClients] = useState<ClientData[]>([])
  const [bots, setBots] = useState<BotData[]>([])
  const [adminActivity, setAdminActivity] = useState<AdminActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch clients data
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (clientsError) throw clientsError

      // Fetch bots data with client information
      const { data: botsData, error: botsError } = await supabase
        .from('bots')
        .select(`
          *,
          clients!inner(name)
        `)
        .order('created_at', { ascending: false })

      if (botsError) throw botsError

      // Fetch user profiles for total active users
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('id, role, created_at')

      if (usersError) throw usersError

      // Process clients data
      const processedClients: ClientData[] = (clientsData || []).map(client => ({
        id: client.id,
        name: client.name,
        bots: client.bots || 0,
        influencers: client.influencers || 0,
        lastActive: getTimeAgo(new Date(client.updated_at || client.created_at || new Date())),
        status: client.status
      }))

      // Process bots data
      const processedBots: BotData[] = (botsData || []).map(bot => ({
        id: bot.id,
        name: bot.name,
        client: bot.clients?.name || 'Unknown',
        status: bot.status === 'Online' ? 'Active' : bot.status,
        servers: bot.servers || 0
      }))

      // Calculate stats
      const totalClients = processedClients.length
      const totalBots = processedBots.length
      const totalActiveUsers = (usersData || []).length

      // Find most active server (mock for now since we don't have server data)
      const mostActiveServer = totalBots > 0 ? {
        name: "Gaming Community",
        users: 324
      } : null

      // Generate admin activity (mock recent activity based on real data)
      const recentActivity: AdminActivity[] = [
        {
          icon: null, // Will be set in component
          title: "New bot deployed",
          description: processedBots.length > 0 ? `${processedBots[0].name} was deployed to ${processedBots[0].client}` : "No recent bot deployments",
          time: "2 hours ago"
        },
        {
          icon: null,
          title: "New client added",
          description: processedClients.length > 0 ? `${processedClients[0].name} was added to the platform` : "No recent client additions",
          time: "1 day ago"
        },
        {
          icon: null,
          title: "Server joined",
          description: "Bot joined a new Discord server",
          time: "3 hours ago"
        },
        {
          icon: null,
          title: "Bot template updated",
          description: "Default welcome message was updated",
          time: "5 hours ago"
        }
      ]

      setStats({
        totalClients,
        totalBots,
        totalActiveUsers,
        mostActiveServer
      })

      setClients(processedClients)
      setBots(processedBots)
      setAdminActivity(recentActivity)

    } catch (err) {
      console.error('Error fetching admin data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch admin data')
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
    clients,
    bots,
    adminActivity,
    loading,
    error,
    refetch: fetchAdminData
  }
} 