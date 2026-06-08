import { LightbulbIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { NbaSuggestion } from "@/lib/crm/nba-rules"

type ClientNbaPanelProps = {
  suggestions: NbaSuggestion[]
}

const PRIORITY_LABELS: Record<NbaSuggestion["priority"], string> = {
  high: "Wysoki",
  medium: "Średni",
}

export function ClientNbaPanel({ suggestions }: ClientNbaPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LightbulbIcon className="text-primary" />
          Następny krok
        </CardTitle>
        <CardDescription>
          Sugestie na podstawie reguł Etapu 1 (bez AI)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Brak pilnych sugestii — kontynuuj bieżące szanse i kontakty.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="flex flex-col gap-2 rounded-lg border border-border/80 bg-muted/30 p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      suggestion.priority === "high" ? "default" : "secondary"
                    }
                  >
                    {PRIORITY_LABELS[suggestion.priority]}
                  </Badge>
                </div>
                <p className="text-sm leading-snug">{suggestion.message}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export function ClientChannelsStageAlert() {
  return (
    <Alert>
      <AlertTitle>Historia kontaktów — Etap 1</AlertTitle>
      <AlertDescription>
        W tej wersji demo wpisy pochodzą z importu lub ręcznego uzupełnienia.
        Etap 2 obejmie integracje z kanałami banku (e-mail, telefonia, systemy
        spotkań).
      </AlertDescription>
    </Alert>
  )
}
