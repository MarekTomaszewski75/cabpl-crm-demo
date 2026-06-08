# T-16-01 — Typy firmy, enumy i migracja seed

**Story:** [US-16](../story.md)  
**Status:** Done

## Cel

Rozszerzyć `Client` o pola modułu Firmy (Uspacy) i zaktualizować seed bez psucia powiązań z pipeline.

## Zakres techniczny

### `types/crm.ts`

- Dodać typy: `CompanySource`, `CompanyType`.
- Rozszerzyć `Client`:
  - `phones: string[]`
  - `emails: string[]`
  - `contactIds: string[]`
  - `comments: string`
  - `source: CompanySource | null` *(lub wymagane z domyślnym `unknown` — ustalić w implementacji; seed: sensowne wartości)*
  - `companyType: CompanyType`
  - `address: string`
  - `website: string` *(opcjonalne, domyślnie `""`)*
  - `socialMedia: string` *(opcjonalne, domyślnie `""`)*
- Pola legacy **`nip`**, **`segment`** — zostają (używane przez szanse / dashboard); nie usuwać z typu.

### `lib/crm/company-labels.ts` (nowy)

- Mapy PL dla `CompanySource` i `CompanyType`.
- Tablice opcji do `Select` / filtrów (`COMPANY_SOURCE_OPTIONS`, `COMPANY_TYPE_OPTIONS`).

### `data/clients.json`

- Uzupełnić wszystkie rekordy o nowe pola (realistyczne wartości demo).
- `contactIds` — puste lub powiązania po T-16-02 (można zaktualizować w T-16-02).

### `lib/data/seed.ts`

- Ładowanie bez zmian kontraktu poza rozszerzonym `Client`.

## Done when

- [ ] TypeScript kompiluje się z nowym kształtem `Client`.
- [ ] Wszystkie firmy w seed mają `companyType` i tablice `phones`/`emails` (min. puste `[]`).
- [ ] Etykiety PL zgodne z wartościami z story (Źródło, Typ firmy).
- [ ] Istniejące `id` firm (`client-001` …) **bez zmian** — pipeline i leady działają.

## Poza zakresem

- Mutacje Context (→ T-16-03).
