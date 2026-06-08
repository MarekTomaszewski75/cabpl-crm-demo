# T-19-07 — Sheet „Nowy produkt”

**Story:** [US-19](../story.md)  
**Status:** Done  
**Zależy od:** [T-19-02](./T-19-02-demo-data-product-crud.md), [T-19-03](./T-19-03-products-list-page-shell.md)

## Cel

Formularz tworzenia produktu w **Sheet** (shadcn) — wzorzec `employee-form-dialog.tsx` / `lead-form-dialog.tsx`.

## Zakres techniczny

### Pliki

- `components/crm/product-form.tsx` — pola + walidacja + `onSuccess`; `layout: "sheet"`.
- `components/crm/product-form-dialog.tsx` — `Sheet` + `SheetTrigger` „+ Dodaj” / „Nowy produkt”.
- Podłączenie triggera w `products-table.tsx` (T-19-03).

### Pola formularza (Sheet)

| Etykieta PL | Pole | Kontrolka | Wymagane |
| --- | --- | --- | --- |
| Artykuł | `name` | `Input` | tak |
| Kod produktu | `sku` | `Input` | nie |
| Towar/Usługa | `goodsOrService` | `Select` | tak |
| Kategoria | `categoryId` | `Select` z `productCategories` | tak |
| Typ produktu | `productType` | `Select` | tak |
| Cena | `price` | `Input` type number | nie |
| Waluta | `currency` | `Select` | tak (domyślnie PLN) |
| Rodzaj ceny | `priceKind` | `Select` | tak |
| Dostępność | `availability` | `Select` | tak |
| Stan | `condition` | `Select` | tak (domyślnie `draft` lub `active` — ustalić w implementacji: demo `active`) |
| Aktywny | `isActive` | `Switch` lub checkbox Field | domyślnie `true` |
| Opis | `description` | `Textarea` | nie |

- **Auto:** `ownerId`, `regionId` z `useSession()`; `createdAt` w `addProduct`.
- Walidacja przy submit — `Field` + `FieldError` (bez gwiazdek, bez HTML `required`).
- Toast sukcesu (`sonner`); zamknięcie Sheet; reset formularza (`key` na `open`).

### Sheet UX ([`reuse-and-conventions.md`](../../../reuse-and-conventions.md))

- `SheetContent` szeroki (`sm:max-w-5xl`).
- `SheetHeader` `shrink-0` + `border-b`; scroll w treści; `SheetFooter` z submit.
- Montować form tylko gdy `open`.

## Done when

- [x] „+ Dodaj” otwiera Sheet z formularzem.
- [x] Walidacja: nazwa + kategoria (+ wymagane selecty).
- [x] Zapis przez `addProduct`; produkt pojawia się na liście bez przeładowania.
- [x] Toast „Dodano produkt” (lub spójna fraza z innymi modułami).
- [x] Brak redirectu na kartę (karta poza zakresem US-19).

## Poza zakresem

- Edycja produktu (Sheet/Dialog) — osobna iteracja.
- Upload zdjęcia / załączników produktu.
