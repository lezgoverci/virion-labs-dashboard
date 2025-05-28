"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"

export function ClientDashboard() {
  const { profile } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {profile?.full_name} 👋</h1>
        <p className="text-muted-foreground">Here's an overview of your client analytics and performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Influencers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+8 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">324%</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Summer Collection 2024</p>
                  <p className="text-sm text-muted-foreground">Instagram Campaign</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$12,450</p>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Product Launch</p>
                  <p className="text-sm text-muted-foreground">YouTube Campaign</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$8,920</p>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Brand Awareness</p>
                  <p className="text-sm text-muted-foreground">TikTok Campaign</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$5,680</p>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Influencers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">@sarahj_lifestyle</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">89 conversions</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mike Chen</p>
                  <p className="text-sm text-muted-foreground">@miketech</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">67 conversions</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Emma Davis</p>
                  <p className="text-sm text-muted-foreground">@emmafashion</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">54 conversions</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
