import { CompanyDetailView } from "@/components/crm/company-detail-view"

type ClientDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = await params
  return <CompanyDetailView clientId={id} />
}
