# T-23-01 — Instalacja Banner (Dice UI) i provider w shellu

**Story:** [US-23](../story.md)  
**Status:** Done

## Cel

Dodać komponent Banner i osadzić `Banners` provider w aplikacji dashboardowej.

## Zakres techniczny

### Instalacja

```bash
npx shadcn@latest add "@diceui/banner"
```

- Skill **shadcn**: `npx shadcn@latest info` przed instalacją.
- Wynik: `components/ui/banner.tsx`.

### Provider

- W `(dashboard)/layout.tsx` lub `CrmAppShell`: owiń `SidebarInset` / main w `<Banners side="top" maxVisible={2}>`.
- Eksporty: `Banner`, `BannerIcon`, `BannerContent`, `BannerTitle`, `BannerDescription`, `BannerActions`, `BannerClose`, `useBanners`.

### Stylowanie CA

- Nadpisać / dopasować klasy wariantów (`info`, `warning`, `destructive`) do tokenów `--ca-*` / semantic shadcn w `globals.css` lub className na `Banner` — bez fioletowego domyślnego Dice.

## Done when

- [x] `components/ui/banner.tsx` istnieje i build przechodzi.
- [x] Provider w shellu — aplikacja renderuje się bez błędów.
- [x] `useBanners()` dostępny w drzewie dashboardu.

## Poza zakresem

- Reguły biznesowe banerów (→ T-23-02).
