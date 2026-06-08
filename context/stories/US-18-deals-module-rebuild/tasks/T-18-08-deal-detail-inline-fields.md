# T-18-08 — Karta deala: lewa kolumna — edycja optimistic inline

**Story:** [US-18](../story.md)  
**Status:** Done  
**Zależy od:** [T-18-06](./T-18-06-deal-detail-layout-shell.md), [T-16-04](../../../US-16-companies-module-rebuild/tasks/T-16-04-combobox-contact-picker.md)

## Cel

Pola po lewej jak na screenie Uspacy — **klik → edycja → zapis** do Context (reuse `InlineEditableField` z firm/leadów).

## Sekcje (Cards)

### „O dealu”

| Etykieta PL | Pole | Tryb edycji |
| --- | --- | --- |
| Kwota | `amount` + `currency` | `Input` liczbowy + `Select` waluty (jedna linia lub para pól) |
| Kontakty | `contactId` | `ContactCombobox` — karta podglądu: imię, telefon, etykieta „Służbowy” (demo) |
| Firmy | `clientId` | picker firm — karta podglądu nazwy firmy (reuse combobox klientów z US-08/16 lub nowy `ClientCombobox`) |

### „Dodatkowo”

| Etykieta PL | Pole | Tryb edycji |
| --- | --- | --- |
| Komentarze | `comments` | `Textarea` |
| Źródło | `source` | `Select` |
| Typ dealu | `dealType` | `Select` + „Brak” |

### „Inne”

| Etykieta PL | Pole | Tryb edycji |
| --- | --- | --- |
| Zakończono przez | `finishedByUserId` | tylko odczyt po `won`/`lost` |
| Data zakończenia | `finishedAt` | tylko odczyt |
| Po raz pierwszy zakończono przez | `firstFinishedByUserId` | tylko odczyt |

Sekcja „Inne” widoczna po finalizacji lub zawsze z placeholderami (jak screen).

## Wzorzec UX

- Placeholder „Wprowadź wartość …” (`text-muted-foreground`).
- Blur / Enter → `updateDeal`.
- Escape → przywróć poprzednią wartość.
- Pola workflow **disabled** gdy deal `won`/`lost` (opcjonalnie z tooltipem) — wyjątek: sekcja „Inne” tylko odczyt.

## Komponenty

- `deal-detail-sidebar.tsx` lub `deal-about-card.tsx` + `deal-extra-card.tsx`.

## Done when

- [ ] Wszystkie pola edytowalne z tabel działają inline.
- [ ] Kontakt i firma — combobox + karta podglądu jak screen.
- [ ] Kwota + waluta zapisują się razem.
- [ ] Pola zablokowane w statusie terminalnym.

## Poza zakresem

- Prawa kolumna (→ T-18-09).
- Dialog finalizacji (→ T-18-10).
