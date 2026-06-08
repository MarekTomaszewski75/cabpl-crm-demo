"use client"

import * as React from "react"
import { CheckIcon, CirclePlusIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type FacetedFilterOption = {
  label: string
  value: string
  count?: number
}

type DataTableFacetedFilterProps = {
  title: string
  options: FacetedFilterOption[]
  selectedValues: string[]
  onSelectedValuesChange: (values: string[]) => void
}

export function DataTableFacetedFilter({
  title,
  options,
  selectedValues,
  onSelectedValuesChange,
}: DataTableFacetedFilterProps) {
  const [open, setOpen] = React.useState(false)
  const selectedSet = React.useMemo(
    () => new Set(selectedValues),
    [selectedValues],
  )

  function toggleValue(value: string) {
    const next = new Set(selectedSet)
    if (next.has(value)) {
      next.delete(value)
    } else {
      next.add(value)
    }
    onSelectedValuesChange([...next])
  }

  function clearFilters() {
    onSelectedValuesChange([])
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed"
        >
          <CirclePlusIcon />
          {title}
          {selectedSet.size > 0 ? (
            <>
              <Separator orientation="vertical" className="mx-0.5 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                {selectedSet.size}
              </Badge>
              <span className="hidden gap-1 lg:flex">
                {options
                  .filter((opt) => selectedSet.has(opt.value))
                  .slice(0, 2)
                  .map((opt) => (
                    <Badge
                      key={opt.value}
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {opt.label}
                    </Badge>
                  ))}
                {selectedSet.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    +{selectedSet.size - 2}
                  </Badge>
                ) : null}
              </span>
            </>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>Brak wyników.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedSet.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    data-checked={isSelected ? true : undefined}
                    onSelect={() => toggleValue(option.value)}
                  >
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon />
                    </span>
                    <span className="truncate">{option.label}</span>
                    {option.count !== undefined ? (
                      <span className="ml-auto font-normal text-muted-foreground tabular-nums">
                        {option.count}
                      </span>
                    ) : null}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedSet.size > 0 ? (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    value="__clear__"
                    onSelect={clearFilters}
                    className="justify-center text-center"
                  >
                    Wyczyść filtry
                  </CommandItem>
                </CommandGroup>
              </>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
