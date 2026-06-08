# US-04 — Mock authentication

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-01, US-02 (users seed)

## Jako

prezenter demo

## Chcę

wybrać użytkownika z listy i wejść do aplikacji bez prawdziwego SSO

## Aby

pokazać różne role na spotkaniu (wyloguj → inny użytkownik)

## Kryteria akceptacji

- [x] `/login` — ekran enterprise, 4 konta demo
- [x] `SessionProvider` + `useSession()`
- [x] Wylogowanie czyści sesję
- [x] Brak `.env`, NextAuth, walidacji hasła

## Taski

| Task | Status |
|------|--------|
| [T-04-01](./tasks/T-04-01-session-context.md) | Done |
| [T-04-02](./tasks/T-04-02-login-page.md) | Done |
| [T-04-03](./tasks/T-04-03-protected-layout.md) | Done |
