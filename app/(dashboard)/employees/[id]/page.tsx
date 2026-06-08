import { EmployeeDetailView } from "@/components/crm/employee-detail-view"

type EmployeeDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function EmployeeDetailPage({
  params,
}: EmployeeDetailPageProps) {
  const { id } = await params
  return <EmployeeDetailView employeeId={id} />
}
