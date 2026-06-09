# US-32 — Formularz i karta deala: produkt i pasek lejka

**Status:** Done  
**Priorytet:** P1  
**Zależy od:** US-27, US-28, US-29, US-30  
**Specyfikacja:** [products-deal-pipelines-spec.md §8](../../products-deal-pipelines-spec.md)

## Jako

doradca korporacyjny (demo)

## Chcę

tworzyć deal **z przypisanym produktem bankowym** i śledzić postęp na **pasku statusów** dopasowanym do kategorii produktu

## Aby

zamknąć pętlę deal → produkt → lejek na karcie szczegółów i w formularzu tworzenia

## Zakres

### W zakresie

- `deal-form.tsx` / `DealFormDialog`:
  - pole **Produkt** (Combobox lub Select z wyszukiwaniem) — **wymagane**;
  - po wyborze: readonly podgląd **Kategorii** i krótka informacja o lejku;
  - `name` — sugestia z nazwy produktu (+ klient jeśli wybrany);
  - zapis: `productId`, `pipelineCategoryId`, `status: 'new'` przez `addDeal`.
- `deal-detail-sidebar.tsx`:
  - sekcja **Produkt** (readonly) + **Kategoria** (readonly) dla dealów po utworzeniu;
  - zmiana produktu tylko gdy `status === 'new'` (spec §4.1).
- `deal-status-bar.tsx`:
  - segmenty = `getPipelineWorkflowSteps(deal.pipelineCategoryId)` + finał;
  - klik / nawigacja jak US-18 — zmiana statusu w obrębie lejka;
  - etykiety z `getDealStatusLabel`.
- Usunąć / zastąpić stub zakładki „Produkty” na karcie deala — informacja w sidebarze wystarczy (spec §8.1).
- `winLead` / `lead-finish-dialog`: przy tworzeniu deala z leada — wybór **produktu** (rozszerzenie `WIN_PIPELINE_OPTIONS` lub osobny select produktów aktywnych).

### Poza zakresem

- Wiele produktów na jednym dealu.
- Edycja katalogu produktów z karty deala.
- Karta produktu.

## Kryteria akceptacji (story)

- [x] Nie można zapisać nowego deala bez produktu (walidacja + toast).
- [x] Po zapisie deal ma poprawne `pipelineCategoryId` z produktu.
- [x] Pasek statusów na `/pipeline/[id]` pokazuje kroki lejka kategorii deala (nie US-18).
- [x] Sidebar pokazuje produkt i kategorię; produkt nieedytowalny po wyjściu ze statusu `new`.
- [x] Wygrana leada z opcją produktu tworzy spójny deal (smoke jednej ścieżki).

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-32-01](./tasks/T-32-01-deal-form-product-field.md) | Done | US-28 |
| [T-32-02](./tasks/T-32-02-deal-status-bar-pipeline.md) | Done | US-27 |
| [T-32-03](./tasks/T-32-03-deal-detail-product-sidebar.md) | Done | T-32-01 |
| [T-32-04](./tasks/T-32-04-win-lead-product-selection.md) | Done | T-32-01 |

## Kolejność implementacji (agent)

1. T-32-01 → T-32-02 ∥ T-32-03 → T-32-04

## Wpływ na dokumentację

[`requirements.md`](../../requirements.md) §6 — nowy deal z produktem na ścieżce prezentacji.
