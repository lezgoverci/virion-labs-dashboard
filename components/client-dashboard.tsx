"use client"

import { RefreshCw, AlertCircle, TrendingUp, Users, Target, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { useClientData, type CampaignData, type InfluencerData } from "@/hooks/use-client-data"

export function ClientDashboard() {
  const { profile } = useAuth()
  const { stats, campaigns, topInfluencers, loading, error, refetch } = useClientData()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading client dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load client data: {error}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2"
              onClick={refetch}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {profile?.full_name} 👋</h1>
          <p className="text-muted-foreground">Here's an overview of your client analytics and performance.</p>
        </div>
        <Button variant="outline" size="sm" onClick={refetch}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">Active campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Influencers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeInfluencers}</div>
            <p className="text-xs text-muted-foreground">Working with you</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConversions}</div>
            <p className="text-xs text-muted-foreground">Successful referrals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.roi}%</div>
            <p className="text-xs text-muted-foreground">Return on investment</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {campaigns.length > 0 ? (
              <div className="space-y-4">
                {campaigns.map((campaign, index) => (
                  <CampaignCard key={index} campaign={campaign} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No campaigns found</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Influencers</CardTitle>
          </CardHeader>
          <CardContent>
            {topInfluencers.length > 0 ? (
              <div className="space-y-4">
                {topInfluencers.map((influencer, index) => (
                  <InfluencerCard key={index} influencer={influencer} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No influencer data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CampaignCard({ campaign }: { campaign: CampaignData }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{campaign.name}</p>
        <p className="text-sm text-muted-foreground">{campaign.platform}</p>
      </div>
      <div className="text-right">
        <p className="font-medium">${campaign.revenue.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">Revenue</p>
      </div>
    </div>
  )
}

function InfluencerCard({ influencer }: { influencer: InfluencerData }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{influencer.name}</p>
        <p className="text-sm text-muted-foreground">{influencer.handle}</p>
      </div>
      <div className="text-right">
        <p className="font-medium">{influencer.conversions} conversions</p>
        <p className="text-sm text-muted-foreground">This month</p>
      </div>
    </div>
  )
}
