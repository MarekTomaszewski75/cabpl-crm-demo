"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"
import {
  canFinishLead,
  isTerminalLeadStatus,
  LEAD_STATUS_LABELS,
} from "@/lib/crm/lead-labels"
import type { Lead, LeadStatus } from "@/types/crm"

const WORKFLOW_SEGMENTS: {
  status: LeadStatus
  label: string
}[] = [
  { status: "new", label: "Nowy" },
  { status: "in_progress", label: "W toku" },
]

type LeadStatusBarProps = {
  lead: Lead
  onFinishClick: () => void
  onStatusChange: (status: LeadStatus) => void
}

export function LeadStatusBar({
  lead,
  onFinishClick,
  onStatusChange,
}: LeadStatusBarProps) {
  const terminal = isTerminalLeadStatus(lead.status)

  if (terminal) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
        <span className="text-sm text-muted-foreground">Wynik:</span>
        <Badge
          variant={lead.status === "won" ? "outline" : "destructive"}
        >
          {LEAD_STATUS_LABELS[lead.status]}
        </Badge>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col gap-3 rounded-lg border border-border bg-card px-3 py-3 sm:flex-row sm:items-center"
      aria-label="Status leada"
    >
      <Stepper
        value={lead.status}
        onValueChange={(value) => onStatusChange(value as LeadStatus)}
        orientation="horizontal"
        activationMode="manual"
        className="min-w-0 flex-1 gap-0"
      >
        <StepperList className="w-full">
          {WORKFLOW_SEGMENTS.map((segment) => (
            <StepperItem key={segment.status} value={segment.status}>
              <StepperTrigger className="gap-2 rounded-md px-1 py-1">
                <StepperIndicator />
                <StepperTitle className="hidden sm:inline">
                  {segment.label}
                </StepperTitle>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>
          ))}
        </StepperList>
      </Stepper>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="shrink-0"
        disabled={!canFinishLead(lead.status)}
        onClick={onFinishClick}
      >
        Zakończ przetwarzanie
      </Button>
    </div>
  )
}
