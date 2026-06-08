import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrencyPln } from "@/lib/format/pl"
import { cn } from "@/lib/utils"

type KpiCardProps = {
  title: string
  description?: string
  value: string
  badge?: string
  progressPercent?: number
  highlight?: boolean
  className?: string
}

export function KpiCard({
  title,
  description,
  value,
  badge,
  progressPercent,
  highlight,
  className,
}: KpiCardProps) {
  return (
    <Card
      size="sm"
      className={cn(
        highlight && "border-primary/25 bg-primary/5",
        className
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{title}</CardTitle>
          {badge ? <Badge variant="secondary">{badge}</Badge> : null}
        </div>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-2xl font-semibold tabular-nums tracking-tight">
          {value}
        </p>
        {progressPercent !== undefined ? (
          <Progress value={progressPercent} className="h-2" />
        ) : null}
      </CardContent>
    </Card>
  )
}

type KpiPlanActualCardProps = {
  title: string
  description: string
  planPln: number
  actualPln: number
  realizationPercent: number
  timeLabel: string
}

export function KpiPlanActualCard({
  title,
  description,
  actualPln,
  realizationPercent,
  timeLabel,
}: KpiPlanActualCardProps) {
  return (
    <KpiCard
      title={title}
      description={description}
      value={formatCurrencyPln(actualPln)}
      badge={`${realizationPercent}% · ${timeLabel}`}
      progressPercent={realizationPercent}
      highlight
    />
  )
}
