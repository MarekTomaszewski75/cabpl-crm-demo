# T-17-05 — Po utworzeniu: redirect + zdarzenie „Utworzono lead”

**Story:** [US-17](../story.md)  
**Status:** Done  
**Zależy od:** [T-17-02](./T-17-02-demo-data-lead-crud.md), [T-17-04](./T-17-04-lead-create-sheet-form.md)

## Cel

Po zapisie nowego leada — otworzyć kartę `/leads/[id]` i pokazać wpis na osi czasu (jak firma US-16).

## Zachowanie

1. `LeadFormDialog` / `lead-form`: `onSuccess` → `router.push(\`/leads/${id}\`)` + zamknięcie Sheet.
2. Przy `addLead` (lub tuż po) — wpis aktywności `lead_created`.

## Route

- `app/(dashboard)/leads/[id]/page.tsx` — minimalny wrapper (pełny UI w T-17-06); w tym tasku wystarczy, że redirect nie kończy się 404.

## Wpis na timeline

- Tytuł PL: **Utworzono lead**.
- Treść: `name` leada.
- Autor: zalogowany użytkownik.
- Timestamp: `createdAt`.

## Done when

- [ ] Utworzenie z listy kończy się na `/leads/[id]`.
- [ ] Feed (gdy T-17-09 gotowy) pokazuje wpis utworzenia — lub tymczasowy placeholder w T-17-06 z danymi z Context.
- [ ] `ownerId` leada = użytkownik tworzący.

## Poza zakresem

- Pełny composer notatek (→ T-17-09).
- Pasek statusów (→ T-17-07).
