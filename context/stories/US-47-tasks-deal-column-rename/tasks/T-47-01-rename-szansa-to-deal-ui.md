# T-47-01 — Zadania: etykieta „Deal” zamiast „Szansa”

**Story:** [US-47](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Ujednolicić nazewnictwo powiązania zadania z dealem w UI.

## Zakres

### `tasks-columns.tsx`

- Nagłówek kolumny: **Deal** (meta.title).
- Opcjonalny `Tooltip` na nagłówku: „Deal sprzedażowy powiązany z zadaniem”.

### `task-form-dialog.tsx`

- `FieldLabel`: **Deal** zamiast **Szansa**.
- Zaktualizować opis dialogu (copy PL) — usunąć słowo „szansa”.

### Semantyka (bez zmian kodu)

- Pole nadal mapuje `Task.opportunityId` → `Deal`.

## Done when

- [x] Tabela i formularz zadań używają etykiety „Deal”.
- [x] Powiązanie deala działa bez regresji.

## Poza zakresem

- Rename `opportunityId` w typach / seedzie.
- Globalna zamiana „szansa” w wyszukiwarce (`global-search-items.ts`) — opcjonalny follow-up.
