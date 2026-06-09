# US-23 — Banner informacyjny (Dice UI)

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-05 (`CrmAppShell`), US-18 (deale — reguły krytyczne)  
**Specyfikacja:** [crm-specialists-feedback-spec.md §3](../../crm-specialists-feedback-spec.md#3-banner-informacyjny)

## Jako

użytkownik CRM (demo)

## Chcę

widzieć **wyraźne banery** u góry aplikacji — komunikaty systemowe oraz alerty o krytycznych dealach/leadach

## Aby

ważne informacje nie ginęły wśród modułów i powiadomień

## Zakres

### W zakresie

- Instalacja [Banner — Dice UI](https://www.diceui.com/docs/components/radix/banner): `npx shadcn@latest add "@diceui/banner"` → `components/ui/banner.tsx`.
- Provider `Banners` w layoucie dashboardu (`side="top"`, `maxVisible={2}`).
- Stylowanie wariantów pod tokeny CA ([`design-guide.md`](../../design-guide.md)) — nie domyślny purple Dice.
- **Banner systemowy** (info, dismissible): np. „Wersja demonstracyjna — dane nie są produkcyjne”.
- **Banner deal/lead** (warning/destructive): reguła demo — deal w scope użytkownika z `amount` ≥ **500 000 PLN** i `expectedCloseDate` ≤ **48 h**; akcja „Przejdź do deala” + `BannerClose`.
- Hook `useBanners()` — rejestracja banerów przy mount shellu / po załadowaniu danych.
- Priorytet: deal/lead > systemowy (wyższy `priority` w API Dice UI).
- Banner deal tylko dla **opiekuna** (`ownerId` w scope) — nie globalny.

### Poza zakresem

- Banner na `/login` (zostaje `Alert` w auth).
- CMS / backend banerów.
- Kolejka banerów z seedu JSON (wystarczy reguły + jeden systemowy).

## Kryteria akceptacji (story)

- [x] Komponent Banner zainstalowany i osadzony w shellu.
- [x] Działa banner systemowy + scenariusz krytycznego deala w seedzie.
- [x] Zamykanie i priorytetyzacja zgodne z Dice UI.
- [x] Wygląd zgodny z paletą CA.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-23-01](./tasks/T-23-01-install-banner-provider.md) | Done | — |
| [T-23-02](./tasks/T-23-02-system-and-deal-banner-rules.md) | Done | T-23-01 |

## Kolejność implementacji (agent)

1. T-23-01 → T-23-02

## Wpływ na dokumentację

Wpis w [`reuse-and-conventions.md`](../../reuse-and-conventions.md) (Banner + `useBanners`).
