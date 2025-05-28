"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: string[]
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  allowedRoles,
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.replace(redirectTo)
      return
    }

    // If user exists but no profile yet, wait for profile to load
    if (!loading && user && !profile) {
      // Profile is still loading, wait
      return
    }

    // If we have specific role requirements, check them
    if (!loading && user && profile && allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(profile.role)) {
        router.replace("/") // Redirect to dashboard if role not allowed
        return
      }
    }
  }, [user, profile, loading, router, allowedRoles, redirectTo])

  // Show loading state
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

  // If no user, don't render anything (will redirect)
  if (!user) {
    return null
  }

  // If user exists but no profile, show loading
  if (user && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  // If we have role requirements and user doesn't meet them, don't render
  if (allowedRoles && allowedRoles.length > 0 && profile && !allowedRoles.includes(profile.role)) {
    return null
  }

  // All checks passed, render children
  return <>{children}</>
} 