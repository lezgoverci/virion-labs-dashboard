"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { DashboardLayout } from "@/components/dashboard-layout"
import { InfluencerDashboard } from "@/components/influencer-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { ClientDashboard } from "@/components/client-dashboard"
import { useAuth } from "@/components/auth-provider"

export default function Home() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null // Will redirect to login
  }

  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
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
