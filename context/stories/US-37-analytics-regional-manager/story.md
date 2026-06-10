# US-37 — Analityka: panel menedżera regionalnego

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-36, US-39  
**Źródło:** [`analytics-roles-rebuild-spec.md`](../../analytics-roles-rebuild-spec.md) §2

## Jako

regionalny menedżer (Marek Wiśniewski, demo)

## Chcę

monitorować wyniki zespołu doradców — ranking, aktywność, lejek regionu i ryzyka operacyjne

## Aby

szybko zidentyfikować kto dowozi plan, kto ma zaległe zadania i gdzie potrzebne jest wsparcie menedżerskie

## Zakres

### W zakresie

- Preset **Mój zespół** — pełna siatka widżetów spec §2.4.
- Widżety: wyniki doradców (Bar), aktywność zespołu (Area), profil doradców (Radar), ranking (Tabela), konwersja lead→deal (Line).
- Reuse US-20: lejek dealów, zadania po terminie wg opiekuna, zadania wg priorytetu.
- Presety alternatywne: **Sprzedaż i lejek**, **Aktywność operacyjna**.
- Klik wiersza rankingu → filtr Doradca.
- Opcjonalna tabela dealów wymagających uwagi (preset Aktywność).

### Poza zakresem

- Widżety bank-wide / scorecard regionów (US-38).
- `won-amount-by-source` — ukryty dla menedżera.
- Gamifikacja rankingu.

## Kryteria akceptacji (story)

- [x] Preset **Mój zespół** zawiera ≥ 6 widżetów z danymi demo (Anna + Piotr).
- [x] **Radar** — 2 serie doradców, ≥ 4 wymiary.
- [x] **Tabela rankingu** — sort po wygranych PLN; klik ustawia filtr doradcy.
- [x] **Area** aktywności — stacked, niepusty dla Mazowsza.
- [x] 3 presety przełączalne bez błędów.
- [x] Prezentacja: Marek → Analityka → Mój zespół (§7.2 spec).

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-37-01](./tasks/T-37-01-manager-preset-grid-wiring.md) | Done | [US-36](../US-36-analytics-role-aware-shell/story.md) T-36-02 |
| [T-37-02](./tasks/T-37-02-advisor-won-amount-widget.md) | Done | T-37-01, [T-39-02](../US-39-analytics-shadcn-charts/tasks/T-39-02-area-chart-component.md) |
| [T-37-03](./tasks/T-37-03-team-activity-area-widget.md) | Done | T-37-01, T-39-02 |
| [T-37-04](./tasks/T-37-04-advisor-radar-widget.md) | Done | T-37-01, [T-39-05](../US-39-analytics-shadcn-charts/tasks/T-39-05-radar-chart-component.md) |
| [T-37-05](./tasks/T-37-05-advisor-ranking-table-widget.md) | Done | T-37-01 |
| [T-37-06](./tasks/T-37-06-lead-conversion-and-alt-presets.md) | Done | T-37-01, [T-39-03](../US-39-analytics-shadcn-charts/tasks/T-39-03-line-chart-component.md) |

## Kolejność implementacji (agent)

1. T-37-01  
2. T-37-02, T-37-03, T-37-04, T-37-05 równolegle  
3. T-37-06
