import { LeadDetailView } from "@/components/crm/lead-detail-view"

type LeadDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params
  return <LeadDetailView leadId={id} />
}
