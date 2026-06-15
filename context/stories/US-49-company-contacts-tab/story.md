# US-49 — Firma: zakładka Kontakty i wyszukiwanie

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-48, US-45  
**Źródło:** [`contacts-and-documents-spec.md`](../../contacts-and-documents-spec.md) §3, §4

## Jako

doradca / menedżer (demo)

## Chcę

na karcie firmy widzieć kontakty w zakładce Sprzedaż i relacje oraz wyszukiwać je po imieniu, e-mailu i telefonie

## Aby

mieć ten sam obraz relacji co na liście globalnej Kontakty — w kontekście jednej firmy i w polu wyboru kontaktu

## Zakres

### W zakresie

- Podzakładka **Kontakty** w „Sprzedaż i relacje”: **Leady · Deale · Kontakty · Zadania**.
- Tabela kontaktów firmy (kolumny: imię i nazwisko, e-mail, telefon, relacja; opcjonalny badge źródła Firma/Deal/Lead).
- `lib/crm/contact-search.ts` + pole szukaj na `/contacts` i na podzakładce firmy.
- `ContactComboboxField` — filtrowanie po e-mailu i telefonie (nie tylko po etykiecie opcji).
- Klik wskaźnika **Kontakty** (Ogólne) → podzakładka Kontakty; usunięcie inline `CompanyContactsList` z panelu aktywności.

### Poza zakresem

- Edycja roli kontaktu na liście (P2).
- Karta szczegółów kontaktu.

## Kryteria akceptacji (story)

- [x] Podzakładka Kontakty między Deale a Zadania.
- [x] Kontakty z deali/leadów widoczne z relacją.
- [x] Wyszukiwanie działa na `/contacts`, podzakładce firmy i w comboboxie.
- [x] Wskaźnik Kontakty prowadzi do podzakładki (bez duplikatu listy pod feedem).

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-49-01](./tasks/T-49-01-company-contacts-subtab.md) | Done | [US-48 T-48-02](../US-48-contacts-module/tasks/T-48-02-contact-company-bindings-lib.md) |
| [T-49-02](./tasks/T-49-02-contact-search-lib-and-ui.md) | Done | T-49-01 |
| [T-49-03](./tasks/T-49-03-contacts-indicator-navigation.md) | Done | T-49-01 |

## Kolejność implementacji (agent)

1. T-49-01 → T-49-02 i T-49-03 (równolegle po T-49-01)
