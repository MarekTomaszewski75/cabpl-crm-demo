# US-47 — Zadania: kolumna „Deal” zamiast „Szansa”

**Status:** Done  
**Priorytet:** P2  
**Zależy od:** US-09, US-18  
**Źródło:** [`demo-feedback-iteration-2-spec.md`](../../demo-feedback-iteration-2-spec.md) §12

## Jako

użytkownik modułu zadań (demo)

## Chcę

widzieć w tabeli i formularzu zadania powiązanie z **dealem** pod spójną nazwą

## Aby

uniknąć mylenia legacy terminu „szansa” z niezrozumiałym pojęciem w kontekście US-18 (deale)

## Zakres

### W zakresie

- Etykieta kolumny w `tasks-columns.tsx`: **„Szansa” → „Deal”**.
- Etykieta pola w `task-form-dialog.tsx`: **„Szansa” → „Deal”** (lub „Powiązany deal”).
- Opis w formularzu zadania — zaktualizowany copy PL.
- Opcjonalnie: tooltip nagłówka kolumny.

### Poza zakresem

- Zmiana nazwy pola `opportunityId` w typach / JSON.
- Globalna zamiana słowa „szansa” w całej aplikacji.

## Kryteria akceptacji (story)

- [x] Moduł zadań nie używa etykiety „Szansa” w UI.
- [x] Powiązanie nadal działa (`Task.opportunityId` → deal).

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-47-01](./tasks/T-47-01-rename-szansa-to-deal-ui.md) | Done | — |

## Kolejność implementacji (agent)

1. T-47-01
