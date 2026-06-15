# US-48 — Moduł Kontakty (model, helpery, lista globalna)

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-03, US-05, US-16  
**Źródło:** [`contacts-and-documents-spec.md`](../../contacts-and-documents-spec.md) §1, §2

## Jako

doradca korporacyjny / regionalny menedżer (demo)

## Chcę

przeglądać centralną listę kontaktów powiązanych z moim portfelem — z firmami i rolą w organizacji klienta

## Aby

szybko znaleźć osobę kontaktową bez przechodzenia przez każdą kartę firmy osobno

## Zakres

### W zakresie

- Typ `ContactClientLink` + seed `data/contact-client-links.json`.
- Helper `lib/crm/contact-company-bindings.ts` — powiązania firma / deal / lead, RBAC, deduplikacja ról.
- Strona `/contacts` — tabela DataTable (kolumny: imię i nazwisko, e-mail, telefon, firmy, relacja).
- Nawigacja: pozycja **Kontakty** w grupie „CRM i sprzedaż” dla `advisor` i `regional_manager` (kolejność: Leady · Deale · **Kontakty** · Firmy · Produkty).
- Executive: brak pozycji w sidebarze; `/contacts` → redirect na `/dashboard` (guard).
- Zastąpienie `getCompanyContacts` logiką z bindings (używane też w US-49).

### Poza zakresem

- Karta szczegółów `/contacts/[id]`.
- CRUD kontaktu z listy (tworzenie nadal przez combobox).
- Wyszukiwanie (→ US-49, T-49-02 może być równolegle po T-48-03).
- Zakładka Kontakty na firmie (→ US-49).

## Kryteria akceptacji (story)

- [x] Doradca i menedżer widzą „Kontakty” w sidebarze; executive — nie.
- [x] Tabela pokazuje wyłącznie kontakty w scope użytkownika.
- [x] Kontakt z deala/leada widoczny na liście z powiązanymi firmami i rolą.
- [x] Firmy w tabeli są linkami do `/clients/[id]`.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-48-01](./tasks/T-48-01-contact-client-link-types-seed.md) | Done | — |
| [T-48-02](./tasks/T-48-02-contact-company-bindings-lib.md) | Done | T-48-01 |
| [T-48-03](./tasks/T-48-03-contacts-table-page.md) | Done | T-48-02 |
| [T-48-04](./tasks/T-48-04-contacts-nav-sidebar.md) | Done | T-48-03 |

## Kolejność implementacji (agent)

1. T-48-01 → T-48-02 → T-48-03 → T-48-04
