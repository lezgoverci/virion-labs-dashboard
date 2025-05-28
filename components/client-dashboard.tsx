"use client"

import { useAccount } from "@/components/account-provider"
import { InfluencerDashboard } from "@/components/influencer-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"

export function ClientDashboard() {
  const { currentAccount } = useAccount()

  if (currentAccount?.role === "admin") {
    return <AdminDashboard />
  }

  return <InfluencerDashboard />
}
