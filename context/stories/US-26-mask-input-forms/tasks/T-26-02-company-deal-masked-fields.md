# T-26-02 — Mask Input: firma (NIP) i deal (kwota)

**Story:** [US-26](../story.md)  
**Status:** Done  
**Zależy od:** T-26-01

## Cel

Podpiąć maskowanie w formularzach firmy i deala — pola o najwyższej wartości na prezentacji.

## Zakres techniczny

### `components/crm/company-form.tsx`

- Pole **NIP** → `MaskInput` custom 10 cyfr; zapis unmasked do modelu.
- Pole **kod pocztowy** (jeśli w adresie jako osobne pole) → `##-###`; jeśli adres jednym stringiem — pominąć.

### `components/crm/deal-form.tsx`

- Pole **kwota** (`amount`) → `mask="currency"`, `locale="pl-PL"`, `currency="PLN"`.
- Zapis: liczba do `amount` (parse z unmasked / wartości maski).

### UX

- Zachować `Field` / `FieldLabel` z shadcn FieldGroup.
- `invalid` + komunikat walidacji jeśli NIP niepełny przy submit.

## Done when

- [x] NIP i kwota formatują się podczas wpisywania.
- [x] Zapis przez Context poprawny dla nowego i edytowanego rekordu.
- [x] Wklejanie numeru NIP działa sensownie.

## Poza zakresem

- REGON, employee-form.
