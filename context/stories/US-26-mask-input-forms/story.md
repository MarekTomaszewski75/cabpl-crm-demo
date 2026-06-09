# US-26 — Mask Input w formularzach (Dice UI)

**Status:** Done  
**Priorytet:** P1  
**Zależy od:** US-16 (firmy), US-17 (leady), US-18 (deale)  
**Specyfikacja:** [crm-specialists-feedback-spec.md §6](../../crm-specialists-feedback-spec.md#6-mask-input--komponent-dice-ui)

## Jako

użytkownik wprowadzający dane w formularzach CRM

## Chcę

wpisywać telefony, NIP, kwoty i kody pocztowe w **przewidywalnym formacie**

## Aby

zmniejszyć błędy wprowadzania na demo i pokazać dbałość o UX formularzy BK

## Zakres

### W zakresie

- Instalacja [Mask Input — Dice UI](https://www.diceui.com/docs/components/radix/mask-input): `npx shadcn@latest add @diceui/mask-input` → `components/ui/mask-input.tsx`.
- Podpięcie w formularzach (minimum 3 moduły):

| Formularz | Pola | Maska |
| --- | --- | --- |
| `company-form` | NIP | custom 10 cyfr |
| `company-form` | kod pocztowy (jeśli pole adresu) | `##-###` |
| `deal-form` | kwota | `currency`, `pl-PL`, `PLN` |
| `lead-form` | telefon | custom PL lub `phone` |
| `contact-form` | telefon | j.w. |

- Zapis do Context: wartość zgodna z modelem (`unmasked` dla NIP/telefonu; liczba dla kwoty).
- **Nie** zastępować `Calendar` + `Popover` dla dat — date picker zostaje.
- Pola wolnego tekstu (nazwa, komentarz) — bez maski.

### Poza zakresem

- Maskowanie wszystkich pól we wszystkich formularzach (`employee-form` — follow-up).
- REGON (jeśli brak pola w UI — pominąć).
- Walidacja po stronie „serwera”.

## Kryteria akceptacji (story)

- [x] `MaskInput` zainstalowany w `components/ui/`.
- [x] Co najmniej 3 formularze używają maski (firma NIP, deal kwota, lead/contact telefon).
- [x] Wklejanie i kursor działają poprawnie (smoke test manualny).
- [x] Zapis nie psuje rekordów seed.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-26-01](./tasks/T-26-01-install-mask-input.md) | Done | — |
| [T-26-02](./tasks/T-26-02-company-deal-masked-fields.md) | Done | T-26-01 |
| [T-26-03](./tasks/T-26-03-lead-contact-masked-phone.md) | Done | T-26-01 |

## Kolejność implementacji (agent)

1. T-26-01 → T-26-02 ∥ T-26-03

## Wpływ na dokumentację

Wpis w [`reuse-and-conventions.md`](../../reuse-and-conventions.md) (`MaskInput`, konwencja zapisu unmasked).
