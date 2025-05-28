import { DashboardLayout } from "@/components/dashboard-layout"
import { BotsPage } from "@/components/bots-page"
import { ProtectedRoute } from "@/components/protected-route"

export default function Bots() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <BotsPage />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
