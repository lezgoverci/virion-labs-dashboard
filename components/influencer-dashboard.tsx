"use client"

import { useState } from "react"
import { LinkIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAccount } from "@/components/account-provider"
import { LinkGenerationForm } from "@/components/link-generation-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function InfluencerDashboard() {
  const { currentAccount } = useAccount()
  const [showLinkGenerator, setShowLinkGenerator] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {currentAccount?.name} 👋</h1>
          <p className="text-muted-foreground">Here's an overview of your referral performance.</p>
        </div>
        <Dialog open={showLinkGenerator} onOpenChange={setShowLinkGenerator}>
          <DialogTrigger asChild>
            <Button>
              <LinkIcon className="mr-2 h-4 w-4" />
              Generate New Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Generate Referral Link</DialogTitle>
              <DialogDescription>Create a new referral link for your content</DialogDescription>
            </DialogHeader>
            <LinkGenerationForm onComplete={() => setShowLinkGenerator(false)} />
          </DialogContent>
        </Dialog>
      </div>

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

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="links">Recent Links</TabsTrigger>
          <TabsTrigger value="referrals">Recent Referrals</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="rounded-full bg-muted p-2">
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {links.map((link, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="aspect-video w-full md:w-24 bg-muted rounded-md overflow-hidden">
                      <img
                        src={link.thumbnail || "/placeholder.svg"}
                        alt={link.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{link.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {link.platform} • {link.date}
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2">
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
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="referrals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {referrals.map((referral, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{referral.name}</div>
                      <div className="text-sm text-muted-foreground">{referral.email}</div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
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
                    <Button variant="outline" size="sm">
                      View
                    </Button>
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

import { User, Link, Clock } from "lucide-react"

const recentActivity = [
  {
    icon: User,
    title: "Sarah Johnson signed up",
    description: "Signed up through your YouTube link",
    time: "2 hours ago",
  },
  {
    icon: Link,
    title: "New link generated",
    description: "You created a new link for Instagram",
    time: "3 hours ago",
  },
  {
    icon: User,
    title: "Mike Peterson clicked your link",
    description: "Clicked your Instagram referral link",
    time: "5 hours ago",
  },
  {
    icon: User,
    title: "Emma Wilson joined Discord",
    description: "Joined Discord server through your link",
    time: "1 day ago",
  },
  {
    icon: Clock,
    title: "Weekly report available",
    description: "Your weekly performance report is ready",
    time: "1 day ago",
  },
]

const links = [
  {
    title: "Summer Haul Video",
    platform: "YouTube",
    date: "May 10, 2023",
    url: "https://ref.virionlabs.com/summer-haul",
    thumbnail: "/placeholder.svg?height=100&width=180",
    clicks: 450,
    conversions: 89,
    conversionRate: 19.8,
  },
  {
    title: "Product Review",
    platform: "Instagram",
    date: "April 28, 2023",
    url: "https://ref.virionlabs.com/product-review",
    thumbnail: "/placeholder.svg?height=100&width=180",
    clicks: 320,
    conversions: 65,
    conversionRate: 20.3,
  },
  {
    title: "Tutorial: Getting Started",
    platform: "TikTok",
    date: "April 15, 2023",
    url: "https://ref.virionlabs.com/tutorial",
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
