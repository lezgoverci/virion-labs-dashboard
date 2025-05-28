import { DashboardLayout } from "@/components/dashboard-layout"
import { BotDetailPage } from "@/components/bot-detail-page"

interface BotPageProps {
  params: {
    id: string
  }
  searchParams: {
    edit?: string
  }
}

export default function BotPage({ params, searchParams }: BotPageProps) {
  const isEditMode = searchParams.edit === 'true'
  
  return (
    <DashboardLayout>
      <BotDetailPage botId={params.id} initialEditMode={isEditMode} />
    </DashboardLayout>
  )
} 