"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AnalyticsPage } from "@/components/analytics-page"
import { useAuth } from "@/components/auth-provider"

export default function Analytics() {
  const { profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && profile?.role === "influencer") {
      router.push("/")
    }
  }, [profile, loading, router])

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

  if (profile?.role === "influencer") {
    return null // Will redirect to dashboard
  }

  return (
    <DashboardLayout>
      <AnalyticsPage />
    </DashboardLayout>
  )
}
