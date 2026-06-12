# US-43 — Produkty: katalog tylko do odczytu

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-19, US-31, US-22 (notyfikacje)  
**Źródło:** [`demo-feedback-iteration-2-spec.md`](../../demo-feedback-iteration-2-spec.md) §2, §10, §13, §14

## Jako

użytkownik CRM (demo)

## Chcę

przeglądać katalog produktów bankowych bez możliwości ręcznej edycji — jak po synchronizacji z systemów bankowych

## Aby

narracja demo była zgodna z rzeczywistością BK (produkty i ceny niedocjowane, katalog zarządzany centralnie)

## Zakres

### W zakresie

- Usunięcie CRUD z UI `/products` (przycisk „Nowy produkt”, edycja, usuwanie).
- Podgląd read-only na `/products/[id]` zamiast `ProductForm`.
- Usunięcie kolumny **Cena** i filtra **Rodzaj ceny**.
- Usunięcie kolumny checkbox (row select) w tabeli.
- Losowa notyfikacja (~30% / sesja) o aktualizacji katalogu przy wejściu na `/products`.

### Poza zakresem

- Usuwanie pól `price` / `priceKind` z typu i seedu JSON.
- Prawdziwa synchronizacja z systemem produktowym.

## Kryteria akceptacji (story)

- [x] Brak możliwości utworzenia lub edycji produktu z UI.
- [x] Szczegóły produktu są tylko do odczytu; brak ceny w widokach.
- [x] Tabela bez checkboxów wyboru wiersza.
- [x] Notyfikacja sync pojawia się zgodnie z regułą demo.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-43-01](./tasks/T-43-01-remove-products-crud-ui.md) | Done | — |
| [T-43-02](./tasks/T-43-02-product-detail-read-only.md) | Done | T-43-01 |
| [T-43-03](./tasks/T-43-03-remove-price-from-products.md) | Done | — |
| [T-43-04](./tasks/T-43-04-remove-products-row-select.md) | Done | — |
| [T-43-05](./tasks/T-43-05-product-catalog-sync-notification.md) | Done | US-22 |

## Kolejność implementacji (agent)

1. T-43-01, T-43-03, T-43-04 (równolegle)  
2. T-43-02  
3. T-43-05
