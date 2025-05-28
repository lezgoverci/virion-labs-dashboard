"use client"

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
import { useMobile } from "@/hooks/use-mobile"
import { DashboardLayout } from "@/components/dashboard-layout"
import { InfluencerDashboard } from "@/components/influencer-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { useAccount } from "@/components/account-provider"

export default function Home() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  )
}

function DashboardContent() {
  "use client"

  const { currentAccount } = useAccount()

  if (currentAccount?.role === "admin") {
    return <AdminDashboard />
  }

  return <InfluencerDashboard />
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
      <GenerateLinkButton />
    </div>
  )
}

function GenerateLinkButton() {
  const isMobile = useMobile()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className={`${isMobile ? "fixed bottom-4 right-4 shadow-lg rounded-full" : "hidden"}`} size="icon">
          <LinkIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[400px] sm:h-[500px] rounded-t-xl">
        <SheetHeader>
          <SheetTitle>Generate Referral Link</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="content-url">Content URL</Label>
            <Input id="content-url" placeholder="Paste your content/video URL" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select>
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input id="description" placeholder="Add a description for this link" />
          </div>
          <Button className="w-full">Generate Link</Button>
          <div className="border rounded-md p-4 mt-4">
            <div className="text-sm font-medium mb-2">Your referral link</div>
            <div className="flex items-center gap-2 mb-4">
              <Input value="https://ref.example.com/j8f92h" readOnly />
              <Button variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" size="sm">
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function LinkCard({ link }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid gap-4 md:grid-cols-[100px_1fr] items-start">
          <div className="aspect-video bg-muted rounded-md overflow-hidden">
            <img src={link.thumbnail || "/placeholder.svg"} alt={link.title} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h3 className="font-medium">{link.title}</h3>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">{link.platform}</div>
                <div className="text-sm text-muted-foreground">•</div>
                <div className="text-sm text-muted-foreground">{link.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input value={link.url} readOnly className="text-xs" />
              <Button variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="font-medium">{link.clicks}</span> clicks
                </div>
                <div className="text-sm">
                  <span className="font-medium">{link.conversions}</span> conversions
                </div>
                <div className="text-sm">
                  <span className="font-medium">{link.conversionRate}%</span> rate
                </div>
              </div>
              <div className="flex-1 flex justify-end">
                <Button variant="outline" size="sm">
                  View Referrals
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ReferralCard({ referral }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="font-medium">{referral.name}</div>
            <div className="text-sm text-muted-foreground">{referral.email}</div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="text-sm">
              <span className="font-medium">Age:</span> {referral.age}
            </div>
            <div className="text-sm">
              <span className="font-medium">Discord:</span> {referral.discordId}
            </div>
            <div className="text-sm">
              <span className="font-medium">Joined:</span> {referral.date}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const recentActivity = [
  {
    user: "Sarah Johnson",
    action: "signed up through your YouTube link",
    time: "2 hours ago",
  },
  {
    user: "Mike Peterson",
    action: "clicked your Instagram referral link",
    time: "5 hours ago",
  },
  {
    user: "Emma Wilson",
    action: "joined Discord server through your link",
    time: "1 day ago",
  },
  {
    user: "Alex Thompson",
    action: "signed up through your TikTok link",
    time: "2 days ago",
  },
]

const links = [
  {
    title: "Summer Haul Video",
    platform: "YouTube",
    date: "May 10, 2023",
    url: "https://ref.example.com/summer-haul",
    thumbnail: "/placeholder.svg?height=100&width=180",
    clicks: 450,
    conversions: 89,
    conversionRate: 19.8,
  },
  {
    title: "Product Review",
    platform: "Instagram",
    date: "April 28, 2023",
    url: "https://ref.example.com/product-review",
    thumbnail: "/placeholder.svg?height=100&width=180",
    clicks: 320,
    conversions: 65,
    conversionRate: 20.3,
  },
  {
    title: "Tutorial: Getting Started",
    platform: "TikTok",
    date: "April 15, 2023",
    url: "https://ref.example.com/tutorial",
    thumbnail: "/placeholder.svg?height=100&width=180",
    clicks: 280,
    conversions: 42,
    conversionRate: 15.0,
  },
]

const referrals = [
  {
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    age: 24,
    discordId: "sarah#1234",
    date: "May 12, 2023",
  },
  {
    name: "Mike Peterson",
    email: "mike.p@example.com",
    age: 31,
    discordId: "mikep#5678",
    date: "May 10, 2023",
  },
  {
    name: "Emma Wilson",
    email: "emma.w@example.com",
    age: 28,
    discordId: "emmaw#9012",
    date: "May 8, 2023",
  },
]
