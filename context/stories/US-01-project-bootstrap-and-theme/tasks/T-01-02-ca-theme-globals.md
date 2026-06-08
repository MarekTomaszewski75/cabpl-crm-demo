# T-01-02 — CA theme in globals.css

**Story:** [US-01](../story.md)  
**Status:** Done  
**Zależy od:** T-01-01

## Cel

Tokeny marki zgodne z [`.context/assets/screen.png`](../../../assets/screen.png) i [`.context/design-guide.md`](../../../design-guide.md).

## Zakres

- Edycja `app/globals.css` (plik z `npx shadcn info`)
- Zmienne **`--ca-*`** (shell, limonka, link, danger, …) — patrz design-guide §2
- Mapowanie shadcn: `--primary` = limonka `#99CC00`, `--primary-foreground` = ciemny tekst na CTA, `--sidebar` = shell `#404B5A`, `--background` main app = jasny szary
- `--ring` / focus input = limonka (jak obramowanie na screenie)
- `@theme inline` — opcjonalnie `--color-ca-shell` itd. dla klas `bg-ca-shell`
- Bez raw `bg-green-500` w komponentach

## Done when

- [ ] Przycisk `Button` default wygląda jak „Dalej” (limonka + ciemny tekst, możliwy `rounded-full` na auth)
- [ ] Sidebar tokeny = ciemny shell + jasny tekst
- [ ] Zgodność z [`design-guide.md`](../../../design-guide.md) i [`ui-context.md`](../../../ui-context.md)
