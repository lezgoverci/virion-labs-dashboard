"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { LogOut, Settings, Menu } from "lucide-react"

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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAccount } from "@/components/account-provider"
import { Sidebar } from "@/components/sidebar"

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { currentAccount, accounts, switchAccount } = useAccount()
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block md:w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b flex items-center justify-between px-4 lg:px-6 bg-background">
          <div className="flex items-center gap-2">
            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar />
              </SheetContent>
            </Sheet>

            <span className="font-medium">
              {currentAccount?.role === "admin" ? "Admin Dashboard" : "Influencer Dashboard"}
            </span>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src={currentAccount?.avatar || "/placeholder.svg"} alt={currentAccount?.name} />
                    <AvatarFallback>{currentAccount?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Switch Account</DropdownMenuLabel>
                {accounts.map((account) => (
                  <DropdownMenuItem
                    key={account.id}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => switchAccount(account.id)}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={account.avatar || "/placeholder.svg"} alt={account.name} />
                      <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span>{account.name}</span>
                      <span className="text-xs text-muted-foreground">{account.role}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 w-full max-w-none">{children}</main>
      </div>
    </div>
  )
}
