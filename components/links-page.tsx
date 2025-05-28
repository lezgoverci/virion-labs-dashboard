"use client"

import { useState } from "react"
import { Copy, ExternalLink, QrCode, Search, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { LinkGenerationForm } from "@/components/link-generation-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function LinksPage() {
  const { profile } = useAuth()
  const [showLinkGenerator, setShowLinkGenerator] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPlatform, setFilterPlatform] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const filteredLinks = links
    .filter((link) => {
      if (filterPlatform !== "all" && link.platform.toLowerCase() !== filterPlatform) {
        return false
      }
      if (searchQuery && !link.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortBy === "most-clicks") {
        return b.clicks - a.clicks
      } else if (sortBy === "most-conversions") {
        return b.conversions - a.conversions
      } else if (sortBy === "highest-rate") {
        return b.conversionRate - a.conversionRate
      }
      return 0
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Links</h1>
          <p className="text-muted-foreground">Manage and track all your referral links</p>
        </div>
        <Dialog open={showLinkGenerator} onOpenChange={setShowLinkGenerator}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Link
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

      <Tabs defaultValue="active" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TabsList>
            <TabsTrigger value="active">Active Links</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search links..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="most-clicks">Most Clicks</SelectItem>
                <SelectItem value="most-conversions">Most Conversions</SelectItem>
                <SelectItem value="highest-rate">Highest Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="active" className="space-y-4">
          {filteredLinks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No links found matching your criteria</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredLinks.map((link, index) => (
                <LinkCard key={index} link={link} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          <div className="text-center py-10">
            <p className="text-muted-foreground">No archived links</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
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
              <div className="flex-1 flex justify-end gap-2">
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
        </div>
      </CardContent>
    </Card>
  )
}

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
  {
    title: "New Gaming Setup",
    platform: "YouTube",
    date: "March 22, 2023",
    url: "https://ref.virionlabs.com/gaming-setup",
    thumbnail: "/placeholder.svg?height=100&width=180",
    clicks: 520,
    conversions: 95,
    conversionRate: 18.3,
  },
  {
    title: "Fashion Week Highlights",
    platform: "Instagram",
    date: "March 15, 2023",
    url: "https://ref.virionlabs.com/fashion-week",
    thumbnail: "/placeholder.svg?height=100&width=180",
    clicks: 380,
    conversions: 72,
    conversionRate: 18.9,
  },
]
