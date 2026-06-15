# T-48-03 — Tabela kontaktów `/contacts`

**Story:** [US-48](../story.md)  
**Status:** Done  
**Zależy od:** [T-48-02](./T-48-02-contact-company-bindings-lib.md)

## Cel

Zastąpić placeholder modułu Kontakty działającą tabelą w scope użytkownika.

## Zakres

### Komponenty (propozycja)

- `components/crm/contacts-columns.tsx` — definicje kolumn.
- `components/crm/contacts-table.tsx` — DataTable + `getScopedContacts`.
- `app/(dashboard)/contacts/page.tsx` — render `ContactsTable` (client component lub wrapper).

### Kolumny

| Kolumna | Implementacja |
| --- | --- |
| Imię i nazwisko | `formatContactName` |
| E-mail | pierwszy email; tooltip z resztą |
| Telefon | pierwszy telefon; tooltip z resztą |
| Firmy | badge / linki `Link` → `/clients/[id]` |
| Relacja | jedna firma → rola; wiele → skrót (max 2 + „+N”) lub lista `Firma · rola` |

### RBAC

- Guard na stronie: `executive` → `redirect('/dashboard')` (lub komunikat braku dostępu).
- Dane: `getScopedContacts(user, demoData)`.

### Pusty stan

- `Empty` PL: „Brak kontaktów w Twoim zakresie”.

### Wzorzec UI

- Jak [`clients-table.tsx`](../../../../components/crm/clients-table.tsx) — `Card`, nagłówek „Kontakty”.
- Pole wyszukiwania — stub lub pełna integracja jeśli T-49-02 gotowy (opcjonalnie w tym tasku bez search).

## Done when

- [ ] `/contacts` pokazuje tabelę zamiast `ModulePlaceholder`.
- [ ] Anna widzi podzbiór kontaktów; Jan (executive) nie ma dostępu do widoku.
- [ ] Kolumny Firmy i Relacja zgodne ze specyfikacją.

## Poza zakresem

- Sidebar nav (→ T-48-04).
- Wyszukiwanie (→ US-49 T-49-02) — dopuszczalny follow-up w tym samym PR jeśli prosty.
