import { LightbulbIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { NbaSuggestion } from "@/lib/crm/nba-rules"

const PRIORITY_LABELS: Record<NbaSuggestion["priority"], string> = {
  high: "Wysoki",
  medium: "Średni",
}

type OpportunityNbaHintProps = {
  suggestions: NbaSuggestion[]
}

export function OpportunityNbaHint({ suggestions }: OpportunityNbaHintProps) {
  if (suggestions.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-dashed border-primary/30 bg-primary/5 p-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
        <LightbulbIcon />
        Następny krok
      </div>
      <ul className="flex flex-col gap-1.5">
        {suggestions.map((suggestion) => (
          <li key={suggestion.id} className="flex flex-col gap-1">
            <Badge
              variant={
                suggestion.priority === "high" ? "default" : "secondary"
              }
              className="w-fit"
            >
              {PRIORITY_LABELS[suggestion.priority]}
            </Badge>
            <p className="text-xs leading-snug text-muted-foreground">
              {suggestion.message}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
