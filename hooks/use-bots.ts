"use client"

import { useState, useEffect } from 'react'

export interface Bot {
  id: string
  name: string
  client_id: string
  discord_bot_id?: string
  discord_token?: string
  status: 'Online' | 'Offline' | 'Maintenance' | 'Error'
  template: 'standard' | 'advanced' | 'custom'
  prefix?: string
  description?: string
  auto_deploy?: boolean
  servers?: number
  users?: number
  commands_used?: number
  uptime_percentage?: number
  last_online?: string | null
  avatar_url?: string
  invite_url?: string
  webhook_url?: string
  deployment_id?: string
  server_endpoint?: string
  created_at: string
  updated_at: string
  client?: {
    id: string
    name: string
    industry?: string
  }
}

export interface CreateBotData {
  name: string
  client_id: string
  template: 'standard' | 'advanced' | 'custom'
  prefix?: string
  description?: string
  auto_deploy?: boolean
  avatar_url?: string
  webhook_url?: string
}

export interface BotStats {
  totalBots: number
  onlineBots: number
  totalServers: number
  totalUsers: number
  totalCommands: number
  avgUptime: number
  onlinePercentage: number
  avgServersPerBot: number
  avgUsersPerBot: number
}

export function useBots(clientId?: string) {
  const [bots, setBots] = useState<Bot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBots = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const url = clientId ? `/api/bots?client_id=${clientId}` : '/api/bots'
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch bots')
      }
      
      const data = await response.json()
      setBots(data.bots || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bots')
    } finally {
      setLoading(false)
    }
  }

  const createBot = async (botData: CreateBotData): Promise<{ success: boolean; bot?: Bot; error?: string }> => {
    try {
      const response = await fetch('/api/bots/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(botData),
      })

      const result = await response.json()

      if (!response.ok) {
        return { success: false, error: result.error }
      }

      // Refresh the bot list
      await fetchBots()

      return { success: true, bot: result.bot }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create bot' 
      }
    }
  }

  const controlBot = async (botId: string, action: 'start' | 'stop' | 'restart'): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`/api/bots/${botId}/control`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      const result = await response.json()

      if (!response.ok) {
        return { success: false, error: result.error }
      }

      // Update the bot in local state
      setBots(prevBots => 
        prevBots.map(bot => 
          bot.id === botId ? { ...bot, ...result.bot } : bot
        )
      )

      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to control bot' 
      }
    }
  }

  const deleteBot = async (botId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`/api/bots/${botId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const result = await response.json()
        return { success: false, error: result.error }
      }

      // Remove the bot from local state
      setBots(prevBots => prevBots.filter(bot => bot.id !== botId))

      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete bot' 
      }
    }
  }

  const getBotsStats = async (): Promise<BotStats | null> => {
    try {
      const response = await fetch('/api/bots/stats')
      
      if (!response.ok) {
        throw new Error('Failed to fetch bot stats')
      }
      
      const data = await response.json()
      return data.stats
    } catch (err) {
      console.error('Error fetching bot stats:', err)
      return null
    }
  }

  useEffect(() => {
    fetchBots()
  }, [clientId])

  return {
    bots,
    loading,
    error,
    refreshBots: fetchBots,
    createBot,
    controlBot,
    deleteBot,
    getBotsStats
  }
} 