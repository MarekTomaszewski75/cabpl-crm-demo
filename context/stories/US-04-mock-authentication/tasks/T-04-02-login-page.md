# T-04-02 — Login page (user picker)

**Story:** [US-04](../story.md)  
**Status:** Done  
**Zależy od:** T-04-01

## Cel

`app/(auth)/login/page.tsx` — wybór jednego z 4 użytkowników.

## UI

- Layout: **`CrmAuthShell`** — patrz [`design-guide.md`](../../../design-guide.md) §5 (tło shell, logo białe, opcjonalne banery Alert)
- `Card` `rounded-2xl` + lista użytkowników (`Avatar`, imię, rola PL, zakres)
- Przycisk pill limonkowy „Zaloguj” / klik wiersza → `login(id)` → redirect
- Wizualna zgodność z [`screen.png`](../../../assets/screen.png) (bez zakładek retail/biznes)

## Done when

- [x] Zgodne z [`design-guide.md`](../../../design-guide.md) i [`ui-context.md`](../../../ui-context.md)
- [x] Polskie etykiety ról
