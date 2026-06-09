# T-23-02 — Banery systemowe i krytyczne deale

**Story:** [US-23](../story.md)  
**Status:** Done  
**Zależy od:** T-23-01

## Cel

Zarejestrować banery startowe: komunikat demo + alert o krytycznym dealu w scope użytkownika.

## Zakres techniczny

### `lib/crm/banner-rules.ts`

- `CRITICAL_DEAL_AMOUNT_PLN = 500_000`
- `CRITICAL_DEAL_HOURS = 48`
- `getCriticalDealBanner(deals, user, asOfDate): BannerPayload | null`
- `SYSTEM_DEMO_BANNER` — stały payload info, dismissible.

### `components/crm/crm-banner-controller.tsx` (client)

- `useSession`, `useDemoData`, `useBanners`.
- `useEffect`: po ready — `onBannerAdd` systemowy (priority 0) + krytyczny deal (priority 10) jeśli reguła spełniona.
- Banner deal: `BannerActions` z `Button asChild` → `Link href={/pipeline/[id]}`; `BannerClose`.

### Seed (jeśli potrzeba)

- Jeden deal w scope doradcy: `amount` ≥ 500k, `expectedCloseDate` w 48h — dopisać w `opportunities.json` tylko jeśli T-21-02 nie pokrywa.

### Scope

- Banner deal **tylko** gdy `deal.ownerId === user.id` (lub `filterByScope` zawiera deal).

## Done when

- [x] Po zalogowaniu widać banner systemowy (do zamknięcia).
- [x] Dla doradcy z krytycznym dealem — banner warning/destructive z linkiem.
- [x] Zamknięcie banera nie psuje layoutu; priorytet deal > system przy kolejce.

## Poza zakresem

- Banner dla leadów (follow-up jeśli PO zażąda).
