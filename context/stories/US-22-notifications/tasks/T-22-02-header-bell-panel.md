# T-22-02 — Dzwonek powiadomień w headerze

**Story:** [US-22](../story.md)  
**Status:** Done  
**Zależy od:** T-22-01

## Cel

Bell + panel listy powiadomień w `CrmAppHeader`.

## Zakres techniczny

### `components/crm/crm-app-shell.tsx` (lub `crm-notifications-bell.tsx`)

- Przycisk `Button variant="ghost" size="icon"` + `BellIcon`.
- `Badge` na rogu gdy `unreadCount > 0` (cap „9+”).
- `Popover` (prefer) lub `Sheet`: lista scrollowalna, max-height ~400px.
- Wiersz: ikona typu (`lucide`), tytuł, body (1 linia truncate), czas względny.
- Klik wiersza: `router.push(href)` + `markAsRead`.
- Stopka: `Button variant="link"` — „Oznacz wszystkie jako przeczytane”.
- Pusty stan: „Brak powiadomień”.
- Widoczne dla wszystkich zalogowanych użytkowników w shellu.

### `lib/format/pl.ts`

- `formatRelativeTimePl(date: Date, base?: Date): string` — np. „2 godz. temu”, „za 3 dni” (proste reguły PL).

## Done when

- [x] Bell i badge działają na każdej stronie dashboardu.
- [x] Panel otwiera się i zamyka; oznaczanie przeczytane działa.
- [x] Nawigacja do encji z powiadomienia działa.

## Poza zakresem

- Karta na `/today` (→ T-22-03).
