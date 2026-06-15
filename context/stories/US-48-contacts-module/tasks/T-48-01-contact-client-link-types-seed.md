# T-48-01 — Typy ContactClientLink i seed

**Story:** [US-48](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Model bezpośredniego powiązania kontakt ↔ firma ze stanowiskiem/funkcją oraz dane demo.

## Zakres

### `types/crm.ts`

```ts
export interface ContactClientLink {
  contactId: string
  clientId: string
  roleAtCompany: string
}
```

Eksport typów agregatu (do T-48-02, można dodać tutaj lub w następnym tasku):

- `ContactCompanyBindingSource`
- `ContactCompanyBinding`
- `EnrichedContactRow` (kontakt + bindings w scope)

### Seed

- Nowy plik `data/contact-client-links.json` — min. 8–10 par z realistycznymi rolami PL (np. „Dyrektor finansowy”, „Prezes”).
- Powiązania zgodne z istniejącymi `Client.contactIds` w `data/clients.json`.
- Zweryfikować w seedzie deali/leadów: min. 1–2 kontakty **tylko** przez `deal.contactId` / `lead.contactId` (bez wpisu w `contactIds` firmy) — do prezentacji reguły pochodzenia.

### `lib/data/seed.ts`

- Wczytać `contact-client-links.json` do stanu początkowego Context (tablica `contactClientLinks` lub równoważna).

### Context (szkic)

- Stan: `contactClientLinks: ContactClientLink[]`.
- Przy `updateClient` / zmianie `contactIds`: synchronizacja linków (dodanie pary z pustą `roleAtCompany` jeśli brak w seedzie).

## Done when

- [ ] Typy eksportowane z `types/crm.ts`.
- [ ] Seed linków wczytywany bez błędów walidacji.
- [ ] Context udostępnia `contactClientLinks` (odczyt; zapis sync — minimum pod T-48-02).

## Poza zakresem

- Helper wyprowadzania bindings (→ T-48-02).
- UI listy kontaktów.
