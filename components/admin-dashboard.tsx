"use client"

import { Bot, Server, User, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"

export function AdminDashboard() {
  const { profile } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {profile?.full_name} 👋</h1>
        <p className="text-muted-foreground">Here's an overview of all activity across clients.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bots Deployed</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Active Server</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium truncate">Gaming Community</div>
            <p className="text-xs text-muted-foreground">324 new users this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for managing the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Create New Bot</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-xs text-muted-foreground">Deploy a new Discord bot for a client</p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" className="w-full">
                    Create Bot
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Create New Client</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-xs text-muted-foreground">Add a new brand to the platform</p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" className="w-full">
                    Create Client
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Configure Bot Template</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-xs text-muted-foreground">Edit default bot settings and messages</p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" className="w-full">
                    Configure
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current platform health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">API Status</div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <div className="text-sm">Operational</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Discord Integration</div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <div className="text-sm">Operational</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Database</div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <div className="text-sm">Operational</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Webhook Delivery</div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="text-sm">Degraded</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="clients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clients">Recent Clients</TabsTrigger>
          <TabsTrigger value="bots">Recent Bots</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients.map((client, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {client.bots} bots • {client.influencers} influencers
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Last active: {client.lastActive}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Assign Bot
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bots.map((bot, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{bot.name}</div>
                      <div className="text-sm text-muted-foreground">Client: {bot.client}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${bot.status === "Active" ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      <div className="text-sm">{bot.status}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{bot.servers} servers</div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminActivity.map((activity, index) => (
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
      </Tabs>
    </div>
  )
}

import { BotIcon, ServerIcon, UserIcon, SettingsIcon } from "lucide-react"

const clients = [
  {
    name: "Gaming Community",
    bots: 3,
    influencers: 12,
    lastActive: "2 hours ago",
  },
  {
    name: "Tech Startup",
    bots: 2,
    influencers: 8,
    lastActive: "1 day ago",
  },
  {
    name: "Fashion Brand",
    bots: 1,
    influencers: 15,
    lastActive: "3 hours ago",
  },
  {
    name: "Educational Platform",
    bots: 2,
    influencers: 6,
    lastActive: "5 hours ago",
  },
]

const bots = [
  {
    name: "GamingBot",
    client: "Gaming Community",
    status: "Active",
    servers: 12,
  },
  {
    name: "TechHelper",
    client: "Tech Startup",
    status: "Active",
    servers: 5,
  },
  {
    name: "FashionAssistant",
    client: "Fashion Brand",
    status: "Offline",
    servers: 8,
  },
  {
    name: "EduBot",
    client: "Educational Platform",
    status: "Active",
    servers: 3,
  },
]

const adminActivity = [
  {
    icon: BotIcon,
    title: "New bot deployed",
    description: "GamingBot was deployed to Gaming Community",
    time: "2 hours ago",
  },
  {
    icon: UserIcon,
    title: "New client added",
    description: "Tech Startup was added to the platform",
    time: "1 day ago",
  },
  {
    icon: ServerIcon,
    title: "Server joined",
    description: "GamingBot joined a new Discord server",
    time: "3 hours ago",
  },
  {
    icon: SettingsIcon,
    title: "Bot template updated",
    description: "Default welcome message was updated",
    time: "5 hours ago",
  },
]
