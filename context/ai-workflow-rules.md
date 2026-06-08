# AI workflow rules — CABPL CRM Demo

Reguły dla agentów (Cursor) pracujących nad tym repozytorium.

## 1. Zacznij od kontekstu

1. Przeczytaj **[`progress-tracker.md`](./progress-tracker.md)** — gdzie jesteśmy, czego nie duplikować.
2. Sprawdź **[`reuse-and-conventions.md`](./reuse-and-conventions.md)** — istniejące helpery i decyzje.
3. Dla bieżącej pracy otwórz **story** i **task** z [`stories/`](./stories/README.md).

## 2. Jedna jednostka pracy = jeden task

- Implementuj **jeden task** na iterację (np. `T-06-02-dnd-stage-change.md`).
- Po ukończeniu:
  - ustaw **Status: Done** w pliku tasku,
  - zaktualizuj **story** jeśli wszystkie taski Done,
  - dopisz **krótki** wpis w **`progress-tracker.md`** (sekcje *Recently completed* / *Active work*).

## 3. Progress tracker — mały plik

- **Nie** wklejaj całych diffów ani długich opisów do `progress-tracker.md`.
- Wpis = 1–3 zdania + linki do story/task.
- Szczegóły techniczne → task lub `reuse-and-conventions.md`.

## 4. Scope i szybkość

- Priorytet: **ścieżka prezentacji** z [`requirements.md` §6](./requirements.md).
- Nie dodawaj deployu, DB, testów E2E, API REST — chyba że user explicite prosi.
- Nie refaktoryzuj niepowiązanego kodu.
- Preferuj rozszerzenie istniejących komponentów z `components/crm/`.

## 5. shadcn i Next.js

- Przed nowym komponentem UI: sprawdź zainstalowane (`npx shadcn@latest info`) i skill **shadcn**.
- Dodawanie komponentów: `npx shadcn@latest add …` — nie kopiuj ręcznie z internetu.
- Granice RSC: skill **next-best-practices**.

## 6. Dane i auth

- Mutacje tylko przez **DemoDataContext**.
- Filtrowanie list przez **`filterByScope`** — nie duplikuj warunków `ownerId` w każdej stronie.
- Mock login — bez `.env` i NextAuth.

## 7. Dokumentacja decyzji

Gdy wprowadzasz wzorzec do ponownego użycia (np. `useScopedOpportunities`, format PLN):

- Dodaj sekcję w **[`reuse-and-conventions.md`](./reuse-and-conventions.md)** z ścieżką pliku i przykładem użycia.

## 8. User stories — bez epików

- Nie twórz warstwy „epic” — tylko **`US-xx`** i **`T-xx-yy`**.
- Kolejność story: [`stories/README.md`](./stories/README.md).

## 9. Komunikacja z użytkownikiem

- Po tasku: krótko co zrobiono + co następne (nazwa tasku / story).
- Nie proponuj deployu ani produkcyjnego hardeningu bez prośby.

## 10. Pliki źródłowe prawdy

| Temat | Plik |
|-------|------|
| Biznes | `requirements.md`, `CABPL-CRM-notka.md` |
| Architektura | `architecture-context.md` |
| UI | `ui-context.md`, `design-guide.md` |
| Kod | `code-standards.md` |
| Postęp | `progress-tracker.md` |
