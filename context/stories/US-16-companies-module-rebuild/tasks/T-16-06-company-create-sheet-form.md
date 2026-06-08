# T-16-06 — Formularz tworzenia firmy (Sheet)

**Story:** [US-16](../story.md)  
**Status:** Done  
**Zależy od:** [T-16-03](./T-16-03-demo-data-company-crud.md), [T-16-04](./T-16-04-combobox-contact-picker.md)

## Cel

`company-form.tsx` + `company-form-dialog.tsx` — ten sam wzorzec co pracownicy: **Sheet** z prawej, wspólny formularz, `layout="sheet"`.

## Pola formularza (tworzenie)

| Pole | Kontrolka |
| --- | --- |
| Nazwa | `Input` |
| Telefony | wiele `Input` + dodaj/usuń wiersz (jak `employee-form`) |
| E-maile | j.w. |
| Kontakty | `ContactCombobox` (T-16-04) |
| Komentarze | `Textarea` / `InputGroupTextarea` |
| Źródło | `Select` — 5 wartości ze story |
| Typ firmy | `Select` — 8 wartości ze story |
| Adres | `Input` lub `Textarea` (jedna linia wystarczy) |

**Nie pokazywać** w formularzu: opiekun (auto), NIP, segment.

## Walidacja (submit)

- `name` — wymagane.
- E-maile / telefony — opcjonalne; jeśli podane, podstawowa sanity (np. niepusty trim).
- Błędy: `data-invalid` + `FieldError`; sukces: `toast` sonner.
- **Bez** gwiazdek i HTML `required`.

## Integracja

- `useSession()` przekazać user do `addClient`.
- `onSuccess(createdClient)` — callback z ID (użyje T-16-07).
- Montowanie formularza w Sheet tylko gdy `open` + `key="new"`.

## Done when

- [ ] Sheet „Nowa firma” otwiera się z listy (T-16-05).
- [ ] Zapis tworzy firmę z polami i `contactIds`.
- [ ] Toast „Firma została dodana” (lub spójna fraza PL).
- [ ] Formularz spełnia reguły shadcn (`FieldGroup`, `gap`, nie `space-y`).

## Poza zakresem

- Redirect po zapisie (→ T-16-07).
- Edycja na karcie inline (→ T-16-09).
