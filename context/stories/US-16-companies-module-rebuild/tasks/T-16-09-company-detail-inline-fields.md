# T-16-09 — Karta firmy: lewa kolumna — edycja optimistic inline

**Story:** [US-16](../story.md)  
**Status:** Done  
**Zależy od:** [T-16-04](./T-16-04-combobox-contact-picker.md), [T-16-08](./T-16-08-company-detail-layout-shell.md)

## Cel

Pola po lewej stronie jak na screenie: **klik w wartość lub placeholder** → tryb edycji → zapis do Context **bez** osobnego Sheet/Dialog „Zapisz całość”.

## Sekcje (Cards)

### „O firmie”

| Etykieta PL | Pole | Tryb edycji |
| --- | --- | --- |
| Nazwa firmy | `name` | `Input` |
| Media społecznościowe | `socialMedia` | `Input` |
| Telefon | `phones` | lista Input + dodaj/usuń |
| E-mail | `emails` | j.w. |
| Link | `website` | `Input` |
| Dane firmy | stub | przycisk „+ Dodaj” → `Empty` / toast „Etap 1” |
| Kontakty | `contactIds` | `ContactCombobox` |

### „Dodatkowo”

| Etykieta PL | Pole | Tryb edycji |
| --- | --- | --- |
| Komentarze | `comments` | `Textarea` |
| Źródło | `source` | `Select` |
| Typ firmy | `companyType` | `Select` |
| Adres | `address` | `Textarea` lub `Input` |

## Wzorzec UX: `InlineEditableField` (propozycja)

- Stan lokalny: `isEditing`.
- Widok: `button`/`div` z `role="button"`, `tabIndex={0}`, placeholder „Wprowadź wartość…” gdy puste (`text-muted-foreground`).
- Klik / Enter → kontrolka; **blur** lub **Enter** (dla Input) → `updateClient` + wyjście z edycji.
- **Optimistic:** UI aktualizuje się od razu; przy błędzie rollback (w demo wystarczy synchronny Context).
- Brak przycisku „Anuluj” — Escape przywraca poprzednią wartość (opcjonalnie, zalecane).

## Komponent

- `company-detail-sidebar.tsx` lub `company-about-card.tsx` + `company-extra-card.tsx`.

## Done when

- [ ] Wszystkie pola z tabel powyżej (oprócz stubów) edytują się inline i zapisują w sesji.
- [ ] Wielokrotne telefony/e-maile działają jak w formularzu pracownika.
- [ ] Kontakty: ten sam combobox co przy tworzeniu.
- [ ] Placeholder PL jak na screenie tam, gdzie puste.

## Poza zakresem

- Zmiana opiekuna (`ownerId`) — tylko wyświetlenie w nagłówku (T-16-08).
- Prawa kolumna (→ T-16-10).
