# US-51 — Scalenie Pliki i Dokumenty

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-42, US-33, US-34, US-35  
**Źródło:** [`contacts-and-documents-spec.md`](../../contacts-and-documents-spec.md) §6

## Jako

doradca korporacyjny (demo)

## Chcę

zarządzać dokumentacją w jednej zakładce **Dokumenty** z uploadem pliku, nazwą i opisem

## Aby

nie przełączać się między „Plikami” a „Dokumentami” i mieć spójny widok DMS w demo

## Zakres

### W zakresie

- Rozszerzenie `ClientFile` / `LeadFile` / `DealFile`: `displayName`, `description?`.
- Context: `add*File` przyjmuje nazwę i opis; migracja seedu (`displayName = fileName`).
- Jedna zakładka **Dokumenty** (bez **Pliki**) na firmie, leadzie, dealu.
- Lista scalona: pliki + legacy `*Document` (adapter w UI).
- Formularz: upload + pole Nazwa (domyślnie `file.name`) + pole Opis (opcjonalne).
- Wpis w [`reuse-and-conventions.md`](../../reuse-and-conventions.md).

### Poza zakresem

- Usunięcie typów `*Document` z Context (cleanup P2).
- Prawdziwy storage / podgląd PDF.
- Scalanie encji w jeden typ `EntityDocument` (P2).

## Kryteria akceptacji (story)

- [x] Brak zakładki Pliki na firmie, leadzie i dealu.
- [x] Upload z nazwą i opisem zapisuje się i widać na liście.
- [x] Istniejące pliki i dokumenty z seedu w jednej liście.
- [x] Wskaźnik Dokumenty na firmie nadal poprawnie liczy pozycje.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-51-01](./tasks/T-51-01-file-types-display-name-seed.md) | Done | — |
| [T-51-02](./tasks/T-51-02-context-add-file-metadata.md) | Done | T-51-01 |
| [T-51-03](./tasks/T-51-03-merged-documents-tab-panels.md) | Done | T-51-02 |
| [T-51-04](./tasks/T-51-04-document-upload-form-name-description.md) | Done | T-51-03 |

## Kolejność implementacji (agent)

1. T-51-01 → T-51-02 → T-51-03 → T-51-04
