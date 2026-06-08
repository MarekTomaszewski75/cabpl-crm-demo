# Architecture context — CABPL CRM Demo

## Zasady nadrzędne

1. **Szybkość wytworzenia** — najprostsze działające rozwiązanie na prezentację.
2. **Tylko laptop** — `npm run dev`, localhost, bez deployu.
3. **Bez bazy danych** — seed JSON + stan w pamięci (React Context).
4. **Mock auth** — wybór użytkownika, bez NextAuth / SSO / `.env` pod auth.

## Stack

| Warstwa | Wybór |
|---------|--------|
| Framework | Next.js (App Router), TypeScript |
| UI | shadcn/ui + Tailwind CSS |
| Wykresy | recharts lub shadcn `Chart` |
| Drag & drop | @dnd-kit (lejek) |
| Stan globalny | React Context (`Session`, `DemoData`) |
| Ikony | Zgodnie z `components.json` / `npx shadcn info` (zwykle lucide-react) |

## Struktura katalogów (docelowa)

```
app/
  (auth)/login/           # mock login
  (dashboard)/            # chroniony layout + moduły CRM
    page.tsx              # redirect wg roli
    dashboard/
    pipeline/
    clients/[id]/
    leads/
    tasks/
    calendar/
    compliance/
components/
  ui/                     # shadcn
  crm/                    # KpiCard, PipelineBoard, …
data/                     # *.json — seed tylko
lib/
  auth/demo-session.tsx
  rbac/scope.ts
  data/demo-data-context.tsx
  format/pl.ts            # pl-PL, PLN
types/
  crm.ts
```

## Warstwy logiczne

### 1. Seed (`data/*.json`)

- Źródło prawdy **przed startem** sesji dev.
- Edycja ręczna przed prezentacją.
- Relacje: `ownerId`, `regionId`, `clientId`, itd.

### 2. DemoDataContext (klient)

- Wczytuje seed przy mount.
- Udostępnia kolekcje + mutacje (`updateOpportunity`, `addTask`, …).
- **Brak zapisu na dysk** — restart `npm run dev` = reset do seed.

### 3. SessionContext (klient)

- Aktualny użytkownik demo (`userId`, `role`, `displayName`).
- Persist opcjonalnie: `sessionStorage`.
- `logout()` → `/login`.

### 4. RBAC (`lib/rbac/scope.ts`)

- `filterByScope<T>(items, user)` — jedna funkcja dla list.
- `canAccessEntity(entity, user)` — szczegóły / 404.
- `canSeeNavItem(item, user)` — menu boczne.

Role: `advisor` | `regional_manager` | `executive` (nazwy w kodzie mogą być enum).

### 5. Routing

- `(auth)` — publiczny login.
- `(dashboard)` — layout z `CrmAppShell`; jeśli brak sesji → redirect `/login`.
- Strona główna po logowaniu zależna od roli (np. executive → `/dashboard`, advisor → `/pipeline`).

## RSC vs Client Components

- **Preferuj Client Components** dla ekranów z Context, DnD, wykresami interaktywnymi.
- Server Components tylko tam, gdzie nie ma interakcji i realnie upraszczają kod.
- Nie buduj Route Handlers / API „na zapas”.

## Co nie budujemy

- ORM, Prisma, Postgres
- NextAuth, middleware SSO (opcjonalny lekki guard w layout — nie wymagany)
- `npm run build` jako gate
- Testy E2E (chyba że explicite requested)
- Zapis mutacji do plików JSON na dysku

## Integracja z wymaganiami

Szczegóły techniczne: [`requirements.md` §11](./requirements.md).

Konwencje utrwalone w trakcie pracy: [`reuse-and-conventions.md`](./reuse-and-conventions.md).
