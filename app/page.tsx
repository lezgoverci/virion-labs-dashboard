"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BarChart3, Copy, ExternalLink, LinkIcon, Menu, QrCode, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MobileNav } from "@/components/mobile-nav"
import { useIsMobile } from "@/hooks/use-mobile"
import { DashboardLayout } from "@/components/dashboard-layout"
import { InfluencerDashboard } from "@/components/influencer-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { ClientDashboard } from "@/components/client-dashboard"
import { useAuth } from "@/components/auth-provider"

export default function Home() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null // Will redirect to login
  }

  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  )
}

function DashboardContent() {
  const { profile } = useAuth()

  if (!profile) return null

  switch (profile.role) {
    case "admin":
      return <AdminDashboard />
    case "client":
      return <ClientDashboard />
    case "influencer":
    default:
      return <InfluencerDashboard />
  }
}

function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <MobileNav />
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <BarChart3 className="h-6 w-6" />
            <span>Referral System</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">User profile</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, John 👋</h1>
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
                    <Input placeholder="Search links..." className="w-full sm:w-[300px]" />
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
      </main>
    </div>
  )
}

function GenerateLinkButton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Generate New Link</h3>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="platform">Platform</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="campaign">Campaign Name</Label>
          <Input id="campaign" placeholder="e.g., Summer Collection 2024" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Input id="description" placeholder="Brief description of the campaign" />
        </div>
        <Button className="w-full">
          <LinkIcon className="mr-2 h-4 w-4" />
          Generate Link
        </Button>
      </div>
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
