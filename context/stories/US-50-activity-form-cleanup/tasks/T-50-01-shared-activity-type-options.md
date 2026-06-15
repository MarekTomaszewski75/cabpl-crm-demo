# T-50-01 — Wspólne opcje typów aktywności (bez E-mail)

**Story:** [US-50](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Jedna lista typów kanału dla formularza nowej aktywności — bez opcji „E-mail”.

## Zakres

### Refaktor

- Wyciągnąć `ACTIVITY_CHANNEL_TYPE_OPTIONS` (nazwa robocza) do wspólnego pliku, np. `lib/crm/activity-channel-types.ts`:
  - `activity`, `phone`, `meeting`, `chat` — **bez** `email`.
- `company-activity-types.ts` — import opcji formularza z nowego pliku; zachować resztę (priority, `toAddCompanyActivityInput`, itd.).
- Lead i deal — użyć tej samej tablicy w formularzach (zamiast duplikatów).

### Nie zmieniać

- Typ `ChannelContactEventType` w `types/crm.ts` — nadal zawiera `"email"`.
- Seed `contact-events.json` / feed — historyczne wpisy e-mail.
- Ikony w timeline dla typu `email`.

### Formularze

- `company-activity-form.tsx`, `lead-activity-form.tsx`, `deal-activity-form.tsx` — mapowanie przycisków typu z nowej listy.

## Done when

- [x] W trzech formularzach brak przycisku „E-mail”.
- [x] Nowa aktywność nie może mieć typu `email` z UI.
- [x] Feed nadal renderuje stare wpisy e-mail.

## Poza zakresem

- Usunięcie `email` z typów TypeScript lub seedu.
