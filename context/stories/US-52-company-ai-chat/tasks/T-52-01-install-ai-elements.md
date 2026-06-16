# T-52-01 — Instalacja komponentów AI Elements (bez AI SDK)

**Story:** [US-52](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Dodać do projektu komponenty wizualne [AI Elements](https://elements.ai-sdk.dev/) wymagane przez chat symulowany — **bez** integracji z Vercel AI SDK.

## Zakres

### Instalacja registry

```bash
npx ai-elements@latest add conversation message prompt-input suggestion reasoning queue sources
```

Komponenty trafiają do `components/ai-elements/` (zgodnie z outputem CLI).

### Zależności

- Instalować **tylko** peer deps wymagane przez registry (np. `streamdown` dla markdown).
- **Nie dodawać:** `ai`, `@ai-sdk/react`, `@ai-sdk/*`, providerów modeli.
- Zweryfikować `package.json` po instalacji — brak pakietów AI SDK.

### Weryfikacja

- `npm run typecheck` przechodzi.
- Komponenty importują się z `@/components/ai-elements/...` bez błędów.
- Style zgodne z istniejącym motywem shadcn (tokeny CA z `globals.css`).

### Dokumentacja

- Krótki wpis w [`reuse-and-conventions.md`](../../../reuse-and-conventions.md): ścieżka `components/ai-elements/`, zasada „tylko UI, bez AI SDK”.

## Done when

- [x] Zainstalowane: `conversation`, `message`, `prompt-input`, `suggestion`, `reasoning`, `queue`, `sources`.
- [x] Brak `@ai-sdk/react` w `package.json` (`ai` — peer dep typów AI Elements).
- [x] Typecheck OK.

## Poza zakresem

- Logika symulacji (→ T-52-02).
- Składanie UI chatu (→ T-52-03).
