"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase, type ReferralAnalytics } from "@/lib/supabase"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'

interface ReferralAnalyticsProps {
  linkId: string
}

interface AnalyticsData {
  totalClicks: number
  totalConversions: number
  conversionRate: number
  totalEarnings: number
  clicksByDay: Array<{ date: string; clicks: number; conversions: number }>
  deviceBreakdown: Array<{ name: string; value: number; color: string }>
  browserBreakdown: Array<{ name: string; value: number; color: string }>
  topReferrers: Array<{ referrer: string; clicks: number }>
  recentActivity: ReferralAnalytics[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function ReferralAnalytics({ linkId }: ReferralAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('7d')

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
      const startDate = startOfDay(subDays(new Date(), days))
      const endDate = endOfDay(new Date())

      // Fetch analytics data
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('referral_analytics')
        .select('*')
        .eq('link_id', linkId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false })

      if (analyticsError) throw analyticsError

      // Process the data
      const clicks = analyticsData?.filter(item => item.event_type === 'click') || []
      const conversions = analyticsData?.filter(item => item.event_type === 'conversion') || []

      const totalClicks = clicks.length
      const totalConversions = conversions.length
      const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
      const totalEarnings = conversions.reduce((sum, conv) => sum + conv.conversion_value, 0)

      // Group by day
      const clicksByDay = Array.from({ length: days }, (_, i) => {
        const date = format(subDays(new Date(), days - 1 - i), 'MMM dd')
        const dayStart = startOfDay(subDays(new Date(), days - 1 - i))
        const dayEnd = endOfDay(subDays(new Date(), days - 1 - i))
        
        const dayClicks = clicks.filter(click => {
          const clickDate = new Date(click.created_at)
          return clickDate >= dayStart && clickDate <= dayEnd
        }).length

        const dayConversions = conversions.filter(conv => {
          const convDate = new Date(conv.created_at)
          return convDate >= dayStart && convDate <= dayEnd
        }).length

        return { date, clicks: dayClicks, conversions: dayConversions }
      })

      // Device breakdown
      const deviceCounts = clicks.reduce((acc, click) => {
        const device = click.device_type || 'Unknown'
        acc[device] = (acc[device] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const deviceBreakdown = Object.entries(deviceCounts).map(([name, value], index) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: COLORS[index % COLORS.length]
      }))

      // Browser breakdown
      const browserCounts = clicks.reduce((acc, click) => {
        const browser = click.browser || 'Unknown'
        acc[browser] = (acc[browser] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const browserBreakdown = Object.entries(browserCounts).map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }))

      // Top referrers
      const referrerCounts = clicks.reduce((acc, click) => {
        const referrer = click.referrer || 'Direct'
        const domain = referrer === 'Direct' ? 'Direct' : 
          referrer.includes('://') ? new URL(referrer).hostname : referrer
        acc[domain] = (acc[domain] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const topReferrers = Object.entries(referrerCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([referrer, clicks]) => ({ referrer, clicks }))

      setAnalytics({
        totalClicks,
        totalConversions,
        conversionRate,
        totalEarnings,
        clicksByDay,
        deviceBreakdown,
        browserBreakdown,
        topReferrers,
        recentActivity: analyticsData?.slice(0, 10) || []
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [linkId, timeRange])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-500">Error loading analytics: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground">No analytics data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Analytics</h3>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClicks.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalConversions.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalEarnings.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clicks & Conversions Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.clicksByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#8884d8" name="Clicks" />
                  <Bar dataKey="conversions" fill="#82ca9d" name="Conversions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Referrers</CardTitle>
              <CardDescription>Sources driving the most traffic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.topReferrers.map((referrer, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{referrer.referrer}</span>
                    <Badge variant="secondary">{referrer.clicks} clicks</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={analytics.deviceBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.deviceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Browsers</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={analytics.browserBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.browserBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest clicks and conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.recentActivity.map((activity, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={activity.event_type === 'click' ? 'default' : 'secondary'}>
                        {activity.event_type}
                      </Badge>
                      <div className="text-sm">
                        <div>{activity.device_type} • {activity.browser}</div>
                        <div className="text-muted-foreground">
                          {activity.country && `${activity.country} • `}
                          {format(new Date(activity.created_at), 'MMM dd, HH:mm')}
                        </div>
                      </div>
                    </div>
                    {activity.event_type === 'conversion' && activity.conversion_value > 0 && (
                      <div className="text-sm font-medium">
                        +${activity.conversion_value.toFixed(2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 