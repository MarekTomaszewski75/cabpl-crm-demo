# US-55 — Spójne kwoty: plan, realizacja, prognoza, lejek

**Status:** Done

## Jako

prezenter demo (Zarząd, menedżer regionu)

## Chcę

żeby realizacja planu, prognoza i lejek pokazywały te same liczby w każdym widoku i były w realistycznych proporcjach

## Aby

liczby na pokazie nie podważały wiarygodności. Ocena z 23.10 wytknęła realizację 6,8 / 15,3 / 20,5 mln zł i lejek 708 mln zł przy planie 28 mln zł. QW-08: „realizacja z wygranych szans, odchylenie”.

## Kryteria akceptacji

- [x] `data/kpi.json` zawiera tylko **plan** (`KpiPlanSeed`): miesięczny plan banku na 2026 (200 mln zł, rosnący pod koniec kwartałów) i roczny podział na regiony, segmenty i kategorie.
- [x] `KpiSnapshot` jest wyliczany z deali (`lib/analytics/kpi-snapshot.ts`, `deriveKpiSnapshot`):
  - plan YTD (od stycznia do końca bieżącego miesiąca) i kwartał z planu miesięcznego,
  - realizacja = suma wygranych w okresie,
  - prognoza = realizacja + ważony lejek do końca okresu, łącznie z przeterminowanymi.
- [x] `kpi` w `DemoDataContext` liczy się w `useMemo` z `opportunities` i `clients`, więc `winDeal` podnosi realizację.
- [x] Seed:
  - 44 wygrane za 138 mln zł, rozłożone po 3–5 w miesiącu,
  - kwoty dopasowane do celów realizacji per region i kategoria,
  - 11 otwartych deali z późnych etapów oznaczono jako wygrane (Pomorze, Małopolska, kredyty z Mazowsza); żaden nie był powiązany z zadaniem, spotkaniem, leadem ani powiadomieniem,
  - otwarty lejek: 676 mln zł, czyli 3,4 × plan roczny (regiony 3,0–3,6×),
  - daty zamknięcia otwartych deali rozłożone według etapu na 15–365 dni; 11 zaległych i 15 „w ciągu 30 dni” zostało.
- [x] Ten sam wynik na: Plan i cele (`getExecutiveTotals`), hero KPI (`getBankWideKpiTotals`), scorecard regionów i sumie wygranych z deali (`getWonDealsAmountPln`).

## Wyniki (bank)

| Dzień | YTD: realizacja / plan | Prognoza YTD | Q4: realizacja / plan | Prognoza Q4 |
| --- | --- | --- | --- | --- |
| 27.10 | 137,9 / 157 mln (88%) | 148,9 | 11,7 / 61 (19%) | 68,6 |
| 20.11 | 137,9 / 176 (78%) | 150,2 | 23,1 / 61 (38%) | 56,2 |
| 18.12 | 137,9 / 200 (69%) | 150,7 | 42,3 / 61 (69%) | 55,0 |

Realizacja YTD spada w czasie, bo wygranych nie przybywa, a plan narasta. Regiony: Mazowsze > Małopolska > Pomorze. Kategorie: od 54% (Depozyty) do 100% (Rachunki).

## Weryfikacja

- Skrypt na przesuniętym seedzie dla 27.10, 20.11 i 18.12: widoki są zgodne co do złotówki.
- Niezmienniki dat z US-54 bez zmian: „Dziś” pokazuje 7 / 16 / 8, nic nie wypada w przyszłości, `createdAt` ≤ `finishedAt`.
- `tsc --noEmit` przechodzi, a `next dev` zwraca 200 dla `/login`, `/dashboard`, `/today`, `/pipeline` i `/clients`.

## Poza zakresem

- Słowniki, nazwy deali, kontakty, copy → US-56.
- Badge „Etap 2” na scenariuszach prognozy → US-61.
