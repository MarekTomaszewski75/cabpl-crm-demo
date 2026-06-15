# T-49-01 — Podzakładka Kontakty na karcie firmy

**Story:** [US-49](../story.md)  
**Status:** Done  
**Zależy od:** [US-48 T-48-02](../../US-48-contacts-module/tasks/T-48-02-contact-company-bindings-lib.md)

## Cel

Tabela kontaktów firmy w zakładce Sprzedaż i relacje — między Deale a Zadania.

## Zakres

### `company-detail-view.tsx`

- Rozszerzyć `CompanyRelatedTab`: `"leady" | "deale" | "kontakty" | "zadania"`.
- `TabsList`: Leady · Deale · **Kontakty** · Zadania (kolejność obowiązkowa).
- `TabsContent value="kontakty"` → nowy komponent listy.

### Komponenty

- `components/crm/company-contacts-table.tsx` (lub rozszerzyć `company-contacts-list.tsx` do DataTable):
  - Dane: `getContactsForClient(client.id, data, user)`.
  - Kolumny: imię i nazwisko, e-mail, telefon, relacja.
  - Opcjonalnie (P1): badge źródła `Firma` / `Deal` / `Lead` przy relacji.

### Reuse

- Kolumny współdzielone z `contacts-columns.tsx` gdzie sensowne (bez kolumny Firmy).

## Done when

- [x] Podzakładka Kontakty widoczna między Deale a Zadania.
- [x] Kontakt powiązany tylko z dealem firmy jest na liście.
- [x] RBAC — tylko kontakty w scope.

## Poza zakresem

- Wyszukiwanie (→ T-49-02).
- Nawigacja ze wskaźnika (→ T-49-03).
