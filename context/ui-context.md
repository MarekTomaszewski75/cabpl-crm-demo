# UI context — CABPL CRM Demo

## Charakter interfejsu

**Enterprise / corporate banking CRM** — zgodny wizualnie z ekosystemem **Credit Agricole** (logowanie eBank / CA24). Referencja: [`.context/assets/screen.png`](./assets/screen.png) i pełna specyfikacja w **[`design-guide.md`](./design-guide.md)**.

- **Auth:** ciemne tło shell (`#404B5A`), biała karta, CTA limonkowy (`#99CC00`)
- **Aplikacja:** ciemny sidebar + jasny obszar roboczy, ten sam akcent primary
- Desktop-first, język PL

## Design system

| Dokument | Zawartość |
|----------|-----------|
| **[`design-guide.md`](./design-guide.md)** | Tokeny `--ca-*`, mapowanie shadcn, auth shell, app shell, komponenty |
| **shadcn/ui** | `components/ui/` — semantic colors, nie raw hex w JSX |
| **`components/crm/`** | `CrmAuthShell`, `CrmAppShell`, `KpiCard`, `PipelineBoard`, … |

Implementacja tokenów: `app/globals.css` (zadanie T-01-02).

## Layout aplikacji

| Obszar | Zawartość |
|--------|-----------|
| **Sidebar** (~240px), tło **shell** | Logo CA (białe), nawigacja, badge „Demo” |
| **Header** | Breadcrumb, tytuł, avatar + rola + wyloguj (jasny pasek) |
| **Main** | Tło jasne (`--background`), moduły w `Card` / tabelach |

Nawigacja modułów:

- Panel zarządczy *(executive)*
- Lejek sprzedażowy
- Klienci · Leady · Zadania · Kalendarz
- Zgodność i roadmapa

Szczegóły wizualne sidebaru: [`design-guide.md` §6](./design-guide.md).

## Komponenty shadcn — typowe zastosowania

| Potrzeba | Komponent |
|----------|-----------|
| Tabele | `Table` + toolbar |
| KPI | `Card` (Header/Title/Content) |
| Formularze | `FieldGroup` + `Field` |
| Overlays | `Dialog` / `Sheet` + **Title** |
| Statusy | `Badge` |
| Puste | `Empty` |
| Toast | `sonner` |
| Wykresy | `Chart` |
| Banery (login) | `Alert` |

Reguły składni: skill **shadcn** + [`design-guide.md` §9](./design-guide.md).

## Formatowanie

- `formatCurrencyPln`, `formatDatePl` — `lib/format/pl.ts`
- Waluta i daty: `pl-PL`

## Role a UI

| Rola | Widoczność |
|------|------------|
| Executive | Dashboard, agregaty |
| Regional manager | Lejek regionu |
| Advisor | Własny pipeline, klienci, zadania |

Przełączenie roli: wyloguj → inny użytkownik na `/login`.

## Ekran logowania (mock)

Wzorowany na **screen.png**, z uproszczeniem funkcjonalnym:

- Pełnoekranowe tło `--ca-shell`, logo białe u góry
- Biała karta `rounded-2xl`: **wybór 4 kont demo** (bez hasła / MFA)
- Przycisk pill limonkowy „Zaloguj” / „Dalej”
- Opcjonalnie dolne banery informacyjne (Alert) — jak na screenie
- **Bez** zakładek retail/biznes — patrz [`design-guide.md` §5](./design-guide.md)

## Logo

- [`credit-agricole-logo-inline.svg`](./assets/credit-agricole-logo-inline.svg) — na shell: `className="h-8 w-auto fill-white"` (lub `text-white` + currentColor)

## Tryb prezentacji

- **Light** w module CRM (main content)
- Dark mode — nie priorytet
- Responsywność: desktop

## Odniesienia

- [`design-guide.md`](./design-guide.md) — **główna specyfikacja wizualna**
- [`requirements.md`](./requirements.md) §5
- [`code-standards.md`](./code-standards.md)
