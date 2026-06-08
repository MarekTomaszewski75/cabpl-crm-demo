# T-17-08 — Karta leada: lewa kolumna — edycja optimistic inline

**Story:** [US-17](../story.md)  
**Status:** Done  
**Zależy od:** [T-17-06](./T-17-06-lead-detail-layout-shell.md), [T-16-04](../../../US-16-companies-module-rebuild/tasks/T-16-04-combobox-contact-picker.md)

## Cel

Pola po lewej jak na screenie Uspacy — **klik → edycja → zapis** do Context (reuse wzorca `InlineEditableField` z firm).

## Sekcje (Cards)

### „O leadzie”

| Etykieta PL | Pole | Tryb edycji |
| --- | --- | --- |
| Nazwa | `name` | `Input` |
| Kontakt | `contactId` | `ContactCombobox` |
| Nazwa firmy | `companyName` | `Input` |
| Stanowisko | `position` | `Input` |
| Telefon | `phones` | lista Input + dodaj/usuń |
| E-mail | `emails` | j.w. |
| Media społecznościowe | `socialMedia` | `Input` |

### „Dodatkowo”

| Etykieta PL | Pole | Tryb edycji |
| --- | --- | --- |
| Komentarz | `comments` | `Textarea` |
| Źródło | `source` | `Select` |
| Typ leada | `leadType` | `Select` + „Brak” |

## Wzorzec UX

- Jak T-16-09: placeholder „Wprowadź wartość …” (`text-muted-foreground`).
- Blur / Enter → `updateLead`.
- Escape → przywróć poprzednią wartość (zalecane).

## Komponenty

- `lead-detail-sidebar.tsx` lub `lead-about-card.tsx` + `lead-extra-card.tsx`.
- Reuse `InlineEditableField` jeśli wydzielony przy firmach — nie duplikować logiki.

## Done when

- [ ] Wszystkie pola z tabel edytują się inline.
- [ ] Wielokrotne telefony/e-maile jak u pracownika/firmy.
- [ ] Kontakt: ten sam combobox co przy tworzeniu.
- [ ] Pola disabled / tylko odczyt gdy lead `won` lub `lost` (opcjonalnie z tooltipem).

## Poza zakresem

- Prawa kolumna (→ T-17-09).
- Dialog finalizacji (→ T-17-10).
