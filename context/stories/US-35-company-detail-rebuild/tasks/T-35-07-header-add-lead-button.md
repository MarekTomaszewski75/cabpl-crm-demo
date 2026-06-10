# T-35-07 — Karta firmy: przycisk + Lead w nagłówku

**Story:** [US-35](../story.md)  
**Status:** Done  
**Zależy od:** [T-35-01](./T-35-01-company-detail-layout-cleanup.md)

## Cel

Przenieść CTA **+ Lead** z usuniętego rzędu zakładek do nagłówka karty.

## Zakres

### `company-detail-header.tsx`

- Przycisk **+ Lead** obok menu ⋮ (prawa strona nagłówka).
- `variant="outline"`, `size="sm"`.
- Demo: `Link` do `/leads` z query `?clientId=${client.id}` (prefill listy / przyszły Sheet — P2).
- Usunąć duplikat z `company-detail-view.tsx` (T-35-01).

## Done when

- [ ] **+ Lead** widoczny w nagłówku, nie przy zakładkach.
- [ ] Link prowadzi do `/leads` z parametrem `clientId`.
- [ ] Brak drugiego przycisku na karcie.

## Poza zakresem

- Sheet „Nowy lead” z prefill `clientId` i `companyName`.
