# T-01-03 — Root providers & core shadcn components

**Story:** [US-01](../story.md)  
**Status:** Done  
**Zależy od:** T-01-02

## Cel

Root layout gotowy pod aplikację CRM: toasty, komponenty bazowe zainstalowane.

## Zakres

- `npx shadcn@latest add` (tylko brakujące): `button`, `card`, `sidebar`, `table`, `dialog`, `sheet`, `tabs`, `badge`, `avatar`, `separator`, `skeleton`, `sonner`, `chart` (opcjonalnie `empty`, `alert`)
- `<Toaster />` w `app/layout.tsx`
- Placeholder `app/page.tsx` → później przekierowanie (US-05)

## Done when

- [ ] Importy z `@/components/ui/*` działają
- [ ] Toast testowy możliwy z dev strony
