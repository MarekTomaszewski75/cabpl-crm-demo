"use client"

import * as React from "react"
import { CalendarRangeIcon, CirclePlusIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  isDealCloseDateRangeFilterActive,
  type DealCloseDateRangeFilter,
} from "@/lib/crm/deal-close-date-filter"
import { formatDatePl } from "@/lib/format/pl"

type DataTableDateRangeFilterProps = {
  title: string
  value: DealCloseDateRangeFilter
  onValueChange: (value: DealCloseDateRangeFilter) => void
}

function formatRangeSummary(value: DealCloseDateRangeFilter): string {
  const from = value.from?.trim()
  const to = value.to?.trim()
  if (from && to) {
    return `${formatDatePl(from)} – ${formatDatePl(to)}`
  }
  if (from) return `od ${formatDatePl(from)}`
  if (to) return `do ${formatDatePl(to)}`
  return ""
}

export function DataTableDateRangeFilter({
  title,
  value,
  onValueChange,
}: DataTableDateRangeFilterProps) {
  const [open, setOpen] = React.useState(false)
  const isActive = isDealCloseDateRangeFilterActive(value)
  const summary = formatRangeSummary(value)

  function patch(next: Partial<DealCloseDateRangeFilter>) {
    onValueChange({ ...value, ...next })
  }

  function clearFilters() {
    onValueChange({})
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <CirclePlusIcon />
          {title}
          {isActive ? (
            <>
              <Separator orientation="vertical" className="mx-0.5 h-4" />
              <Badge
                variant="secondary"
                className="max-w-48 truncate rounded-sm px-1 font-normal"
              >
                {summary}
              </Badge>
            </>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="start">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="date-range-from">Od</FieldLabel>
            <Input
              id="date-range-from"
              type="date"
              value={value.from ?? ""}
              onChange={(e) => patch({ from: e.target.value || undefined })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="date-range-to">Do</FieldLabel>
            <Input
              id="date-range-to"
              type="date"
              value={value.to ?? ""}
              onChange={(e) => patch({ to: e.target.value || undefined })}
            />
          </Field>
          {isActive ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={clearFilters}
            >
              <CalendarRangeIcon data-icon="inline-start" />
              Wyczyść zakres
            </Button>
          ) : null}
        </FieldGroup>
      </PopoverContent>
    </Popover>
  )
}
