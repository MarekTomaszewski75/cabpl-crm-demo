# T-49-02 — Wyszukiwanie kontaktów

**Story:** [US-49](../story.md)  
**Status:** Done  
**Zależy od:** [T-49-01](./T-49-01-company-contacts-subtab.md)

## Cel

Wspólna logika filtrowania kontaktów po imieniu, nazwisku, e-mailu i telefonie — trzy miejsca w UI.

## Zakres

### `lib/crm/contact-search.ts`

```ts
export function contactMatchesSearch(
  contact: CrmContact,
  query: string,
): boolean

export function filterContactsBySearch<T extends { contact: CrmContact }>(
  rows: T[],
  query: string,
): T[]
```

- Pola: `firstName`, `lastName`, pełne imię i nazwisko, wszystkie `emails[]`, wszystkie `phones[]`.
- Normalizacja telefonu: usunięcie spacji przed porównaniem.
- Case-insensitive substring.

### UI

| Miejsce | Zmiana |
| --- | --- |
| `contacts-table.tsx` | `InputGroup` + `SearchIcon` nad tabelą (jak `ClientsTable`) |
| `company-contacts-table.tsx` | to samo |
| `contact-combobox.tsx` | filtrowanie listy przez `contactMatchesSearch` (nie tylko domyślny filter Combobox po label) |

## Done when

- [x] Jedna funkcja w `contact-search.ts`.
- [x] Wyszukiwanie działa na `/contacts` i podzakładce Kontakty firmy.
- [x] Combobox na firmie znajduje kontakt po fragmencie numeru telefonu lub e-maila.

## Poza zakresem

- Wyszukiwarka globalna w headerze (inne encje).
