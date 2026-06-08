import { ChartNoAxesCombinedIcon } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

type AnalyticsWidgetEmptyProps = {
  message?: string
}

export function AnalyticsWidgetEmpty({
  message = "Brak danych w wybranym okresie",
}: AnalyticsWidgetEmptyProps) {
  return (
    <Empty className="border-0 py-6">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ChartNoAxesCombinedIcon aria-hidden />
        </EmptyMedia>
        <EmptyTitle>Brak danych</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
