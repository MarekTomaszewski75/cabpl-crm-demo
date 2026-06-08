import { DealDetailView } from "@/components/crm/deal-detail-view"

type DealDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function DealDetailPage({ params }: DealDetailPageProps) {
  const { id } = await params
  return <DealDetailView dealId={id} />
}

