# T-34-05 — Karta deala: Dokumenty + przycisk Nowe zadanie

**Story:** [US-34](../story.md)  
**Status:** Done  
**Zależy od:** [T-33-04](../US-33-lead-detail-rebuild/tasks/T-33-04-new-task-button-placement.md), [T-33-05](../US-33-lead-detail-rebuild/tasks/T-33-05-lead-documents-tab.md), [T-34-01](./T-34-01-deal-detail-layout-cleanup.md)

## Cel

Zakładka **Dokumenty** funkcjonalna + **+ Nowe zadanie** przy filtrach historii — parity z kartą leada.

## Zakres

### Dokumenty

- Mirror T-33-05: `addDealDocument(dealId, input, user)` + `createNextDealDocumentId`.
- `deal-activity-panel.tsx` — zakładka **Dokumenty**: lista, formularz dodawania, pusty stan PL.
- Wariant A: Pliki = upload; Dokumenty = rekordy nazwane.

### Zakładka Zadania (US-33 — po implementacji)

- Composer: **Notatka · Aktywność · Pliki · Dokumenty · Zadania** — lista w `TabsContent value="tasks"`.
- `LeadTasksList` z `embedded` lub `deal-tasks-list.tsx`; filtrowanie `task.opportunityId === deal.id`.
- **Nie** renderować listy zadań jako osobnej karty pod filtrami historii.

### + Nowe zadanie

- W rzędzie filtrów (`justify-between`), jak [`lead-activity-panel.tsx`](../../../components/crm/lead-activity-panel.tsx).
- `Link href="/tasks"`.

### Seed chronologii

- Dodać / uruchomić `scripts/sync-deal-timeline-seed.mjs` (wzorzec [`sync-lead-timeline-seed.mjs`](../../../scripts/sync-lead-timeline-seed.mjs)): nic przed `deal.createdAt`.

## Done when

- [ ] Dokumenty z seedu + dodawanie; licznik engagement aktualny.
- [ ] Zakładka **Zadania** w composerze z listą powiązanych tasków.
- [ ] Przycisk Nowe zadanie przy filtrach, po prawej.
- [ ] Seed deala: logiczna kolejność dat zdarzeń.

## Poza zakresem

- Usuwanie dokumentów.
