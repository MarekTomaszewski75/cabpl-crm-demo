# T-17-10 — Zakończ przetwarzanie: dialog Wygrano / Niepowodzenie

**Story:** [US-17](../story.md)  
**Status:** Done  
**Zależy od:** [T-17-02](./T-17-02-demo-data-lead-crud.md), [T-17-07](./T-17-07-lead-status-bar.md)

## Cel

Jeden flow finalizacji leada — wywoływany z paska **Zakończ przetwarzanie**, przycisków **Wygrano** / **Niepowodzenie** w nagłówku.

## Wejście

- Lead w statusie `new` lub `in_progress`.
- `canFinishLead(status) === true`.

## Dialog — krok 1 (wybór wyniku)

`AlertDialog` lub `Dialog` z `DialogTitle`:

- **Wygrano** → krok 2a  
- **Niepowodzenie** → krok 2b  

(Można od razu dwa osobne dialogi z przycisków nagłówka — ten sam komponent z `initialMode`.)

## Krok 2a — Wygrano

| Pole | Kontrolka | Uwagi |
| --- | --- | --- |
| Lejek sprzedażowy | `Select` | 3 opcje ze story → `Opportunity.stage` |
| Firma | podgląd / `Select` istniejących | jeśli `lead.clientId` — tylko info; inaczej utworzenie z `companyName` lub `name` |
| Kontakt | podgląd | jeśli `contactId` — info; checkbox „Utwórz kontakt z danych leada” jeśli brak |
| Tytuł deala | `Input` | domyślnie `Szansa — {name}` |

**Submit:** `winLead(...)` → toast sukces + akcja **Przejdź do lejka** (`/pipeline`).

**Efekt danych:**

- Nowy `Opportunity` w wybranym etapie.
- `Client` + `CrmContact` jeśli brakowało (logika T-17-02).
- Lead: `status: "won"`, `opportunityId`, `clientId`.

## Krok 2b — Niepowodzenie

| Pole | Kontrolka |
| --- | --- |
| Uzasadnienie | `Select` lub `RadioGroup` — 5 wartości `LeadLostReason` |

**Submit:** `loseLead(id, reason)` → toast; lead `lost`.

## Po finalizacji

- Pasek statusów w trybie read-only (T-17-07).
- Przyciski Wygrano/Niepowodzenie ukryte lub disabled.
- Feed: wpis `lead_won` / `lead_lost`.

## Komponenty

- `lead-finish-dialog.tsx` — props: `lead`, `open`, `onOpenChange`, `defaultTab?: "won" | "lost"`.

## Done when

- [ ] Wygrana tworzy deal + firmę/kontakt wg reguł story.
- [ ] Wybór lejka wpływa na `stage` nowej szansy.
- [ ] Przegrana wymaga uzasadnienia z listy 5 pozycji.
- [ ] Lead w stanie terminalnym nie otwiera ponownie dialogu (lub pokazuje komunikat).
- [ ] Stara akcja „Konwertuj na szansę” z US-11 usunięta z kodu.

## Poza zakresem

- Edycja kwoty szansy w dialogu (wartości demo z `buildWinLeadResult` jak dziś).
- Wiele pipeline w seed.
