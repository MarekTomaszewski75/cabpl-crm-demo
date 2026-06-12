# T-42-01 — Instalacja Dice UI File Upload

**Story:** [US-42](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Dodać komponent registry `@diceui/file-upload` do projektu.

## Zakres

```bash
npx shadcn@latest add @diceui/file-upload
```

- Plik: `components/ui/file-upload.tsx`.
- Wpis w [`reuse-and-conventions.md`](../../../reuse-and-conventions.md): import pattern, link do [docs](https://www.diceui.com/docs/components/radix/file-upload).
- **Bez** dodatkowego stylizowania poza tokenami projektu.

## Done when

- [x] Komponent importuje się z `@/components/ui/file-upload`.
- [x] `npm run dev` bez błędów kompilacji.

## Poza zakresem

- Wrapper CRM i integracja z panelami (→ T-42-03, T-42-04).
