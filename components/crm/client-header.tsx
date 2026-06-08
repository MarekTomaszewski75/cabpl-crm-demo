import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { displayInitials } from "@/lib/pipeline/stage-theme"
import type { Client, DemoUser } from "@/types/crm"

type ClientHeaderProps = {
  client: Client
  owner?: DemoUser
}

export function ClientHeader({ client, owner }: ClientHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-col gap-2">
        <h1 className="text-xl font-semibold tracking-tight">{client.name}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="tabular-nums">NIP {client.nip}</span>
          <span aria-hidden>·</span>
          <span>{client.segment}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg border border-border/80 bg-card px-3 py-2">
        <Avatar>
          <AvatarFallback className="bg-primary/15 text-xs font-semibold">
            {displayInitials(owner?.displayName ?? "?")}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Opiekun</span>
          <span className="truncate text-sm font-medium">
            {owner?.displayName ?? "—"}
          </span>
          {owner ? (
            <Badge variant="secondary" className="w-fit">
              {owner.roleLabelPl}
            </Badge>
          ) : null}
        </div>
      </div>
    </div>
  )
}
