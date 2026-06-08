import { AnalyticsRoleGuard } from "@/components/crm/analytics-role-guard"
import { AnalyticsWorkspace } from "@/components/crm/analytics-workspace"

export default function AnalyticsDashboardPage() {
  return (
    <AnalyticsRoleGuard>
      <AnalyticsWorkspace />
    </AnalyticsRoleGuard>
  )
}
