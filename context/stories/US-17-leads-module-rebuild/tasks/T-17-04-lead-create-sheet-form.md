# T-17-04 — Formularz tworzenia leada (Sheet)

**Story:** [US-17](../story.md)  
**Status:** Done  
**Zależy od:** [T-17-02](./T-17-02-demo-data-lead-crud.md), [T-16-04](../../../US-16-companies-module-rebuild/tasks/T-16-04-combobox-contact-picker.md)

## Cel

`lead-form.tsx` + `lead-form-dialog.tsx` — wzorzec **Sheet** jak pracownicy / firmy.

## Pola formularza (tworzenie)

| Pole | Kontrolka |
| --- | --- |
| Nazwa | `Input` — **wymagane** |
| Kontakt | `ContactCombobox` — reuse US-16 |
| Komentarz | `InputGroupTextarea` / `Textarea` |
| Źródło | `Select` — 6 wartości `LeadSource` |
| Typ leada | `Select` — 5 wartości + opcja „Brak” (`null`) |

**Nie pokazywać:** opiekun (auto), status, firma (opcjonalnie na karcie po utworzeniu).

## Walidacja

- `name` — trim, wymagane.
- Błędy: `data-invalid` + `FieldError`; sukces: `toast` sonner.
- **Bez** HTML `required` / gwiazdek.

## Integracja

- `useSession()` → `ownerId`, `regionId` przy `addLead`.
- `status: "new"`, `createdAt: now`.
- `onSuccess(createdLead)` — callback z ID (T-17-05).
- Sheet: montuj form tylko gdy `open` + `key="new"`.

## Done when

- [ ] Sheet „Nowy lead” z listy (T-17-03).
- [ ] Zapis tworzy lead z polami formularza.
- [ ] Toast PL po sukcesie.
- [ ] `FieldGroup` + reguły shadcn (gap, nie `space-y`).

## Poza zakresem

- Redirect (→ T-17-05).
- Inline na karcie (→ T-17-08).
