import { DashboardLayout } from "@/components/dashboard-layout"
import { ClientDetailPage } from "@/components/client-detail-page"

interface ClientPageProps {
  params: {
    id: string
  }
}

export default function ClientPage({ params }: ClientPageProps) {
  return (
    <DashboardLayout>
      <ClientDetailPage clientId={params.id} />
    </DashboardLayout>
  )
} 