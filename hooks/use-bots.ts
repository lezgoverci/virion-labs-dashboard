"use client"

import { useState, useEffect } from 'react'
import { supabase, type Bot, type BotInsert, type BotUpdate, type BotWithClient } from '@/lib/supabase'

export function useBots() {
  const [bots, setBots] = useState<BotWithClient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all bots with client information
  const fetchBots = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('bots')
        .select(`
          *,
          client:clients(id, name, industry)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setBots(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Add a new bot
  const addBot = async (botData: BotInsert) => {
    try {
      setError(null)
      
      const { data, error } = await supabase
        .from('bots')
        .insert([botData])
        .select(`
          *,
          client:clients(id, name, industry)
        `)
        .single()

      if (error) throw error
      
      if (data) {
        setBots(prev => [data, ...prev])
      }
      
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  // Update a bot
  const updateBot = async (id: string, updates: BotUpdate) => {
    try {
      setError(null)
      
      const { data, error } = await supabase
        .from('bots')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          client:clients(id, name, industry)
        `)
        .single()

      if (error) throw error
      
      if (data) {
        setBots(prev => prev.map(bot => 
          bot.id === id ? data : bot
        ))
      }
      
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  // Delete a bot
  const deleteBot = async (id: string) => {
    try {
      setError(null)
      
      const { error } = await supabase
        .from('bots')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setBots(prev => prev.filter(bot => bot.id !== id))
      
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  // Get a single bot by ID with client information
  const getBotById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('bots')
        .select(`
          *,
          client:clients(id, name, industry)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      return { data: null, error: errorMessage }
    }
  }

  // Get bots by client ID
  const getBotsByClientId = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('bots')
        .select(`
          *,
          client:clients(id, name, industry)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      return { data: data || [], error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      return { data: [], error: errorMessage }
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format last online time
  const formatLastOnline = (dateString: string | null) => {
    if (!dateString) return 'Never'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return formatDate(dateString)
  }

  // Get bot statistics
  const getStats = () => {
    const totalBots = bots.length
    const onlineBots = bots.filter(bot => bot.status === 'Online').length
    const totalServers = bots.reduce((sum, bot) => sum + (bot.servers || 0), 0)
    const totalUsers = bots.reduce((sum, bot) => sum + (bot.users || 0), 0)
    const totalCommands = bots.reduce((sum, bot) => sum + (bot.commands_used || 0), 0)
    const avgUptime = bots.length > 0 
      ? bots.reduce((sum, bot) => sum + (bot.uptime_percentage || 0), 0) / bots.length 
      : 0
    
    return {
      totalBots,
      onlineBots,
      totalServers,
      totalUsers,
      totalCommands,
      avgUptime,
      onlinePercentage: totalBots > 0 ? (onlineBots / totalBots) * 100 : 0,
      avgServersPerBot: totalBots > 0 ? totalServers / totalBots : 0,
      avgUsersPerBot: totalBots > 0 ? totalUsers / totalBots : 0
    }
  }

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Online':
        return 'default'
      case 'Offline':
        return 'destructive'
      case 'Maintenance':
        return 'secondary'
      case 'Error':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  useEffect(() => {
    fetchBots()
  }, [])

  return {
    bots,
    loading,
    error,
    addBot,
    updateBot,
    deleteBot,
    refreshBots: fetchBots,
    getBotById,
    getBotsByClientId,
    formatDate,
    formatLastOnline,
    getStats,
    getStatusVariant
  }
} 