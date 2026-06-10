"use client"

import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsDownIcon,
  ChevronsUpIcon,
  EqualIcon,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  COMPANY_ACTIVITY_PRIORITY_OPTIONS,
  type CompanyActivityPriorityOption,
} from "@/lib/crm/company-activity-types"
import { cn } from "@/lib/utils"
import type { CompanyActivityPriority } from "@/types/crm"
import type { LucideIcon } from "lucide-react"

const PRIORITY_ICONS: Record<
  CompanyActivityPriorityOption["iconKey"],
  LucideIcon
> = {
  "chevrons-up": ChevronsUpIcon,
  "chevron-up": ChevronUpIcon,
  equal: EqualIcon,
  "chevron-down": ChevronDownIcon,
  "chevrons-down": ChevronsDownIcon,
}

export function ActivityPriorityIcon({
  option,
  className,
}: {
  option: CompanyActivityPriorityOption
  className?: string
}) {
  const Icon = PRIORITY_ICONS[option.iconKey]
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full",
        option.iconBg,
        className,
      )}
      aria-hidden
    >
      <Icon className={cn("size-3.5", option.iconColor)} />
    </span>
  )
}

function ActivityPriorityLabel({
  option,
}: {
  option: CompanyActivityPriorityOption
}) {
  return (
    <span className="flex items-center gap-2">
      <ActivityPriorityIcon option={option} />
      <span>{option.label}</span>
    </span>
  )
}

type CompanyActivityPrioritySelectProps = {
  id?: string
  value: CompanyActivityPriority
  onValueChange: (value: CompanyActivityPriority) => void
}

export function CompanyActivityPrioritySelect({
  id = "activity-priority",
  value,
  onValueChange,
}: CompanyActivityPrioritySelectProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label
        htmlFor={id}
        className="text-sm text-muted-foreground"
      >
        Priorytet:
      </label>
      <Select
        value={value}
        onValueChange={(next) =>
          onValueChange(next as CompanyActivityPriority)
        }
      >
        <SelectTrigger id={id} className="w-full sm:max-w-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start">
          {COMPANY_ACTIVITY_PRIORITY_OPTIONS.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              <ActivityPriorityLabel option={option} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
