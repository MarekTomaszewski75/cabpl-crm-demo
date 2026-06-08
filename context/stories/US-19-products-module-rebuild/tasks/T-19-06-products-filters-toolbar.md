# T-19-06 — Pasek filtrów szybkich (dropdowny)

**Story:** [US-19](../story.md)  
**Status:** Done  
**Zależy od:** [T-19-04](./T-19-04-products-table-and-columns.md)

## Cel

Pięć dropdownów filtrów jak na screenie Uspacy — **Aktywność**, **Dostępność**, **Cena**, **Typ produktu**, **Stan** — działają łącznie z wyszukiwaniem i filtrem kategorii.

## Zakres techniczny

### Umiejscowienie

- Pasek **pod** nagłówkiem / przełącznikiem widoków, **nad** tabelą (oba tryby lista i drzewo).
- Wiersz `flex flex-wrap gap-2` z komponentami `Select` (Etap 1 — single select wystarczy; multi — P2).

### Filtry

| Etykieta UI | Pole / logika | Wartości |
| --- | --- | --- |
| Aktywność | `isActive` | Wszystkie · Aktywny · Nieaktywny |
| Dostępność | `availability` | Wszystkie + enum `ProductAvailability` |
| Cena | `priceKind` | Wszystkie + enum `ProductPriceKind` |
| Typ produktu | `productType` | Wszystkie + enum `ProductType` |
| Stan | `condition` | Wszystkie + enum `ProductCondition` |

- Domyślna wartość każdego selecta: **„Wszystkie”** (brak filtra na tym wymiarze).
- **Tag „Aktywne produkty”** w nagłówku (T-19-03): gdy widoczny → wymusza `isActive === true`; usunięcie tagu → Aktywność = Wszystkie (zsynchronizować stan).

### Implementacja filtrowania

- Funkcja `filterProducts(products, filters)` — czysta, testowalna w pliku `lib/crm/product-filters.ts` (opcjonalnie).
- Łączenie: `categoryId` + `searchQuery` + 5 dropdownów + tag aktywnych.
- Licznik wyników w paginacji aktualizuje się po filtrach.

### Przycisk „Filtry”

- Jeśli już widoczny pasek dropdownów — przycisk może być **dekoracyjny** (active state gdy którykolwiek filtr ≠ Wszystkie) lub rozwijać sekcję na mobile — minimum: spójny wygląd ze screenem.

## Done when

- [x] Wszystkie 5 dropdownów renderuje się i filtruje tabelę.
- [x] Filtry działają łącznie z kategorią i wyszukiwaniem.
- [x] Tag „Aktywne produkty” synchronizowany z filtrem Aktywność.
- [x] Reset do domyślnych wartości po wejściu na stronę (tag aktywnych włączony).

## Poza zakresem

- Zapisywanie zestawów filtrów (pin, licznik „0”).
- `DataTableFacetedFilter` — dopuszczalny zamiennik Select, jeśli spójniejszy z employees; story preferuje **dropdowny jak Uspacy**.
