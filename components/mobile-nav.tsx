"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, LinkIcon, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-2 mt-4">
      <Button asChild variant={pathname === "/" ? "default" : "ghost"} className="justify-start">
        <Link href="/">
          <BarChart3 className="mr-2 h-5 w-5" />
          Dashboard
        </Link>
      </Button>
      <Button asChild variant={pathname === "/links" ? "default" : "ghost"} className="justify-start">
        <Link href="/links">
          <LinkIcon className="mr-2 h-5 w-5" />
          My Links
        </Link>
      </Button>
      <Button asChild variant={pathname === "/referrals" ? "default" : "ghost"} className="justify-start">
        <Link href="/referrals">
          <Users className="mr-2 h-5 w-5" />
          Referrals
        </Link>
      </Button>
    </div>
  )
}
