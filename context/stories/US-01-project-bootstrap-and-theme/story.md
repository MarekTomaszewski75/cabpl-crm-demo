# US-01 — Project bootstrap & CA theme

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** —

## Jako

deweloper przygotowujący demo

## Chcę

mieć działający szkielet Next.js + shadcn z brandingiem Credit Agricole

## Aby

kolejne moduły CRM budować na spójnym fundamencie UI

## Kryteria akceptacji

- [ ] `npm run dev` startuje bez błędów
- [ ] shadcn skonfigurowany (`components.json`, `components/ui/`)
- [ ] Tokeny kolorów CA w `globals.css` zgodne z [`design-guide.md`](../../design-guide.md) i [`screen.png`](../../assets/screen.png)
- [ ] `Toaster` (sonner) i ewentualnie `ThemeProvider` w root layout
- [ ] Podstawowe komponenty shadcn dodane: `button`, `card`, `sidebar`, `table`, `dialog`, `sheet`, `tabs`, `badge`, `avatar`, `separator`, `skeleton`, `chart` (jeśli dostępny)

## Taski

| Task | Opis | Status |
|------|------|--------|
| [T-01-01](./tasks/T-01-01-verify-next-shadcn.md) | Weryfikacja / init Next + shadcn | Done |
| [T-01-02](./tasks/T-01-02-ca-theme-globals.md) | Paleta CA w `globals.css` | Done |
| [T-01-03](./tasks/T-01-03-root-providers.md) | Providers + podstawowe komponenty UI | Done |

## Odniesienia

- [`requirements.md`](../../requirements.md) §11.1, §11.5  
- [`ui-context.md`](../../ui-context.md)
