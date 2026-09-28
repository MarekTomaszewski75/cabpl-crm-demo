"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  CREDIT_STAGE_CHECKLIST,
  emptyCreditStageChecklist,
  isCreditStageGateComplete,
} from "@/lib/crm/deal-stage-gate"
import type { Deal } from "@/types/crm"

export type StageGateValues = {
  amount: number
  expectedCloseDate: string
  stageChecklist: Record<string, boolean>
}

export function DealStageGateDialog({
  deal,
  open,
  onOpenChange,
  onConfirm,
}: {
  deal: Deal | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (values: StageGateValues) => void
}) {
  const [amount, setAmount] = React.useState("")
  const [expectedCloseDate, setExpectedCloseDate] = React.useState("")
  const [checklist, setChecklist] = React.useState(emptyCreditStageChecklist)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open || !deal) return
    setAmount(deal.amount && deal.amount > 0 ? String(deal.amount) : "")
    setExpectedCloseDate(deal.expectedCloseDate ?? "")
    setChecklist({
      ...emptyCreditStageChecklist(),
      ...deal.stageChecklist,
    })
    setError(null)
  }, [open, deal])

  function handleConfirm() {
    const parsedAmount = Number(amount.replace(/\s/g, "").replace(",", "."))
    const next: StageGateValues = {
      amount: parsedAmount,
      expectedCloseDate,
      stageChecklist: checklist,
    }
    if (
      !isCreditStageGateComplete({
        amount: Number.isFinite(parsedAmount) ? parsedAmount : null,
        expectedCloseDate,
        stageChecklist: checklist,
      })
    ) {
      setError("Uzupełnij kwotę, planowaną datę zamknięcia i całą checklistę.")
      return
    }
    onConfirm(next)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dane wymagane na tym etapie</DialogTitle>
          <DialogDescription>
            Lejek kredytowy: wyjście z etapu „Nowy” wymaga kwoty, daty
            zamknięcia i checklisty.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor="stage-gate-amount">Kwota (PLN)</FieldLabel>
            <Input
              id="stage-gate-amount"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="np. 1500000"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="stage-gate-close">
              Planowana data zamknięcia
            </FieldLabel>
            <Input
              id="stage-gate-close"
              type="date"
              value={expectedCloseDate}
              onChange={(event) => setExpectedCloseDate(event.target.value)}
            />
          </Field>
          <FieldSet>
            <FieldLegend>Checklista</FieldLegend>
            {CREDIT_STAGE_CHECKLIST.map((item) => (
              <Field key={item.id} orientation="horizontal">
                <Checkbox
                  id={`stage-gate-${item.id}`}
                  checked={checklist[item.id] === true}
                  onCheckedChange={(checked) =>
                    setChecklist((prev) => ({
                      ...prev,
                      [item.id]: checked === true,
                    }))
                  }
                />
                <FieldLabel htmlFor={`stage-gate-${item.id}`}>
                  {item.labelPl}
                </FieldLabel>
              </Field>
            ))}
          </FieldSet>
          {error ? <FieldError>{error}</FieldError> : null}
        </FieldGroup>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Anuluj
          </Button>
          <Button type="button" onClick={handleConfirm}>
            Przejdź dalej
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
