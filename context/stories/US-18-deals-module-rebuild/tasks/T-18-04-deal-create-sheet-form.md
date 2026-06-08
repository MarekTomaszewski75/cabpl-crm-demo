# T-18-04 — Formularz tworzenia deala (Sheet)

**Story:** [US-18](../story.md)  
**Status:** Done  
**Zależy od:** [T-18-02](./T-18-02-demo-data-deal-crud.md), [T-16-04](../../../US-16-companies-module-rebuild/tasks/T-16-04-combobox-contact-picker.md)

## Cel

`deal-form.tsx` + `deal-form-dialog.tsx` — wzorzec **Sheet** jak leady / firmy.

## Pola formularza (tworzenie)

| Pole | Kontrolka |
| --- | --- |
| Nazwa | `Input` — **wymagane** |
| Kwota | `Input` type number — opcjonalne |
| Waluta | `Select` — `DealCurrency` (domyślnie PLN) |
| Kontakt | `ContactCombobox` — reuse US-16 |
| Komentarz | `Textarea` |
| Źródło | `Select` — 6 wartości `DealSource` |
| Typ dealu | `Select` — 5 wartości + opcja „Brak” (`null`) |

**Nie pokazywać:** opiekun (auto), status, firma (na karcie po utworzeniu).

## Walidacja

- `name` — trim, wymagane.
- `amount` — jeśli podane, liczba ≥ 0.
- Błędy: `data-invalid` + `FieldError`; sukces: `toast` sonner.
- **Bez** HTML `required` / gwiazdek.

## Integracja

- `useSession()` → `ownerId`, `regionId` przy `addDeal`.
- `status: "new"`, `createdAt: now`, `currency` z selecta lub `PLN`.
- `onSuccess(createdDeal)` — callback z ID (T-18-05).
- Sheet: montuj form tylko gdy `open` + `key="new"`.

## Done when

- [ ] Sheet „Nowy deal” z listy (T-18-03).
- [ ] Zapis tworzy deal z polami formularza + auto opiekun.
- [ ] Toast PL po sukcesie.
- [ ] `FieldGroup` + reguły shadcn.

## Poza zakresem

- Redirect (→ T-18-05).
- Inline na karcie (→ T-18-08).
- Firma w formularzu tworzenia.
