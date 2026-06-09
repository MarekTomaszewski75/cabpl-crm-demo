# US-24 — Ukrycie grupy „Firma i ludzie” w nawigacji

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-14 (nawigacja), US-15 (dane pracowników — bez zmian)  
**Specyfikacja:** [crm-specialists-feedback-spec.md §4](../../crm-specialists-feedback-spec.md#4-ukrycie-grupy-firma-i-ludzie-w-sidebarze)

## Jako

prezentujący demo sprzedażowe CRM

## Chcę

ukryć z sidebara moduły administracyjne **Pracownicy** i **Struktura firmy**

## Aby

narracja demo skupiała się na kliencie, pipeline i aktywności — bez rozpraszania danymi wewnętrznymi BK

## Zakres

### W zakresie

- Usunięcie grupy **„Firma i ludzie”** z `CRM_NAV_STRUCTURE` w `lib/rbac/nav-structure.ts` (lub flaga `presentationHidden` — prefer: usunąć z struktury widocznej, zostawić `NavItemId` i trasy).
- Trasy `/employees`, `/company-structure` — **bez zmian** (bezpośredni URL nadal działa).
- `data/employees.json`, `data/departments.json`, Context, formularze — **bez zmian**.
- `CrmGlobalSearch`: wyłączyć lub obniżyć priorytet wyników Pracownicy / Struktura firmy (nie promować w głównej ścieżce).
- Aktualizacja [`requirements.md`](../../requirements.md) §6 — brak kroku Pracownicy w scenariuszu prezentacji.

### Poza zakresem

- Usunięcie kodu US-15, seedów, stron.
- Redirect `/employees` → 404.

## Kryteria akceptacji (story)

- [x] Żaden użytkownik nie widzi grupy „Firma i ludzie” w sidebarze.
- [x] Pozostałe grupy i kolejność menu bez regresji.
- [x] Formularze (opiekun, dział) nadal korzystają z danych Context.
- [x] Wyszukiwarka nie sugeruje Pracowników jako główny moduł.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-24-01](./tasks/T-24-01-remove-nav-group.md) | Done | — |
| [T-24-02](./tasks/T-24-02-search-and-presentation-docs.md) | Done | T-24-01 |

## Kolejność implementacji (agent)

1. T-24-01 → T-24-02

## Wpływ na dokumentację

[`demo-expansion.md`](../../demo-expansion.md) (notatka o ukryciu IA), [`requirements.md`](../../requirements.md) §6.
