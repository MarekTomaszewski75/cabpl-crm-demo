# T-18-07 — Pasek statusów deala (klikalny, 6 segmentów)

**Story:** [US-18](../story.md)  
**Status:** Done  
**Zależy od:** [T-18-06](./T-18-06-deal-detail-layout-shell.md)

## Cel

Segmentowy pasek pod nagłówkiem — jak na screenie: pięć etapów workflow + **Zakończ przetwarzanie**.

## Segmenty (kolejność)

1. **Nowy** → `status: "new"`
2. **Powiązanie utworzone** → `association_created`
3. **Spotkanie zaplanowane** → `meeting_scheduled`
4. **Oferta złożona** → `offer_submitted`
5. **Rozpoczęto negocjacje** → `negotiation_started`
6. **Zakończ przetwarzanie** → otwiera `DealFinishDialog` (T-18-10)

## Zachowanie

| Segment | Akcja | Warunek |
| --- | --- | --- |
| Segmenty 1–5 | `updateDeal({ status })` | dozwolone gdy deal nie `won`/`lost` |
| **Zakończ przetwarzanie** | callback `onFinishClick` | tylko gdy `canFinishDeal(status)` |

### Wizualizacja

- Aktywny segment: `bg-primary` / token primary (fiolet CA — jak screen).
- Segmenty „przeszłe” w workflow: wypełnione / podświetlone do aktualnego.
- Segmenty przyszłe: `bg-muted`.
- Dla `won` / `lost`: pasek tylko do odczytu; badge **Wygrany** / **Utracony** na końcu paska.

### UX

- Klik na segmenty 1–5 — natychmiastowa zmiana (optimistic) + opcjonalny wpis `deal_status_changed` w feedzie.
- Kursor `pointer` na klikalnych; `not-allowed` gdy terminalny status.
- Klik na segment **wcześniejszy** w łańcuchu dozwolony (cofnięcie etapu w demo).

## Komponent

- `deal-status-bar.tsx` — props: `deal`, `onFinishClick`, `onStatusChange`.

## Done when

- [ ] Przełączanie między 5 statusami workflow działa bez przeładowania.
- [ ] Szósty segment wywołuje callback do dialogu (T-18-10).
- [ ] Deal `won`/`lost` nie pozwala zmienić segmentów workflow.

## Poza zakresem

- Treść dialogu wygranej/przegranej (→ T-18-10).
