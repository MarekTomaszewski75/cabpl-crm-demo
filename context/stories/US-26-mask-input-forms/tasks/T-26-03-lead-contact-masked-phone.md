# T-26-03 — Mask Input: telefon w leadzie i kontakcie

**Story:** [US-26](../story.md)  
**Status:** Done  
**Zależy od:** T-26-01

## Cel

Maskowanie numeru telefonu w formularzach leada i kontaktu CRM.

## Zakres techniczny

### `components/crm/lead-form.tsx`

- Pole telefonu (pierwszy z tablicy `phones` lub pojedyncze pole UI) → maska PL:
  - propozycja: `+48 ### ### ###` custom pattern lub `phone` z transform pod PL.
- Zapis: cyfry w `phones[0]` (zgodnie z istniejącym modelem).

### `components/crm/contact-form.tsx` (lub inline w combobox create)

- To samo dla telefonu kontaktu.

### Wielokrotne telefony

- Jeśli UI ma listę telefonów — maska tylko na pierwszym polu lub każdym `Input` w liście (minimum: jedno pole na demo).

## Done when

- [x] Telefon formatuje się podczas wpisywania w leadzie i kontakcie.
- [x] Zapis do Context bez regresji seedu.
- [x] Placeholder / `maskPlaceholder` po polsku opcjonalnie.

## Poza zakresem

- `employee-form` phones.
