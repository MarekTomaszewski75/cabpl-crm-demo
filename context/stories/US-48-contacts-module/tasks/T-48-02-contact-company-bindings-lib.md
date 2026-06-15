# T-48-02 — lib/crm/contact-company-bindings.ts

**Story:** [US-48](../story.md)  
**Status:** Done  
**Zależy od:** [T-48-01](./T-48-01-contact-client-link-types-seed.md)

## Cel

Jedna logika powiązań kontakt–firma (firma, deal, lead) z RBAC i priorytetem roli.

## Zakres

### Nowy plik `lib/crm/contact-company-bindings.ts`

Stałe PL (np. `CONTACT_BINDING_DEAL_FALLBACK_LABEL = "Kontakt deala"`).

Funkcje:

| Funkcja | Opis |
| --- | --- |
| `getContactCompanyBindingsForClient(clientId, data, user)` | Wszystkie bindings dla jednej firmy |
| `getContactsForClient(clientId, data, user)` | `EnrichedContactRow[]` — unikalne kontakty + bindings dla firmy |
| `getScopedContacts(user, data)` | Kontakty widoczne w scope użytkownika (lista globalna) |
| `isContactInUserScope(contactId, user, data)` | Helper RBAC |

### Reguły (spec §2.2)

- **company:** `contactId ∈ client.contactIds` → rola z `ContactClientLink`.
- **deal:** `deal.clientId === clientId` && `deal.contactId` → rola z linku company lub fallback.
- **lead:** `lead.clientId === clientId` && `lead.contactId` → `lead.position` lub fallback.
- Deduplikacja `(contactId, clientId)`; priorytet roli: link company → lead.position → fallback.

### Refaktor

- `getCompanyContacts` w `company-engagement-counts.ts` — delegacja do `getContactsForClient` (licznik `contacts` bez zmiany semantyki).
- Usunąć / oznaczyć deprecated starą implementację opartą wyłącznie o `contactIds`.

## Done when

- [ ] Kontakt z deala/leada pojawia się w `getContactsForClient` bez wpisu w `contactIds`.
- [ ] `getScopedContacts` respektuje RBAC (doradca ≠ cały seed).
- [ ] `getScopedCompanyEngagementCounts().contacts` używa nowej logiki.

## Poza zakresem

- Komponenty UI (→ T-48-03, US-49).
