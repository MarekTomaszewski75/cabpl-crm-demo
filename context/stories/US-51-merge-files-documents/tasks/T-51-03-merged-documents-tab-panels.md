# T-51-03 — Scalona zakładka Dokumenty (×3)

**Story:** [US-51](../story.md)  
**Status:** Done  
**Zależy od:** [T-51-02](./T-51-02-context-add-file-metadata.md)

## Cel

Usunąć zakładkę **Pliki** i pokazać scaloną listę dokumentów w zakładce **Dokumenty** na firmie, leadzie i dealu.

## Zakres

### Typy composera

- `CompanyComposerTab`: `"note" | "activity" | "documents"` — usuń `"files"`.
- Lead/deal: ten sam zestaw zakładek w panelach aktywności.

### Pliki

- `company-activity-panel.tsx`
- `lead-activity-panel.tsx`
- `deal-activity-panel.tsx`

Zmiany:

- `TabsList`: tylko Notatka · Aktywność · **Dokumenty**.
- Usunąć `TabsContent value="files"`.
- Zakładka `documents`: lista z `getMergedDocumentsFor*` (T-51-02).
- Wiersz listy: nazwa (`displayName`), opis, plik/rozmiar, data, autor.
- Legacy `*Document` — ikona dokumentu, brak rozmiaru.
- Usunąć osobny formularz „tylko nazwa dokumentu” (input + „Dodaj dokument” bez pliku) — zastąpi T-51-04.

### Nawigacja wewnętrzna

- `onDocumentsClick` na firmie — `setComposerTab("documents")` (bez zmiany semantyki).

## Done when

- [x] Brak zakładki Pliki na firmie, leadzie, dealu.
- [x] Jedna lista pokazuje pliki i stare dokumenty z seedu.
- [x] `CompanyComposerTab` / lead / deal bez wartości `files`.

## Poza zakresem

- Nowy formularz upload z nazwą/opisem (→ T-51-04).
