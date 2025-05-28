"use client"

import { useState } from "react"
import { Copy, ExternalLink, LinkIcon, QrCode, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"

export function InfluencerDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const { profile } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {profile?.full_name} 👋</h1>
        <p className="text-muted-foreground">Here's an overview of your referral performance.</p>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="links">My Links</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">324</div>
                <p className="text-xs text-muted-foreground">+18% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">26.3%</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Performing Link</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium truncate">YouTube: Summer Haul</div>
                <p className="text-xs text-muted-foreground">89 conversions</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="rounded-full bg-muted p-2">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.user}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Average Time to Convert</div>
                    <div className="text-sm">2.4 days</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Most Active Platform</div>
                    <div className="text-sm">Instagram</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Active Links</div>
                    <div className="text-sm">12</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Total Earnings</div>
                    <div className="text-sm">$1,245.00</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="links" className="space-y-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Search links..." 
                  className="w-full sm:w-[300px]" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button>
                <LinkIcon className="mr-2 h-4 w-4" />
                Generate New Link
              </Button>
            </div>
            <div className="grid gap-4">
              {links.map((link, index) => (
                <LinkCard key={index} link={link} />
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="referrals" className="space-y-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Input placeholder="Search referrals..." className="w-full sm:w-[300px]" />
              </div>
              <Button variant="outline">Export Data</Button>
            </div>
            <div className="grid gap-4">
              {referrals.map((referral, index) => (
                <ReferralCard key={index} referral={referral} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface LinkData {
  id: string
  title: string
  url: string
  platform: string
  clicks: number
  conversions: number
  earnings: number
  created: string
}

function LinkCard({ link }: { link: LinkData }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium">{link.title}</h4>
            <p className="text-sm text-muted-foreground">{link.platform}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <QrCode className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold">{link.clicks}</div>
            <div className="text-xs text-muted-foreground">Clicks</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{link.conversions}</div>
            <div className="text-xs text-muted-foreground">Conversions</div>
          </div>
          <div>
            <div className="text-lg font-semibold">${link.earnings}</div>
            <div className="text-xs text-muted-foreground">Earnings</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ReferralData {
  id: string
  user: string
  email: string
  status: string
  date: string
  earnings: number
  source: string
}

function ReferralCard({ referral }: { referral: ReferralData }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium">{referral.user}</h4>
            <p className="text-sm text-muted-foreground">{referral.email}</p>
          </div>
          <div className="text-right space-y-1">
            <div className="text-sm font-medium">${referral.earnings}</div>
            <div className="text-xs text-muted-foreground">{referral.date}</div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{referral.status}</span>
          <span className="text-xs text-muted-foreground">{referral.source}</span>
        </div>
      </CardContent>
    </Card>
  )
}

const recentActivity = [
  { user: "Sarah Johnson", action: "Signed up via your Instagram link", time: "2 min ago" },
  { user: "Mike Chen", action: "Completed purchase - $45.99", time: "1 hour ago" },
  { user: "Emma Davis", action: "Clicked your YouTube link", time: "3 hours ago" },
  { user: "Alex Rodriguez", action: "Signed up via your TikTok link", time: "5 hours ago" },
]

const links = [
  {
    id: "1",
    title: "Summer Collection Launch",
    url: "https://example.com/ref/summer2024",
    platform: "Instagram",
    clicks: 1234,
    conversions: 89,
    earnings: 445.50,
    created: "2024-01-15",
  },
  {
    id: "2",
    title: "YouTube Product Review",
    url: "https://example.com/ref/youtube-review",
    platform: "YouTube",
    clicks: 856,
    conversions: 67,
    earnings: 335.25,
    created: "2024-01-12",
  },
]

const referrals = [
  {
    id: "1",
    user: "Sarah Johnson",
    email: "sarah@example.com",
    status: "Active",
    date: "2024-01-15",
    earnings: 25.00,
    source: "Instagram",
  },
  {
    id: "2",
    user: "Mike Chen",
    email: "mike@example.com",
    status: "Completed",
    date: "2024-01-14",
    earnings: 45.99,
    source: "YouTube",
  },
]
