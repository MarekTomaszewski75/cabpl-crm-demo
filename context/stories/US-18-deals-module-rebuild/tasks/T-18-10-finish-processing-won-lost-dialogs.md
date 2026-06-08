# T-18-10 — Zakończ przetwarzanie: dialog Wygrano / Stracony deal

**Story:** [US-18](../story.md)  
**Status:** Done  
**Zależy od:** [T-18-02](./T-18-02-demo-data-deal-crud.md), [T-18-07](./T-18-07-deal-status-bar.md)

## Cel

Jeden flow finalizacji deala — wywoływany z paska **Zakończ przetwarzanie**, przycisków **Wygrany deal** / **Stracony deal** w nagłówku.

## Wejście

- Deal w statusie workflow (nie `won`/`lost`).
- `canFinishDeal(status) === true`.

## Dialog — krok 1 (wybór wyniku)

`Dialog` z `DialogTitle`:

- **Wygrano** → krok 2a  
- **Stracony deal** → krok 2b  

(Można od razu dwa tryby z przycisków nagłówka — ten sam komponent z `initialMode: "won" | "lost"`.)

## Krok 2a — Wygrano

- Krótkie potwierdzenie (bez dodatkowych pól w Etap 1 — deal już ma dane z karty).
- Opcjonalnie podgląd: nazwa, kwota, firma, kontakt.

**Submit:** `winDeal(id, { finishedByUserId })` → toast sukces.

**Efekt danych:**

- Deal: `status: "won"`, `finishedByUserId`, `finishedAt`, `firstFinishedByUserId` (jeśli pierwsza finalizacja).
- Feed: wpis `deal_won`.

## Krok 2b — Stracony deal

| Pole | Kontrolka |
| --- | --- |
| Uzasadnienie | `Select` lub `RadioGroup` — 6 wartości `DealLostReason` |

**Submit:** `loseDeal(id, reason)` → toast.

**Efekt:** `status: "lost"`, `lostReason`, metadane zakończenia; feed `deal_lost`.

## Po finalizacji

- Pasek statusów w trybie read-only (T-18-07).
- Przyciski Wygrany/Stracony ukryte lub disabled.
- Lewa kolumna — pola workflow disabled (T-18-08).
- Sekcja „Inne” wypełniona metadanymi.

## Komponenty

- `deal-finish-dialog.tsx` — props: `deal`, `open`, `onOpenChange`, `defaultMode?: "won" | "lost"`.

## Done when

- [ ] Wygrana ustawia `won` + metadane.
- [ ] Przegrana wymaga uzasadnienia z listy 6 pozycji PL.
- [ ] Deal terminalny nie otwiera ponownie dialogu (lub komunikat).
- [ ] Wszystkie trzy wejścia (pasek + 2 przyciski) działają.

## Poza zakresem

- Tworzenie firmy/kontaktu przy wygranej (to flow leada US-17; deal już istnieje).
- Produkty na dealu.
