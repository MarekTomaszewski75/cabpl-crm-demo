# Project overview — CABPL CRM Demo

## Cel projektu

Interaktywne **demo CRM** dla **Credit Agricole Bank Polska S.A.** (bankowość korporacyjna), pokazujące wartość **Etapu 1 „Quick Win”** przed wdrożeniem docelowego systemu Enterprise (Etap 2).

Demo ma przekonać wąską grupę decyzyjną (Członek Zarządu, Menedżer ds. CRM, IT BK), że:

- szybki start jest realny (3–6 miesięcy na produkcję Quick Win),
- priorytetem są raportowanie zarządcze i lejek sprzedażowy,
- rozwiązanie może rosnąć bez konieczności „zaorania” prototypu,
- od początku myślimy o KNF / compliance.

## Kontekst biznesowy (skrót)

| Aspekt | Wartość |
|--------|---------|
| Skala | ~1500 aktywnych klientów korporacyjnych |
| Obecny stan | Rozproszone narzędzia (m.in. Access), presja na cyfryzację |
| Prezentacja klientowi | Okno **8–19 czerwca 2026** |
| Forma | Działające demo z laptopa (**wysoce preferowane**) |

Szczegóły: [`CABPL-CRM-notka.md`](./CABPL-CRM-notka.md).

## Zakres funkcjonalny demo (Etap 1)

1. Dashboard wykonawczy (plan, forecast, podziały)
2. Lejek sprzedażowy z rolami i drag & drop
3. Klienci korporacyjni (lista + karta lite)
4. Leady, zadania, kalendarz spotkań
5. Historia kontaktów (uproszczona) + next best action
6. Ekran zgodności / roadmapa Etapu 2

Pełna lista: [`requirements.md`](./requirements.md).

## Poza zakresem

- Deploy, hosting, CI/CD
- Baza danych, integracje z core banku
- Pełny Client 360° i Case Management (tylko zapowiedź)
- Prawdziwe dane klientów

## Dostarczenie

| Element | Opis |
|---------|------|
| Aplikacja | Next.js + shadcn, `npm run dev` na laptopie |
| Dane | Seed JSON + stan w sesji (React Context) |
| Auth | Mock — wybór użytkownika demo |
| Materiały obok demo | Opcjonalny one-pager Etap 1 vs 2 (poza repo aplikacji) |

## Dokumentacja projektu (`.context/`)

| Plik | Rola |
|------|------|
| [`requirements.md`](./requirements.md) | Wymagania biznesowe i techniczne |
| [`architecture-context.md`](./architecture-context.md) | Stack, struktura, wzorce |
| [`ui-context.md`](./ui-context.md) | Reguły UI / layout |
| [`design-guide.md`](./design-guide.md) | Tokeny CA, auth & app shell ([`assets/screen.png`](./assets/screen.png)) |
| [`code-standards.md`](./code-standards.md) | Standardy kodu i skille |
| [`ai-workflow-rules.md`](./ai-workflow-rules.md) | Praca agentów AI |
| [`reuse-and-conventions.md`](./reuse-and-conventions.md) | Decyzje do ponownego użycia |
| [`progress-tracker.md`](./progress-tracker.md) | Aktualny stan implementacji |
| [`stories/README.md`](./stories/README.md) | Indeks user stories i tasków |

## Persony demo

- **Członek Zarządu** — dashboard, agregaty
- **Regionalny Menedżer** — lejek zespołu, region
- **Doradca** — własny pipeline, klienci, zadania
- **Menedżer ds. CRM / IT** — UX, role, compliance

## Scenariusz prezentacji (15–20 min)

Zgodnie z [`requirements.md` §6](./requirements.md): login zarząd → menedżer → doradca → karta klienta → compliance / roadmap.
