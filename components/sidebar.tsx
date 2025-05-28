"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  LinkIcon,
  Users,
  Settings,
  LayoutDashboard,
  Activity,
  Bot,
  Database,
  ChevronDown,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"

export function Sidebar() {
  const { profile, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const isAdmin = profile?.role === "admin"
  const isClient = profile?.role === "client"

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  const influencerNavItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      title: "My Links",
      href: "/links",
      icon: LinkIcon,
      active: pathname === "/links",
    },
    {
      title: "Referrals",
      href: "/referrals",
      icon: Users,
      active: pathname === "/referrals",
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: Activity,
      active: pathname === "/analytics",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ]

  const adminNavItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      title: "Clients",
      href: "/clients",
      icon: Users,
      active: pathname === "/clients",
    },
    {
      title: "Bots",
      href: "/bots",
      icon: Bot,
      active: pathname === "/bots",
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: Activity,
      active: pathname === "/analytics",
    },
    {
      title: "Onboarding Fields",
      href: "/onboarding",
      icon: Database,
      active: pathname === "/onboarding",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ]

  const clientNavItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: Activity,
      active: pathname === "/analytics",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ]

  const getNavItems = () => {
    if (isAdmin) return adminNavItems
    if (isClient) return clientNavItems
    return influencerNavItems
  }

  const navItems = getNavItems()

  return (
    <div className="h-screen flex flex-col border-r bg-background">
      {/* Logo and Brand */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="bg-black rounded-md p-2 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl">Virion Labs</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-auto py-6 px-3">
        <ul className="space-y-1.5">
          {navItems.map((item) => (
            <li key={item.title}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  item.active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 px-2 hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.full_name} />
                <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <span className="font-medium">{profile?.full_name}</span>
                <span className="text-xs text-muted-foreground capitalize">{profile?.role}</span>
              </div>
              <ChevronDown className="h-4 w-4 ml-auto opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <div className="flex flex-col">
                <span className="font-medium">{profile?.full_name}</span>
                <span className="text-xs text-muted-foreground">{profile?.email}</span>
                <span className="text-xs text-muted-foreground capitalize">{profile?.role}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
