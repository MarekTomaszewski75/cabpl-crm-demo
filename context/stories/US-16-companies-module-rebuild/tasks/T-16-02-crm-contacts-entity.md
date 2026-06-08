# T-16-02 — Encja kontaktu CRM (`CrmContact`) + seed

**Story:** [US-16](../story.md)  
**Status:** Done  
**Zależy od:** [T-16-01](./T-16-01-company-types-and-seed.md)

## Cel

Osobna encja **osoby kontaktowej** (moduł Kontakty w przyszłości) — dziś seed + typy pod combobox na firmie.

> **Uwaga:** `ContactEvent` w `types/crm.ts` to zdarzenia kanałów (spotkanie, telefon, e-mail) — **nie** mylić z `CrmContact`.

## Zakres techniczny

### `types/crm.ts`

```ts
export interface CrmContact {
  id: string
  firstName: string
  lastName: string
  emails: string[]
  phones: string[]
}
```

### `data/contacts.json`

- Min. **8–12** kontaktów z polskimi imionami/nazwiskami.
- Część z co najmniej jednym e-mailem (wyszukiwanie w combobox).

### `lib/crm/contact-id.ts`

- `createNextContactId(existing: readonly { id: string }[]): string` — wzorzec jak `employee-id.ts`.

### `lib/crm/contact-display.ts`

- `formatContactName(contact: CrmContact): string`
- Opcjonalnie `formatContactOptionLabel` (imię + e-mail).

### `lib/data/seed.ts` + `loadSeedData`

- Pole `contacts: CrmContact[]` w stanie seed.

### Seed firm

- Po utworzeniu pliku: przypisać `contactIds` do 2–3 firm demo.

## Done when

- [ ] `contacts.json` ładuje się w dev.
- [ ] Typ `CrmContact` oddzielony od `ContactEvent`.
- [ ] Helpery ID i wyświetlania nazwy gotowe do użycia w T-16-04.

## Poza zakresem

- Strona `/contacts` (stub zostaje).
- CRUD w Context (→ T-16-03).
