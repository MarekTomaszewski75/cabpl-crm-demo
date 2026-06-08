# Design guide — CABPL CRM Demo

**Referencja wizualna:** [`.context/assets/screen.png`](./assets/screen.png) (logowanie CA / eBank — klient biznesowy).

Ten dokument definiuje **tokeny, layouty i wzorce komponentów** do implementacji w Next.js + shadcn. W kodzie używaj **semantic tokens** (`bg-primary`, `bg-card`) zmapowanych na wartości poniżej — nie rozproszonych hexów w komponentach.

---

## 1. Dwa powierzchnie UI

| Powierzchnia | Gdzie | Charakter |
|--------------|--------|-----------|
| **Auth shell** | `/login`, ewentualnie pierwsze wejście | Jak na screenie: ciemne tło, biała karta, akcent limonkowy |
| **App shell** | `(dashboard)/*` po zalogowaniu | Sidebar w kolorze **shell**, treść na **jasnym** tle (card/table), akcent **primary** = limonka |

Demo CRM **nie** kopiuje zakładek „Klient indywidualny / biznesowy” w aplikacji — tylko **język wizualny** (kolory, typografia, przyciski, karty).

---

## 2. Paleta (z referencji screen)

Wartości przybliżone z screenu — przy implementacji doprecyzuj w `app/globals.css` (oklch), zachowując kontrast WCAG na przycisku primary.

| Token | Hex (ref.) | Użycie |
|-------|------------|--------|
| `--ca-shell` | `#404B5A` | Tło strony logowania, sidebar aplikacji |
| `--ca-shell-muted` | `#4F5D6E` | Dolny pasek informacyjny (jak „CA24 eBank”) |
| `--ca-lime` | `#99CC00` | Primary CTA, aktywne linki w headerze, ikony info |
| `--ca-lime-hover` | `#8AB800` | Hover primary button |
| `--ca-on-lime` | `#1F2937` | Tekst na limonkowym przycisku („Dalej”) |
| `--ca-card` | `#FFFFFF` | Karta logowania, karty w module |
| `--ca-foreground-on-shell` | `#FFFFFF` | Tekst na ciemnym tle (hero, logo) |
| `--ca-foreground-muted-on-shell` | `#E2E8F0` | Opis pod nagłówkiem hero |
| `--ca-text` | `#1E293B` | Nagłówki w karcie, treść główna |
| `--ca-text-muted` | `#64748B` | Etykiety, secondary text |
| `--ca-border` | `#E2E8F0` | Obramowania inputów (nieaktywny) |
| `--ca-border-focus` | `#99CC00` | Focus ring inputu (jak na screenie) |
| `--ca-link` | `#2563EB` | „Pomoc w logowaniu”, linki pomocnicze |
| `--ca-danger` | `#DC2626` | Alert bezpieczeństwa (ikona / akcent) |
| `--ca-tab-inactive` | `#F1F5F9` | Tło nieaktywnej zakładki |

### Mapowanie na shadcn (`:root`)

| shadcn | Wartość demo |
|--------|----------------|
| `--primary` | `--ca-lime` |
| `--primary-foreground` | `--ca-on-lime` |
| `--background` | `#F8FAFC` (app main) lub `--ca-shell` (auth page only) |
| `--foreground` | `--ca-text` |
| `--card` | `--ca-card` |
| `--muted` | `#F1F5F9` |
| `--muted-foreground` | `--ca-text-muted` |
| `--border` / `--input` | `--ca-border` |
| `--ring` | `--ca-border-focus` |
| `--destructive` | `--ca-danger` |
| `--sidebar` | `--ca-shell` |
| `--sidebar-foreground` | `--ca-foreground-on-shell` |
| `--sidebar-primary` | `--ca-lime` |
| `--sidebar-primary-foreground` | `--ca-on-lime` |
| `--chart-1` … `--chart-5` | Odcienie limonki + neutral grey (czytelne na białym tle) |

Dodaj w `globals.css` blok **`--ca-*`** i podmapuj `--primary` itd., żeby jedna zmiana aktualizowała całość.

---

## 3. Typografia

| Element | Styl |
|---------|------|
| Font | Sans-serif systemowy / Noto Sans (jak w projekcie) — bez ozdobników |
| H1 (hero) | Bold, ~32–40px, biały na shell (`auth`) |
| H1 (moduł) | Bold, ~24–28px, `--ca-text` |
| H2 / CardTitle | Semibold, ~18–20px |
| Body | Regular, 14–16px |
| Label / caption | 12–13px, `--ca-text-muted` |
| Identyfikator w input | Monospace lub tabular nums opcjonalnie (screen) |

Język: **polski**. Liczby: `pl-PL`.

---

## 4. Radius i cienie

| Element | Wartość |
|---------|---------|
| Karta logowania / Card | `rounded-2xl` (~16px) |
| Przycisk primary („Dalej”) | `rounded-full` (pill) w auth; w app `rounded-lg` lub pill dla głównego CTA |
| Input | `rounded-lg`, border 1px |
| Banery dolne | `rounded-t-2xl` (jak wysuwane paski) |
| Shadow karty | Subtelny: `shadow-lg` / `0 10px 40px rgb(0 0 0 / 0.12)` na białej karcie na shell |

`--radius` w shadcn: **0.625rem** (10px) domyślnie; karty auth mogą użyć `rounded-2xl` explicite w layoutcie.

---

## 5. Auth shell (login demo)

Odniesienie: **screen.png**.

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo CA białe]                    Nie masz konta? [link]   │  ← header na --ca-shell
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐     Hero: Zarządzaj. Rozwijaj.            │
│  │ Biała karta  │     Korzystaj. + opis                    │
│  │ (mock login) │     [opcjonalna grafika / placeholder]   │
│  └──────────────┘                                           │
├─────────────────────────────────────────────────────────────┤
│ [Alert ostrzegawczy biały]                                  │
│ [Pasek info --ca-shell-muted]                               │
└─────────────────────────────────────────────────────────────┘
```

### Mock login (odstępstwo od screenu)

Zamiast pola „Identyfikator”:

- Tytuł: **„Wybierz konto demo”** lub **„Zaloguj się”**
- Lista **4 użytkowników** (wiersz: avatar, imię, rola PL, zakres) — klik = wejście
- Opcjonalnie jeden przycisk pill **„Dalej”** / **„Zaloguj”** po wyborze
- Zakładki indywidualny/biznesowy: **nie wymagane** (demo tylko BK)

### Komponenty shadcn

| Element | Komponent |
|---------|-----------|
| Karta | `Card` + `rounded-2xl` + białe tło |
| Lista użytkowników | `Button variant="ghost"` w kolumnie lub `RadioGroup` |
| CTA | `Button` → `bg-primary` (limonka), `text-primary-foreground`, `rounded-full`, `size="lg"` |
| Link pomocy | `Button variant="link"` lub `<a className="text-[var(--ca-link)]">` |
| Banery | `Alert` — wariant destructive (czerwony akcent) + custom pasek na `--ca-shell-muted` |
| Logo | [`credit-agricole-logo-inline.svg`](./assets/credit-agricole-logo-inline.svg) — białe `fill-white` na shell |

### Klasy pomocnicze (propozycja)

- `CrmAuthShell` — `min-h-dvh bg-[var(--ca-shell)] text-[var(--ca-foreground-on-shell)]`
- `CrmAuthCard` — `bg-card text-card-foreground shadow-xl rounded-2xl`

---

## 6. App shell (po zalogowaniu)

| Obszar | Styl |
|--------|------|
| **Sidebar** | `bg-sidebar` (= shell), tekst jasny, aktywna pozycja: tło `--ca-lime` lub lewy border limonkowy + jaśniejszy tekst |
| **Header** | Biały lub bardzo jasny szary pasek, border-bottom |
| **Main** | `bg-background` (#F8FAFC), treść w `Card` |
| **Primary actions** | Limonkowy przycisk, ciemny tekst |
| **Tabele** | Białe tło, nagłówek `muted`, gęstość **comfortable** |

Logo w sidebar: wersja **biała** inline SVG, wys. ~28px.

---

## 7. Komponenty modułów CRM

### KPI (dashboard)

- `Card` z `CardHeader` / `CardTitle` / wartość duża bold
- Akcent procentu: `Badge variant="secondary"` lub primary — **nie** raw `text-green-600`
- Wykresy: paleta `--chart-1`…`5` (zielenie + szarości)

### Pipeline (kanban)

- Kolumny: pastelowe nagłówki per etap (`--pipeline-*` w `globals.css`), suma w pigułce, licznik w tytule
- Karty: białe tło, `border-l-4` w kolorze etapu, avatar opiekuna, pasmo prawdopodobieństwa (`Badge`)
- Obszar kanban: poziomy scroll w kontenerze; kolumny z własnym pionowym scrollem kart
- Drag overlay: `ring-2 ring-primary`

### Tabele (klienci, leady, zadania)

- shadcn `Table` w `Card`
- Toolbar: `Input` + `Button variant="outline"` filtry

### Formularze (spotkanie, zadanie)

- `FieldGroup` + `Field` + `FieldLabel`
- Focus: ring w kolorze `--ring` (limonka)

---

## 8. Stany i feedback

| Stan | Wzorzec |
|------|---------|
| Sukces zapisu | `toast` (sonner), krótki PL |
| Brak danych | `Empty` |
| Brak dostępu RBAC | `Alert` + komunikat „Brak dostępu” |
| Loading | `Skeleton` w kartach — tylko jeśli potrzebne na demo |

---

## 9. Czego unikać

- Gradienty neonowe, fioletowe akcenty „SaaS”
- `space-y-*` (użyj `flex flex-col gap-*`)
- Nadpisywanie kolorów Button `className="bg-green-500"`
- Dark mode jako domyślny w module CRM (auth może być zawsze na shell)
- Kopiowanie 1:1 zakładek retail/biznes z bankowości detalicznej w CRM korporacyjnym

---

## 10. Checklist implementacji (US-01 / US-04 / US-05)

- [ ] `--ca-*` + mapowanie `--primary` w `app/globals.css`
- [ ] `CrmAuthShell` + mock login zgodny z §5
- [x] `CrmAppShell` z ciemnym sidebar i jasnym main §6
- [ ] Logo z `.context/assets/`
- [ ] Wizualna zgodność z [screen.png](./assets/screen.png) na **loginie**

---

## Powiązane pliki

- [`ui-context.md`](./ui-context.md) — layout, nawigacja, role
- [`assets/README.md`](./assets/README.md) — logo i screen
- Task: [`T-01-02-ca-theme-globals.md`](./stories/US-01-project-bootstrap-and-theme/tasks/T-01-02-ca-theme-globals.md)
