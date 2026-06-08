# Code standards — CABPL CRM Demo

## Skille obowiązkowe

Przy pisaniu i review kodu Next.js / UI **zawsze stosuj**:

| Skill | Ścieżka | Kiedy |
|-------|---------|--------|
| **shadcn** | `.cursor/skills/shadcn/SKILL.md` | Komponenty UI, formularze, layout, CLI shadcn |
| **next-best-practices** | `.cursor/skills/next-best-practices/SKILL.md` | App Router, RSC granice, routing, metadata |

Przed użyciem komponentu shadcn: `npx shadcn@latest docs <component>` (lub runner projektu: `pnpm dlx` / `bunx` według `packageManager`).

## TypeScript

- Strict mode — bez `any` bez uzasadnienia.
- Typy domeny w `types/crm.ts` (User, Client, Opportunity, Lead, Task, Meeting, ContactEvent).
- Import alias `@/` zgodnie z `tsconfig` / `components.json`.

## React / Next.js

- `"use client"` tylko gdy potrzebne (Context, hooks, DnD, wykresy interaktywne).
- Nie przekazuj funkcji ani klas z Server Component do Client Component jako props (chyba że Server Action — **nie używamy** w tym demo).
- Nawigacja: `next/link`, `useRouter` z `next/navigation`.
- Brak Route Handlers dla CRUD — mutacje w Context.

## Struktura plików

- Jedna odpowiedzialność na plik komponentu CRM.
- Logika RBAC w `lib/rbac/`, nie rozproszona po stronach.
- Formatowanie PL w `lib/format/pl.ts`.

## shadcn — reguły krytyczne (skrót)

- Formularze: `FieldGroup` + `Field`, walidacja `data-invalid` / `aria-invalid`.
- Grupy: `SelectItem` w `SelectGroup`, menu items w `DropdownMenuGroup`.
- Dialog/Sheet: zawsze `Title` (może `sr-only`).
- Card: `CardHeader`, `CardTitle`, `CardContent` — nie jeden `CardContent` ze wszystkim.
- Toasty: `sonner`, nie własne divy.
- Puste stany: `Empty`, nie custom markup.

Pełna lista: skill shadcn → Critical Rules.

## Nazewnictwo

- Komponenty React: `PascalCase`.
- Pliki komponentów: `kebab-case.tsx` lub `PascalCase.tsx` — **spójnie z istniejącym repo** po bootstrapie.
- ID encji w danych: string (`"opp-001"`).
- Role w kodzie: stałe enum / union type (`UserRole`).

## Język

- **UI:** polski.
- **Kod:** angielski (nazwy zmiennych, typów, plików).
- Komentarze: tylko nietrywialna logika biznesowa (RBAC, reguły NBA).

## Zakazy (demo)

- Baza danych, Prisma, Drizzle.
- NextAuth, OAuth, prawdziwe hasła.
- Deploy config (`vercel.json` itd.) — poza zakresem.
- Nadpisywanie kolorów shadcn raw Tailwind (`text-blue-600` dla statusów).

## Jakość

- `npm run dev` musi działać po każdej story krytycznej dla prezentacji.
- `npm run build` — nie jest wymagany gate.
- Lint: naprawiaj błędy w dotkniętych plikach.

## Aktualizacja konwencji

Nowe wzorce reuse → [`reuse-and-conventions.md`](./reuse-and-conventions.md).
