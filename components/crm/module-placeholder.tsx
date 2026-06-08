import type { LucideIcon } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

type ModulePlaceholderProps = {
  title: string
  description: string
  icon: LucideIcon
}

export function ModulePlaceholder({
  title,
  description,
  icon: Icon,
}: ModulePlaceholderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon />
          </EmptyMedia>
          <EmptyTitle>Moduł w przygotowaniu</EmptyTitle>
          <EmptyDescription>
            Ten ekran zostanie rozbudowany w kolejnej iteracji demo (patrz{" "}
            <code className="text-xs">.context/demo-expansion.md</code>).
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
