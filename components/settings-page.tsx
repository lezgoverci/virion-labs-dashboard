"use client"

import { useState } from "react"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SettingsPage() {
  const { profile } = useAuth()
  const isAdmin = profile?.role === "admin"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {isAdmin && <TabsTrigger value="api">API Keys</TabsTrigger>}
          {isAdmin && <TabsTrigger value="team">Team</TabsTrigger>}
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <AccountSettings />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettings />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="api" className="space-y-4">
            <ApiSettings />
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="team" className="space-y-4">
            <TeamSettings />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

function ProfileSettings() {
  const { profile } = useAuth()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.full_name} />
            <AvatarFallback>{profile?.full_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm">
              Change Avatar
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={profile?.full_name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={profile?.email} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" defaultValue={profile?.full_name?.toLowerCase().replace(" ", "")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="Enter your phone number" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" placeholder="Tell us about yourself" className="min-h-[100px]" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input id="twitter" placeholder="@username" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" placeholder="@username" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtube">YouTube</Label>
            <Input id="youtube" placeholder="Channel URL" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discord">Discord</Label>
            <Input id="discord" placeholder="Username#0000" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  )
}

function AccountSettings() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Update Password</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Two-Factor Authentication</div>
              <div className="text-sm text-muted-foreground">Secure your account with 2FA</div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>Permanently delete your account and all data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Once you delete your account, there is no going back. Please be certain.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="destructive">Delete Account</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to be notified</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">New Referral</div>
              <div className="text-sm text-muted-foreground">When someone signs up through your link</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch id="email-referral" />
                <Label htmlFor="email-referral">Email</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="push-referral" />
                <Label htmlFor="push-referral">Push</Label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Link Clicks</div>
              <div className="text-sm text-muted-foreground">When someone clicks on your referral link</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch id="email-clicks" />
                <Label htmlFor="email-clicks">Email</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="push-clicks" />
                <Label htmlFor="push-clicks">Push</Label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Weekly Reports</div>
              <div className="text-sm text-muted-foreground">Weekly summary of your referral activity</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch id="email-reports" defaultChecked />
                <Label htmlFor="email-reports">Email</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="push-reports" />
                <Label htmlFor="push-reports">Push</Label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Product Updates</div>
              <div className="text-sm text-muted-foreground">News about product and feature updates</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch id="email-updates" defaultChecked />
                <Label htmlFor="email-updates">Email</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="push-updates" />
                <Label htmlFor="push-updates">Push</Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  )
}

function ApiSettings() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your API keys for external integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="font-medium">Live API Key</div>
              <div className="flex items-center gap-2">
                <Input value="sk_live_51Hb9ksJHMXNjV0xj3..." type="password" readOnly />
                <Button variant="outline" size="sm">
                  Copy
                </Button>
                <Button variant="outline" size="sm">
                  Show
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-medium">Test API Key</div>
              <div className="flex items-center gap-2">
                <Input value="sk_test_51Hb9ksJHMXNjV0xj3..." type="password" readOnly />
                <Button variant="outline" size="sm">
                  Copy
                </Button>
                <Button variant="outline" size="sm">
                  Show
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Regenerate Keys</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhook Endpoints</CardTitle>
          <CardDescription>Configure webhook endpoints for real-time updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input id="webhook-url" placeholder="https://your-server.com/webhook" />
          </div>
          <div className="space-y-4">
            <div className="font-medium">Events to send</div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Switch id="event-signup" defaultChecked />
                <Label htmlFor="event-signup">User Signup</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="event-click" defaultChecked />
                <Label htmlFor="event-click">Link Click</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="event-conversion" defaultChecked />
                <Label htmlFor="event-conversion">Conversion</Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Webhook Settings</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function TeamSettings() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your team and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt="Admin User" />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Admin User</div>
                  <div className="text-sm text-muted-foreground">admin@virionlabs.com</div>
                </div>
              </div>
              <div className="text-sm font-medium">Owner</div>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt="Sarah Johnson" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Sarah Johnson</div>
                  <div className="text-sm text-muted-foreground">sarah@virionlabs.com</div>
                </div>
              </div>
              <div className="text-sm font-medium">Admin</div>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt="Mike Peterson" />
                  <AvatarFallback>MP</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Mike Peterson</div>
                  <div className="text-sm text-muted-foreground">mike@virionlabs.com</div>
                </div>
              </div>
              <div className="text-sm font-medium">Support</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt="Emma Wilson" />
                  <AvatarFallback>EW</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Emma Wilson</div>
                  <div className="text-sm text-muted-foreground">emma@virionlabs.com</div>
                </div>
              </div>
              <div className="text-sm font-medium">Support</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Invite Team Member</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
          <CardDescription>Configure roles and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <div className="font-medium">Admin</div>
                <div className="text-sm text-muted-foreground">Full access to all settings and features</div>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <div className="font-medium">Support</div>
                <div className="text-sm text-muted-foreground">Can view and manage user data and referrals</div>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Viewer</div>
                <div className="text-sm text-muted-foreground">Can only view data, no edit permissions</div>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Create New Role</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
