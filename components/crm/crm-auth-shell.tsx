import { CreditAgricoleLogo } from "@/components/crm/credit-agricole-logo"
import { cn } from "@/lib/utils"

type CrmAuthShellProps = {
  children: React.ReactNode
  className?: string
  headerAction?: React.ReactNode
}

export function CrmAuthShell({
  children,
  className,
  headerAction,
}: CrmAuthShellProps) {
  return (
    <div className={cn("flex min-h-dvh flex-col bg-ca-shell", className)}>
      <header className="flex items-center justify-between px-6 py-5 lg:px-10">
        <CreditAgricoleLogo />
        {headerAction}
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-8 lg:px-10">
        {children}
      </main>
    </div>
  )
}
