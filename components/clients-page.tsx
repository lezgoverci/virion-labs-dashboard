"use client"

import { useState } from "react"
import { Bot, Download, Plus, Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function ClientsPage() {
  const { profile } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showAddClient, setShowAddClient] = useState(false)

  const filteredClients = clients
    .filter((client) => {
      if (filterStatus !== "all" && client.status.toLowerCase() !== filterStatus) {
        return false
      }
      if (
        searchQuery &&
        !client.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !client.industry.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
      } else if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name)
      } else if (sortBy === "most-influencers") {
        return b.influencers - a.influencers
      }
      return 0
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage all your client brands and their influencers</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>Add a new client brand to the platform</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Client Name</Label>
                  <Input id="client-name" placeholder="Enter client name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-industry">Industry</Label>
                  <Select>
                    <SelectTrigger id="client-industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-website">Website</Label>
                  <Input id="client-website" placeholder="https://" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-contact">Primary Contact</Label>
                  <Input id="client-contact" placeholder="Contact name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-email">Contact Email</Label>
                  <Input id="client-email" type="email" placeholder="Email address" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddClient(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowAddClient(false)}>Add Client</Button>
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
            placeholder="Search clients..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="most-influencers">Most Influencers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Influencers</TableHead>
                    <TableHead>Bots</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={client.logo || "/placeholder.svg"} alt={client.name} />
                            <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{client.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{client.industry}</TableCell>
                      <TableCell>{client.influencers}</TableCell>
                      <TableCell>{client.bots}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            client.status === "Active"
                              ? "default"
                              : client.status === "Inactive"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{client.joinDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={client.logo || "/placeholder.svg"} alt={client.name} />
                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                    </div>
                    <Badge
                      variant={
                        client.status === "Active" ? "default" : client.status === "Inactive" ? "secondary" : "outline"
                      }
                    >
                      {client.status}
                    </Badge>
                  </div>
                  <CardDescription>{client.industry}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{client.influencers} Influencers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{client.bots} Bots</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Joined {client.joinDate}</div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.filter((client) => client.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">
              {((clients.filter((client) => client.status === "Active").length / clients.length) * 100).toFixed(1)}% of
              total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Influencers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.reduce((total, client) => total + client.influencers, 0)}</div>
            <p className="text-xs text-muted-foreground">
              {(clients.reduce((total, client) => total + client.influencers, 0) / clients.length).toFixed(1)} avg per
              client
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.reduce((total, client) => total + client.bots, 0)}</div>
            <p className="text-xs text-muted-foreground">
              {(clients.reduce((total, client) => total + client.bots, 0) / clients.length).toFixed(1)} avg per client
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const clients = [
  {
    name: "Gaming Community",
    industry: "Gaming",
    logo: "/placeholder.svg?height=40&width=40",
    influencers: 12,
    bots: 3,
    status: "Active",
    joinDate: "May 10, 2023",
  },
  {
    name: "Tech Startup",
    industry: "Technology",
    logo: "/placeholder.svg?height=40&width=40",
    influencers: 8,
    bots: 2,
    status: "Active",
    joinDate: "April 15, 2023",
  },
  {
    name: "Fashion Brand",
    industry: "Fashion",
    logo: "/placeholder.svg?height=40&width=40",
    influencers: 15,
    bots: 1,
    status: "Active",
    joinDate: "March 22, 2023",
  },
  {
    name: "Educational Platform",
    industry: "Education",
    logo: "/placeholder.svg?height=40&width=40",
    influencers: 6,
    bots: 2,
    status: "Inactive",
    joinDate: "February 8, 2023",
  },
  {
    name: "Entertainment Studio",
    industry: "Entertainment",
    logo: "/placeholder.svg?height=40&width=40",
    influencers: 10,
    bots: 2,
    status: "Active",
    joinDate: "January 15, 2023",
  },
  {
    name: "Fitness App",
    industry: "Health & Fitness",
    logo: "/placeholder.svg?height=40&width=40",
    influencers: 7,
    bots: 1,
    status: "Active",
    joinDate: "December 5, 2022",
  },
  {
    name: "Food Delivery",
    industry: "Food & Beverage",
    logo: "/placeholder.svg?height=40&width=40",
    influencers: 9,
    bots: 1,
    status: "Pending",
    joinDate: "May 1, 2023",
  },
  {
    name: "Travel Agency",
    industry: "Travel",
    logo: "/placeholder.svg?height=40&width=40",
    influencers: 5,
    bots: 1,
    status: "Inactive",
    joinDate: "November 12, 2022",
  },
]
