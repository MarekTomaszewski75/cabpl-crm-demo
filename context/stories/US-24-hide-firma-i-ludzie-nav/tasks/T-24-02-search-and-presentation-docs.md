# T-24-02 — Wyszukiwarka i aktualizacja ścieżki prezentacji

**Story:** [US-24](../story.md)  
**Status:** Done  
**Zależy od:** T-24-01

## Cel

Nie promować modułów HR w wyszukiwarce; zaktualizować dokumentację prezentacji.

## Zakres techniczny

### `lib/crm/global-search-items.ts`

- Usunąć lub ustawić `hidden: true` / wykluczyć z domyślnych wyników pozycje `employees`, `companyStructure`.
- Zachować w kodzie jeśli potrzebne dev — ale nie w top wynikach dla użytkownika prezentacji.

### Dokumentacja

- [`requirements.md`](../../../requirements.md) §6 — usunąć / nie dodawać kroków Pracownicy / Struktura firmy.
- [`crm-specialists-feedback-spec.md`](../../../crm-specialists-feedback-spec.md) — status specyfikacji: **In story** (opcjonalna jedna linia w dzienniku).

## Done when

- [x] Wyszukiwarka nie sugeruje Pracowników jako główny moduł.
- [x] `requirements.md` §6 zaktualizowane (jeśli wymieniały HR).

## Poza zakresem

- Zmiany w `demo-expansion.md` poza krótką notatką (opcjonalnie).
