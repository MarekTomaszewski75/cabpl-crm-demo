# T-22-03 — Karta powiadomień na widoku „Dziś”

**Story:** [US-22](../story.md)  
**Status:** Done  
**Zależy od:** T-22-01

## Cel

Skrót powiadomień na `/today` dla doradcy.

## Zakres techniczny

### `components/crm/today-notifications-card.tsx`

- Karta **„Powiadomienia”** — 3–5 ostatnich **nieprzeczytanych** (lub wszystkich jeśli brak unread, max 5).
- Ten sam wiersz co w popoverze (reuse mały komponent `NotificationListItem`).
- Link „Wszystkie powiadomienia” — otwiera popover bell programowo **lub** scroll do headera (prostsze: tekst „Otwórz panel powiadomień” bez hacka — wystarczy klik w elementy listy).
- Tylko `advisor` na `/today`.

### Layout

- Wpięcie w `TodayView` — np. pełna szerokość pod gridem zadań/spotkań lub trzecia kolumna; nie psuć US-21 cards.

## Done when

- [x] Doradca widzi skrót powiadomień na `/today`.
- [x] Klik w wpis nawiguje i oznacza przeczytane.
- [x] Spójny styl z innymi kartami Dziś.

## Poza zakresem

- Osobna trasa `/notifications`.
