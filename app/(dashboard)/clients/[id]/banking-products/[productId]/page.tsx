import { ClientBankingProductDetailView } from "@/components/crm/client-banking-product-detail-view"

type ClientBankingProductDetailPageProps = {
  params: Promise<{ id: string; productId: string }>
}

export default async function ClientBankingProductDetailPage({
  params,
}: ClientBankingProductDetailPageProps) {
  const { id, productId } = await params
  return (
    <ClientBankingProductDetailView clientId={id} productId={productId} />
  )
}
