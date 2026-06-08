import { CrmAppShell } from "@/components/crm/crm-app-shell"
import { SessionAuthGuard } from "@/components/crm/session-auth-guard"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SessionAuthGuard>
      <CrmAppShell>{children}</CrmAppShell>
    </SessionAuthGuard>
  )
}
