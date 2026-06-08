import { LockIcon } from "lucide-react"

export function AnalyticsWidgetRestricted() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-lg bg-background/80 backdrop-blur-sm">
      <LockIcon className="text-muted-foreground" aria-hidden />
      <p className="text-sm font-medium text-muted-foreground">
        Ograniczony dostęp
      </p>
    </div>
  )
}
