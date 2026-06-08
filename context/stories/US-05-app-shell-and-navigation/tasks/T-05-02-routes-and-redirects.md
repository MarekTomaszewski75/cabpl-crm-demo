# T-05-02 — Route stubs & role-based home redirect

**Story:** [US-05](../story.md)  
**Status:** Done  
**Zależy od:** T-05-01

## Cel

Struktura tras pod scenariusz prezentacji.

## Trasy (puste page OK)

- `/dashboard`
- `/pipeline`
- `/clients`, `/clients/[id]`
- `/leads`
- `/tasks`
- `/calendar`
- `/compliance`

## Redirect

`(dashboard)/page.tsx`:

- `executive` → `/dashboard`
- `regional_manager` → `/pipeline`
- `advisor` → `/pipeline`

## Done when

- [x] Wszystkie linki w sidebar nie dają 404
