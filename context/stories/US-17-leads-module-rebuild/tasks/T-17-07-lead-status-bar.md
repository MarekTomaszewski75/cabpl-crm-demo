# T-17-07 — Pasek statusów leada (klikalny)

**Story:** [US-17](../story.md)  
**Status:** Done  
**Zależy od:** [T-17-06](./T-17-06-lead-detail-layout-shell.md)

## Cel

Segmentowy pasek pod nagłówkiem — jak na screenie: **Nowy** · **W toku** · **Zakończ przetwarzanie**.

## Zachowanie

| Segment | Akcja | Warunek |
| --- | --- | --- |
| **Nowy** | `updateLead({ status: "new" })` | dozwolone gdy lead nie `won`/`lost` |
| **W toku** | `updateLead({ status: "in_progress" })` | j.w. |
| **Zakończ przetwarzanie** | otwiera `LeadFinishDialog` (T-17-10) | tylko gdy `canFinishLead` |

### Wizualizacja

- Aktywny segment: `bg-primary` / token primary (jak screen — fiolet CA).
- Segmenty przyszłe: `bg-muted` / subtelne tło.
- Dla `won` / `lost`: pasek tylko do odczytu; opcjonalnie badge **Wygrany** / **Utracony** zamiast trzeciego segmentu.

### UX

- Klik na **Nowy** / **W toku** — natychmiastowa zmiana (optimistic) + opcjonalny wpis `lead_status_changed` w feedzie.
- Kursor `pointer` na klikalnych segmentach; `not-allowed` gdy terminalny status.

## Komponent

- `lead-status-bar.tsx` — props: `lead`, `onFinishClick`, `onStatusChange`.

## Done when

- [ ] Przełączanie Nowy ↔ W toku działa bez przeładowania.
- [ ] Trzeci segment wywołuje callback do dialogu (T-17-10).
- [ ] Lead `won`/`lost` nie pozwala zmienić segmentów workflow.

## Poza zakresem

- Treść dialogu wygranej/przegranej (→ T-17-10).
