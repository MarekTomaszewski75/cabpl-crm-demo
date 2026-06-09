# US-22 — System powiadomień in-app

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-02, US-05 (`CrmAppShell`), US-13 (`/today`), US-21 (wspólne reguły pilności — opcjonalnie równolegle po T-21-01)  
**Specyfikacja:** [crm-specialists-feedback-spec.md §2](../../crm-specialists-feedback-spec.md#2-system-powiadomień)

## Jako

użytkownik CRM (demo: przede wszystkim doradca)

## Chcę

otrzymywać **powiadomienia w aplikacji** — dzwonek w headerze i skrót na „Dziś” — o terminach, bezczynności leadów i nadchodzących spotkaniach

## Aby

nie przegapić pilnych działań bez przeszukiwania modułów

## Zakres

### W zakresie

- Typ `Notification` w `types/crm.ts` + `NotificationContext` (osobny provider w `AppProviders`).
- Generator powiadomień przy logowaniu / pierwszym mount — reguły MVP:
  - deal: `expectedCloseDate` za ≤ 3 dni;
  - zadanie: `dueDate` za ≤ 1 dzień lub po terminie;
  - lead: brak aktywności ≥ 7 dni (`in_progress` / `new`);
  - spotkanie: start za < 24 h (opcjonalnie w T-22-03).
- Seed `data/notifications.json` — 2–3 przykładowe wpisy per użytkownik demo (uzupełnienie generatora).
- **Bell** w `CrmAppHeader`: ikona `Bell`, badge nieprzeczytanych (max „9+”), `Popover` lub `Sheet` z listą.
- Akcje: klik → nawigacja + `markAsRead`; „Oznacz wszystkie jako przeczytane”.
- Karta **„Powiadomienia”** na `/today` — 3–5 ostatnich nieprzeczytanych.
- RBAC: `userId` = zalogowany `DemoUser.id`; brak cudzych powiadomień.
- Czas względny PL (`formatRelativeTimePl` w `lib/format/pl.ts` lub prosty helper).
- Bell widoczny dla **wszystkich ról** z dostępem do shellu (doradca, menedżer, executive).

### Poza zakresem

- Push, e-mail, SMS, WebSocket.
- Osobna trasa `/notifications`.
- Persystencja `localStorage` (nice-to-have — nie w tej story).

## Kryteria akceptacji (story)

- [x] Bell pokazuje poprawną liczbę nieprzeczytanych.
- [x] Panel listy działa po PL; klik oznacza przeczytane i nawiguje.
- [x] `/today` pokazuje skrót powiadomień dla doradcy.
- [x] Inny użytkownik nie widzi cudzych wpisów.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-22-01](./tasks/T-22-01-notification-types-and-context.md) | Done | — |
| [T-22-02](./tasks/T-22-02-header-bell-panel.md) | Done | T-22-01 |
| [T-22-03](./tasks/T-22-03-today-notifications-card.md) | Done | T-22-01 |

## Kolejność implementacji (agent)

1. T-22-01 → T-22-02 → T-22-03

## Wpływ na dokumentację

Wpis w [`reuse-and-conventions.md`](../../reuse-and-conventions.md) (`NotificationContext`, generator reguł).
