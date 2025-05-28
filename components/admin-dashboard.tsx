"use client"

import { Bot, Server, User, Users, RefreshCw, AlertCircle, BotIcon, ServerIcon, UserIcon, SettingsIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { useAdminData, type ClientData, type BotData } from "@/hooks/use-admin-data"

export function AdminDashboard() {
  const { profile } = useAuth()
  const { stats, clients, bots, adminActivity, loading, error, refetch } = useAdminData()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
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
            Failed to load admin data: {error}
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
          <p className="text-muted-foreground">Here's an overview of all activity across clients.</p>
        </div>
        <Button variant="outline" size="sm" onClick={refetch}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">Active clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bots Deployed</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBots}</div>
            <p className="text-xs text-muted-foreground">Across all clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActiveUsers}</div>
            <p className="text-xs text-muted-foreground">Platform users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Active Server</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.mostActiveServer ? (
              <>
                <div className="text-sm font-medium truncate">{stats.mostActiveServer.name}</div>
                <p className="text-xs text-muted-foreground">{stats.mostActiveServer.users} new users this month</p>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No active servers</div>
            )}
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
          <TabsTrigger value="clients">Recent Clients ({clients.length})</TabsTrigger>
          <TabsTrigger value="bots">Recent Bots ({bots.length})</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Clients</CardTitle>
            </CardHeader>
            <CardContent>
              {clients.length > 0 ? (
                <div className="space-y-4">
                  {clients.map((client) => (
                    <ClientCard key={client.id} client={client} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No clients found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bots</CardTitle>
            </CardHeader>
            <CardContent>
              {bots.length > 0 ? (
                <div className="space-y-4">
                  {bots.map((bot) => (
                    <BotCard key={bot.id} bot={bot} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No bots found</p>
                </div>
              )}
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
                      {getActivityIcon(activity.title)}
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

function ClientCard({ client }: { client: ClientData }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
      <div className="flex-1">
        <div className="font-medium">{client.name}</div>
        <div className="text-sm text-muted-foreground">
          {client.bots} bots • {client.influencers} influencers
        </div>
      </div>
      <div className="text-sm text-muted-foreground">Last active: {client.lastActive}</div>
      <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(client.status)}`}>
        {client.status}
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          View
        </Button>
        <Button variant="outline" size="sm">
          Assign Bot
        </Button>
      </div>
    </div>
  )
}

function BotCard({ bot }: { bot: BotData }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'online':
        return 'bg-green-500'
      case 'offline':
        return 'bg-red-500'
      case 'maintenance':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
      <div className="flex-1">
        <div className="font-medium">{bot.name}</div>
        <div className="text-sm text-muted-foreground">Client: {bot.client}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${getStatusColor(bot.status)}`}></div>
        <div className="text-sm">{bot.status}</div>
      </div>
      <div className="text-sm text-muted-foreground">{bot.servers} servers</div>
      <Button variant="outline" size="sm">
        Manage
      </Button>
    </div>
  )
}

function getActivityIcon(title: string) {
  if (title.includes('bot')) return <BotIcon className="h-4 w-4" />
  if (title.includes('client')) return <UserIcon className="h-4 w-4" />
  if (title.includes('server')) return <ServerIcon className="h-4 w-4" />
  if (title.includes('template')) return <SettingsIcon className="h-4 w-4" />
  return <UserIcon className="h-4 w-4" />
}
