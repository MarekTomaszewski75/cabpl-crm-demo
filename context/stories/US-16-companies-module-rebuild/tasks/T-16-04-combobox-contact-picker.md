# T-16-04 — Combobox kontaktów (shadcn) + tworzenie in-place

**Story:** [US-16](../story.md)  
**Status:** Done  
**Zależy od:** [T-16-02](./T-16-02-crm-contacts-entity.md), [T-16-03](./T-16-03-demo-data-company-crud.md)

## Cel

Współdzielony komponent wyboru kontaktów z wyszukiwaniem (shadcn **Combobox**) i możliwością **dodania kontaktu**, gdy brak na liście.

## Zakres techniczny

### CLI

- Dodać brakujący komponent: `npx shadcn@latest add combobox` (zgodnie z `packageManager` projektu).
- Przed użyciem: `npx shadcn@latest docs combobox` — API projektu (base radix/base).

### `components/crm/contact-combobox.tsx` (propozycja nazwy)

- **Wiele wartości:** lista wybranych `contactIds` + chipy / lista pod combobox (wzorzec jak wiele e-maili w `employee-form.tsx`).
- Wyszukiwanie po: imię, nazwisko, e-mail.
- Pozycja specjalna na dole listy: **„+ Utwórz kontakt”** → krótki formularz (Dialog lub inline w `Popover`):
  - wymagane: imię, nazwisko;
  - opcjonalnie: jeden e-mail;
  - submit → `addContact` → automatyczne dodanie ID do wyboru.
- Składnia: `Field` + `FieldLabel`; bez `space-y-*`; ikony w Button z `data-icon`.

### Props (szkic)

```ts
type ContactComboboxFieldProps = {
  value: string[]
  onChange: (ids: string[]) => void
  disabled?: boolean
  "aria-invalid"?: boolean
}
```

## Done when

- [ ] Combobox filtruje listę po wpisanym tekście.
- [ ] Można wybrać wiele kontaktów i usunąć wybór.
- [ ] „Utwórz kontakt” dodaje rekord i zaznacza go bez przeładowania strony.
- [ ] Komponent gotowy do użycia w Sheet (T-16-06) i na karcie (T-16-09).

## Poza zakresem

- Pełna strona `/contacts`.
