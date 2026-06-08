# T-16-10 — Karta firmy: prawa kolumna — composer i feed aktywności

**Story:** [US-16](../story.md)  
**Status:** Done  
**Zależy od:** [T-16-07](./T-16-07-post-create-redirect-and-timeline.md), [T-16-08](./T-16-08-company-detail-layout-shell.md)

## Cel

Prawa kolumna jak na screenie: górny panel interakcji + **feed** z filtrami i wpisami (w tym „Utworzono firmę” z T-16-07).

## Górny panel

- `Tabs`: **Notatka** (aktywna), Aktywność, Pliki, Dokumenty, Poczta — ostatnie 4 jako **stub** (disabled lub `Empty` + „Integracja w Etapie 2”).
- Przycisk **+ Nowe zadanie** — link do `/tasks` z prefill `clientId` **lub** toast „Otwórz moduł Zadania” (minimum demo).
- **Notatka:** `Textarea` placeholder „Zostaw notatkę” + przycisk dodania.
- Zapis notatki: nowy wpis w feedzie typu **Notatka** (`ContactEvent` z `type: "email"` i prefiksem w `note` **lub** dedykowany `kind: "note"` — spójnie z modelem z T-16-07).

## Feed

- Pasek filtrów: **Wszystkie** (licznik), Aktywności, Notatki, Pliki, Zadania (dropdown stub).
- Lista chronologiczna (najnowsze góra): oś czasu (linia + kropka primary), godzina, karta z tytułem i treścią.
- Źródła danych (merge):
  1. Zdarzenia systemowe (np. utworzenie firmy) — T-16-07.
  2. Istniejące `contactEvents` dla `clientId` (US-08).
  3. Opcjonalnie: otwarte zadania powiązane z firmą (tylko w filtrze Zadania).

## Integracja US-08

- Usunąć duplikat surowej listy `ContactTimeline` z lewej/dolnej części — timeline tylko w feedzie prawej kolumny.
- `ClientChannelsStageAlert` — pod feedem lub w zakładce Ogólne (nie znika z prezentacji).

## Komponenty (propozycja)

- `company-activity-panel.tsx` — composer + filtry.
- `company-activity-feed.tsx` — lista wpisów.
- `lib/crm/company-activity.ts` — `buildCompanyActivityFeed({ clientId, contactEvents, tasks, … })`.

## Done when

- [ ] Dodanie notatki pojawia się w feedzie bez przeładowania.
- [ ] Filtr „Wszystkie” pokazuje łącznie system + contact-events (+ opcjonalnie zadania).
- [ ] Wpis „Utworzono firmę” widoczny dla nowo utworzonej firmy.
- [ ] Stuby zakładek Pliki/Dokumenty/Poczta nie wyglądają jak błąd (jasny komunikat Etap 1).

## Poza zakresem

- Rzeczywisty upload plików / integracja poczty.
