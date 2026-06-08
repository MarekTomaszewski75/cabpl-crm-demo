# T-04-01 — SessionContext & useSession

**Story:** [US-04](../story.md)  
**Status:** Done

## Cel

`lib/auth/demo-session.tsx` — przechowuje `DemoUser` z seed.

## API

- `login(userId: string)`
- `logout()`
- `user: DemoUser | null`

Opcjonalnie: `sessionStorage` pod kluczem `cabpl-demo-session`.

## Done when

- [x] Hook dokumentowany w `reuse-and-conventions.md`
