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
    // Only redirect if we're certain about the auth state (not loading)
    if (!loading) {
      if (!user) {
        console.log('🛡️ ProtectedRoute: No user detected, redirecting to login')
        router.replace(redirectTo)
        return
      }

      // Check role requirements only if we have both user and profile
      if (user && profile && allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(profile.role)) {
          console.log('🛡️ ProtectedRoute: Role not allowed, redirecting')
          router.replace("/")
          return
        }
      }
    }
  }, [user, profile, loading, router, allowedRoles, redirectTo])

  // Always render children immediately - no more blocking loading screens!
  // Auth redirects happen in the background via useEffect
  console.log('🛡️ ProtectedRoute: Rendering children immediately (non-blocking)')
  return <>{children}</>
} 