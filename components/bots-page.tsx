"use client"

import { useState } from "react"
import { Bot, Download, Plus, Search, Server, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

export function BotsPage() {
  const { profile } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterClient, setFilterClient] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showAddBot, setShowAddBot] = useState(false)

  const filteredBots = bots
    .filter((bot) => {
      if (filterStatus !== "all" && bot.status.toLowerCase() !== filterStatus.toLowerCase()) {
        return false
      }
      if (filterClient !== "all" && bot.client !== filterClient) {
        return false
      }
      if (searchQuery && !bot.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name)
      } else if (sortBy === "most-servers") {
        return b.servers - a.servers
      }
      return 0
    })

  const clientOptions = [...new Set(bots.map((bot) => bot.client))]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Discord Bots</h1>
          <p className="text-muted-foreground">Manage all your Discord bots across clients</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAddBot} onOpenChange={setShowAddBot}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Bot
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Bot</DialogTitle>
                <DialogDescription>Deploy a new Discord bot for a client</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="bot-name">Bot Name</Label>
                  <Input id="bot-name" placeholder="Enter bot name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bot-client">Client</Label>
                  <Select>
                    <SelectTrigger id="bot-client">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientOptions.map((client) => (
                        <SelectItem key={client} value={client}>
                          {client}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bot-template">Bot Template</Label>
                  <Select>
                    <SelectTrigger id="bot-template">
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Referral Bot</SelectItem>
                      <SelectItem value="advanced">Advanced Referral Bot</SelectItem>
                      <SelectItem value="custom">Custom Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bot-token">Discord Bot Token</Label>
                  <Input id="bot-token" placeholder="Enter Discord bot token" />
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="auto-deploy" />
                  <Label htmlFor="auto-deploy">Auto-deploy after creation</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddBot(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowAddBot(false)}>Create Bot</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bots..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={filterClient} onValueChange={setFilterClient}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {clientOptions.map((client) => (
                <SelectItem key={client} value={client}>
                  {client}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="most-servers">Most Servers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bot Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Servers</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBots.map((bot, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="font-medium">{bot.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{bot.client}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        bot.status === "Active" ? "default" : bot.status === "Offline" ? "destructive" : "secondary"
                      }
                    >
                      {bot.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{bot.servers}</TableCell>
                  <TableCell>{bot.users}</TableCell>
                  <TableCell>{bot.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Server className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bots.length}</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bots.filter((bot) => bot.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">
              {((bots.filter((bot) => bot.status === "Active").length / bots.length) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Servers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bots.reduce((total, bot) => total + bot.servers, 0)}</div>
            <p className="text-xs text-muted-foreground">
              {(bots.reduce((total, bot) => total + bot.servers, 0) / bots.length).toFixed(1)} avg per bot
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bots.reduce((total, bot) => total + bot.users, 0)}</div>
            <p className="text-xs text-muted-foreground">
              {(bots.reduce((total, bot) => total + bot.users, 0) / bots.length).toFixed(1)} avg per bot
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const bots = [
  {
    name: "GamingBot",
    client: "Gaming Community",
    status: "Active",
    servers: 12,
    users: 3450,
    createdAt: "May 10, 2023",
  },
  {
    name: "TechHelper",
    client: "Tech Startup",
    status: "Active",
    servers: 5,
    users: 1280,
    createdAt: "April 15, 2023",
  },
  {
    name: "FashionAssistant",
    client: "Fashion Brand",
    status: "Offline",
    servers: 8,
    users: 2100,
    createdAt: "March 22, 2023",
  },
  {
    name: "EduBot",
    client: "Educational Platform",
    status: "Active",
    servers: 3,
    users: 780,
    createdAt: "February 8, 2023",
  },
  {
    name: "EntertainmentBot",
    client: "Entertainment Studio",
    status: "Maintenance",
    servers: 7,
    users: 1850,
    createdAt: "January 15, 2023",
  },
  {
    name: "FitnessTracker",
    client: "Fitness App",
    status: "Active",
    servers: 4,
    users: 950,
    createdAt: "December 5, 2022",
  },
  {
    name: "FoodieBot",
    client: "Food Delivery",
    status: "Active",
    servers: 6,
    users: 1420,
    createdAt: "May 1, 2023",
  },
  {
    name: "TravelGuide",
    client: "Travel Agency",
    status: "Offline",
    servers: 2,
    users: 520,
    createdAt: "November 12, 2022",
  },
]
