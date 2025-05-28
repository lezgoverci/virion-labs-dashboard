"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { InfluencerDashboard } from "@/components/influencer-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { ClientDashboard } from "@/components/client-dashboard"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"

export default function Home() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const { profile } = useAuth()

  if (!profile) return null

  switch (profile.role) {
    case "admin":
      return <AdminDashboard />
    case "client":
      return <ClientDashboard />
    case "influencer":
    default:
      return <InfluencerDashboard />
  }
}
