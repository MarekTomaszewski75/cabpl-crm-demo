"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSession } from "@/lib/auth/demo-session"
import { DEAL_LOST_REASON_OPTIONS, canFinishDeal } from "@/lib/crm/deal-labels"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { Deal, DealLostReason } from "@/types/crm"

export function DealFinishDialog({
  deal,
  open,
  onOpenChange,
  defaultMode,
}: {
  deal: Deal
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultMode?: "won" | "lost"
}) {
  const { user } = useSession()
  const { winDeal, loseDeal } = useDemoData()
  const [step, setStep] = React.useState<"won" | "lost" | null>(null)
  const [reason, setReason] = React.useState<DealLostReason>("other")
  const mode: "choose" | "won" | "lost" = step ?? defaultMode ?? "choose"
  if (!canFinishDeal(deal.status)) return null
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setStep(null)
        onOpenChange(next)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        {mode === "choose" ? (
          <>
            <DialogHeader><DialogTitle>Zakończ przetwarzanie</DialogTitle><DialogDescription>Wybierz wynik pracy nad dealem.</DialogDescription></DialogHeader>
            <div className="flex flex-col gap-2"><Button onClick={() => setStep("won")}>Wygrano</Button><Button variant="outline" onClick={() => setStep("lost")}>Stracony deal</Button></div>
          </>
        ) : null}
        {mode === "won" ? (
          <>
            <DialogHeader><DialogTitle>Wygrano</DialogTitle><DialogDescription>Potwierdź oznaczenie deala jako wygrany.</DialogDescription></DialogHeader>
            <DialogFooter><Button variant="outline" onClick={() => setStep(null)}>Wstecz</Button><Button onClick={() => { if (!user) return; winDeal(deal.id, user); toast.success("Deal oznaczony jako wygrany"); setStep(null); onOpenChange(false) }}>Zapisz wygraną</Button></DialogFooter>
          </>
        ) : null}
        {mode === "lost" ? (
          <>
            <DialogHeader><DialogTitle>Stracony deal</DialogTitle><DialogDescription>Wybierz uzasadnienie przegranej.</DialogDescription></DialogHeader>
            <FieldGroup><Field><FieldLabel>Uzasadnienie</FieldLabel><Select value={reason} onValueChange={(v) => setReason(v as DealLostReason)}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{DEAL_LOST_REASON_OPTIONS.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectGroup></SelectContent></Select></Field></FieldGroup>
            <DialogFooter><Button variant="outline" onClick={() => setStep(null)}>Wstecz</Button><Button onClick={() => { if (!user) return; loseDeal(deal.id, reason, user); toast.success("Deal oznaczony jako utracony"); setStep(null); onOpenChange(false) }}>Zapisz przegraną</Button></DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

