# Specyfikacja — symulacja asystenta AI „Sprawdź firmę” na karcie firmy

**Status:** In story — [US-52](./stories/US-52-company-ai-chat/story.md)  
**Data:** 2026-06-16  
**Źródło:** Wymaganie prezentacyjne — demo asystenta AI w kontekście firmy klienta  
**Baseline:** US-01 … US-51 **Done** — patrz [`progress-tracker.md`](./progress-tracker.md)  
**Story:** [US-52](./stories/US-52-company-ai-chat/story.md) · taski T-52-01 … T-52-04  
**Referencje UI:** [AI Elements](https://elements.ai-sdk.dev/) — [chatbot](https://elements.ai-sdk.dev/examples/chatbot), [Suggestion](https://elements.ai-sdk.dev/components/suggestion), [Prompt Input](https://elements.ai-sdk.dev/components/prompt-input), [Reasoning](https://elements.ai-sdk.dev/components/reasoning), [Queue](https://elements.ai-sdk.dev/components/queue), [Sources](https://elements.ai-sdk.dev/components/sources)

---

## Podsumowanie

| # | Obszar | Priorytet | Krótki opis |
| --- | --- | --- | --- |
| [1](#1-punkt-wejścia--przycisk-sprawdź-firmę) | Nagłówek firmy | P0 | Przycisk **„Sprawdź firmę”** obok menu ⋮ → otwiera Sheet z chatem |
| [2](#2-shell--layout-chatu) | Sheet | P0 | Prawy panel (~480–560px), pełna wysokość viewportu, scroll konwersacji |
| [3](#3-komponenty-ai-elements-wizualne) | UI | P0 | Conversation, Message, Suggestion, PromptInput, Reasoning, Queue, Sources |
| [4](#4-silnik-symulacji-bez-ai-sdk) | Logika | P0 | Lokalny state machine + fake streaming — **bez** `ai`, `@ai-sdk/react`, `/api/chat` |
| [5](#5-treści-bankowe-i-personalizacja) | Demo content | P0 | Pytania/odpowiedzi o kondycję firmy, produkty CA, ryzyko, cross-sell |
| [6](#6-kolejka-przy-przerwaniu-reasoningu) | UX | P0 | Nowy prompt w trakcie „myślenia” trafia do **Queue**, przetwarzany FIFO |
| [7](#7-źródła-cytowań) | Sources | P1 | Symulowane źródła z CRM, produktów, „rejestrów zewnętrznych” |
| [8](#8-rbac-i-prezentacja) | Demo | P1 | Ten sam scope co karta firmy; scenariusz na spotkanie |

**Zasady nienaruszalne:**

- **Tylko symulacja** — zero kluczy API, zero Route Handlerów, zero `useChat`.
- Komponenty z [AI Elements](https://elements.ai-sdk.dev/) instalowane jako **shadcn registry** (`npx ai-elements@latest add …`) — używamy ich jako **warstwy wizualnej**.
- Dane kontekstowe: `Client` + powiązane encje z `DemoDataContext` (deale, leady, zadania, dokumenty, produkty).
- Design CA: [`design-guide.md`](./design-guide.md) — tokeny `primary`, `muted`, `card`.
- Język UI: **pl-PL**.

---

## Stan wyjściowy (baseline)

| Temat | Co jest dziś | Pliki / uwagi |
| --- | --- | --- |
| Nagłówek firmy | Przycisk ⋮ z akcją „Usuń” | [`company-detail-header.tsx`](../components/crm/company-detail-header.tsx) |
| Asystent AI | **Brak** | — |
| AI Elements | **Brak** w projekcie | [`package.json`](../package.json) — bez `ai`, `@ai-sdk/react` |
| Wzorzec Sheet | Formularze kontaktu, deala, leada | [`contact-form-dialog.tsx`](../components/crm/contact-form-dialog.tsx) |

---

## 1. Punkt wejścia — przycisk „Sprawdź firmę”

### Miejsce

[`components/crm/company-detail-header.tsx`](../components/crm/company-detail-header.tsx) — sekcja akcji po prawej (obecnie tylko menu ⋮).

### Zachowanie

```
[← Firmy]
[ikonka] Polska Logistyka S.A.          [ Sprawdź firmę ] [ ⋮ ]
         Opiekun: Anna Kowalska
```

| Element | Wymaganie |
| --- | --- |
| Przycisk | `variant="default"` (limonka CA), label **„Sprawdź firmę”**, opcjonalnie ikona `SparklesIcon` / `BotIcon` |
| Pozycja | **Na lewo** od przycisku ⋮ (`MoreHorizontalIcon`) |
| Klik | Otwiera `Sheet` (kontrolowany `open` state w headerze lub wydzielonym komponencie) |
| RBAC | Widoczny dla każdej roli, która widzi kartę firmy (bez dodatkowego guarda) |
| Ponowne otwarcie | Historia rozmowy **zachowana w sesji** (state React w komponencie Sheet); zamknięcie Sheet nie czyści historii |

### Niewchodzi w zakres

- Przycisk na leadzie/dealu (możliwe rozszerzenie P3).
- Persystencja historii między odświeżeniami strony.

---

## 2. Shell — layout chatu

### Kontener

Wzorzec jak [`contact-form-dialog.tsx`](../components/crm/contact-form-dialog.tsx) — `Sheet` + `SheetContent`, ale:

| Właściwość | Wartość |
| --- | --- |
| `side` | `right` |
| Szerokość | `sm:max-w-lg` lub `sm:max-w-xl` (~480–560px) |
| Wysokość | `h-full` / `flex flex-col` — input na dole, konwersacja `flex-1 overflow-hidden` |
| Nagłówek | `SheetHeader`: tytuł **„Asystent firmy”**, podtytuł: nazwa firmy (`client.name`) |
| Stopka | Brak osobnej stopki — `PromptInput` przyklejony do dołu panelu |

### Struktura pionowa (od góry)

1. **Nagłówek Sheet** — tytuł + nazwa firmy
2. **Obszar konwersacji** — `Conversation` / `ConversationContent` + `ConversationScrollButton`
3. **Sugestie** — `Suggestions` (tylko gdy brak wiadomości użytkownika **lub** po zakończeniu ostatniej odpowiedzi)
4. **Kolejka** — `Queue` (widoczna tylko gdy `pendingQueue.length > 0`)
5. **PromptInput** — zawsze na dole

---

## 3. Komponenty AI Elements (wizualne)

### Instalacja (implementacja)

```bash
npx ai-elements@latest add conversation message prompt-input suggestion reasoning queue sources
```

**Nie instalować:** pakietów `ai`, `@ai-sdk/react`, `@ai-sdk/*`, providerów modeli.

Ewentualne zależności wizualne komponentów (np. `streamdown` dla markdown w `MessageResponse` / `ReasoningContent`) — tylko jeśli wymagane przez registry; bez konfiguracji AI Gateway.

### Mapowanie komponentów

| Komponent AI Elements | Rola w demo | Integracja z symulacją |
| --- | --- | --- |
| `Conversation`, `ConversationContent`, `ConversationScrollButton` | Scrollowalna lista wiadomości | `messages.map(...)` z lokalnego state |
| `Message`, `MessageContent`, `MessageResponse` | Bańki user / assistant | `from={role}`; tekst odpowiedzi streamowany lokalnie |
| `Suggestions`, `Suggestion` | Predefiniowane pytania | `onClick` → `submitPrompt(text)` |
| `PromptInput`, `PromptInputTextarea`, `PromptInputSubmit` | Pole wpisywania | `onSubmit` → `submitPrompt`; `status` z symulatora (`ready` / `streaming` / `submitted`) |
| `Reasoning`, `ReasoningTrigger`, `ReasoningContent` | Blok „Myślę…” | `isStreaming={phase === 'reasoning'}`; treść z tablicy kroków reasoning |
| `Queue`, `QueueSection`, `QueueList`, `QueueItem`, … | Oczekujące prompty | Elementy `{ id, text, status: 'pending' \| 'processing' }` |
| `Sources`, `SourcesTrigger`, `SourcesContent`, `Source` | Cytowania pod odpowiedzią | `count` + lista URL/tytułów z szablonu odpowiedzi |

### Uproszczenia względem przykładu chatbot

| Element z przykładu | W demo |
| --- | --- |
| Model picker (`PromptInputSelect`) | **Pominięty** — jeden „wirtualny” model „Asystent CRM” |
| Załączniki plików | **Pominięte** (P2 opcjonalnie: załącznik „raport BIK.pdf” jako props wizualny) |
| `Loader` / `Spinner` przy `submitted` | Opcjonalnie — wystarczy Reasoning |
| Chain of Thought / Tool | **Poza zakresem** |

---

## 4. Silnik symulacji (bez AI SDK)

### Pliki docelowe

- `lib/crm/company-ai-chat-simulator.ts` — czysta logika (testowalna)
- `components/crm/company-ai-chat-sheet.tsx` — UI + hook `useCompanyAiChatSimulator`

### Model stanu

```ts
type ChatPhase = 'idle' | 'reasoning' | 'streaming_answer' | 'done'

type SimulatedMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string                    // pełny tekst (po zakończeniu streamu)
  displayedText?: string         // częściowy tekst podczas streamu
  reasoning?: string             // pełny reasoning (assistant only)
  displayedReasoning?: string
  sources?: SimulatedSource[]
  phase?: ChatPhase              // tylko ostatnia wiadomość assistant
}

type SimulatedSource = {
  title: string
  href: string                   // # lub mock URL
}

type QueueItem = {
  id: string
  text: string
  status: 'pending' | 'processing' | 'completed'
}
```

### Maszyna stanów — jeden prompt

```
submitPrompt(text)
  │
  ├─ phase === 'idle' | 'done'
  │     → dodaj wiadomość user
  │     → resolveResponseTemplate(text, companyContext)
  │     → phase = 'reasoning'
  │     → stream reasoning (znaki co ~20–40ms)
  │     → phase = 'streaming_answer'
  │     → stream answer
  │     → dołącz sources, phase = 'done'
  │
  └─ phase === 'reasoning' | 'streaming_answer'
        → dodaj text do pendingQueue (Queue UI)
        → NIE przerywaj bieżącego streamu
        → po phase = 'done' → dequeue FIFO → submitPrompt(next)
```

### Fake streaming

| Etap | Czas | Mechanizm |
| --- | --- | --- |
| Reasoning | 2,5–4,5 s | Stopniowe dokładanie znaków do `displayedReasoning`; `Reasoning` z `isStreaming={true}` auto-otwiera panel |
| Pauza | 200–400 ms | Opcjonalna — naturalny oddech przed odpowiedzią |
| Odpowiedź | 3–8 s (zależnie od długości) | Stopniowe dokładanie do `displayedText`; `MessageResponse` pokazuje partial |
| Cleanup | — | `displayedText` → `text`; `isStreaming={false}` na Reasoning |

Implementacja: `setInterval` / `requestAnimationFrame` + `useEffect` cleanup przy unmount.

### Mapowanie pytań → odpowiedzi

**Strategia:** keyword matching + fallback + personalizacja z `CompanyContext`.

```ts
type CompanyContext = {
  client: Client
  deals: Deal[]
  leads: Lead[]
  openTasks: Task[]
  products: Product[]        // produkty z aktywnych deali
  ownerName?: string
}
```

| Trigger (fragment pytania) | Intent | Odpowiedź zawiera |
| --- | --- | --- |
| `kondycj`, `ryzyko`, `płatnoś`, `zadłuż` | Ocena ryzyka | segment, typ klienta, liczba otwartych deali, symulowany scoring |
| `produkt`, `ofert`, `cross`, `sprzeda` | Rekomendacje | 2–3 produkty bankowe dopasowane do segmentu |
| `deal`, `pipeline`, `szans` | Pipeline | lista deali firmy ze statusami |
| `kontakt`, `relacj` | Relacje | kontakty + ostatnia aktywność |
| `zadani`, `spotkan` | Operacje | otwarte zadania, ostatnie spotkania |
| `konkurenc`, `benchmark` | Rynek | generyczna analiza sektora (symulowana) |
| *fallback* | Ogólne podsumowanie | 3–4 zdania o firmie z danych CRM |

Funkcja `resolveResponseTemplate(prompt, ctx)` zwraca:

```ts
{
  reasoning: string      // 3–6 zdań po polsku, styl „analizuję dane…”
  answer: string         // markdown: nagłówki, listy, **pogrubienia**
  sources: SimulatedSource[]
}
```

### Status `PromptInputSubmit`

| `ChatPhase` + kolejka | `status` prop |
| --- | --- |
| `idle` / `done`, brak aktywnego streamu | `ready` |
| `reasoning` lub `streaming_answer` | `streaming` (submit nadal **dozwolony** — trafia do Queue) |
| Tuż po kliknięciu, przed pierwszym tokenem | `submitted` (opcjonalnie, <300 ms) |

---

## 5. Treści bankowe i personalizacja

### Predefiniowane sugestie (`Suggestions`)

Stała tablica (5 sztuk), kontekstowa per `companyType` / `segment`:

**Dla każdej firmy (ogólne):**

1. „Jaka jest ogólna kondycja finansowa tej firmy?”
2. „Jakie produkty bankowe warto zaproponować?”
3. „Podsumuj aktywny pipeline sprzedażowy”
4. „Czy są sygnały ryzyka kredytowego?”
5. „Kiedy ostatnio kontaktowaliśmy klienta i co dalej?”

Sugestie **chowane** gdy `phase !== 'idle' && phase !== 'done'` (trwa generowanie).

### Przykładowy scenariusz (Polska Logistyka S.A., `client-001`)

**Pytanie:** „Jakie produkty bankowe warto zaproponować?”

**Reasoning (streamowany):**

> Sprawdzam profil firmy w CRM (segment: Średnie przedsiębiorstwo, typ: aktywny klient).  
> Analizuję historię dealów i produktów w pipeline.  
> Porównuję z profilem branżowym transportu i logistyki.  
> Dobieram rekomendacje cross-sell z katalogu produktów CA.

**Odpowiedź (streamowana):**

> Na podstawie profilu **Polska Logistyka S.A.** rekomenduję:
>
> - **Faktoring pełny** — usprawnienie płynności przy długich terminach płatności kontrahentów
> - **Kredyt obrotowy w rachunku** — elastyczne finansowanie sezonowych wahań
> - **Karta biznesowa flotowa** — koszty paliwa i opłaty drogowe
>
> Priorytet: faktoring — brak aktywnego produktu rozliczeniowego w bieżących dealach.

**Źródła:**

| Tytuł | href |
| --- | --- |
| Profil firmy — CRM | `#crm-client-client-001` |
| Deale powiązane | `#crm-deals-client-001` |
| Katalog produktów — Faktoring | `#products-faktoring` |
| BIK — symulacja scoringu (demo) | `#mock-bik` |

### Produkty bankowe w treściach (słownik demo)

Używać nazw spójnych z modułem Produkty w CRM:

- Kredyt obrotowy / inwestycyjny
- Faktoring pełny / odwrotny
- Leasing środków trwałych
- Rachunek firmowy Premium
- Gwarancje bankowe
- FX / zabezpieczenie kursu
- Karta biznesowa

---

## 6. Kolejka przy przerwaniu reasoning

### Kiedy pokazać `Queue`

Gdy użytkownik wyśle **drugi (lub kolejny) prompt**, podczas gdy `phase ∈ { reasoning, streaming_answer }`.

### Layout Queue (nad PromptInput)

```
┌─ Kolejka (2) ─────────────────────┐
│ ○ „A jak wygląda ryzyko branżowe?”  │
│ ○ „Porównaj z TechVentures”         │
└─────────────────────────────────────┘
```

Komponenty: `Queue` → `QueueSection` (`defaultOpen`) → `QueueSectionLabel` label=„Kolejka”, `count` → `QueueList` → `QueueItem` + `QueueItemIndicator` + `QueueItemContent`.

### Zachowanie

| Zdarzenie | Akcja |
| --- | --- |
| Submit w trakcie streamu | Nowy `QueueItem` ze `status: 'pending'`; input czyszczony; toast **nie** wymagany |
| Zakończenie bieżącej odpowiedzi | Pierwszy `pending` → `processing` → uruchom symulację → `completed` → usuń z listy / przekreśl |
| Zamknięcie Sheet | Kolejka **zachowana** w state (kontynuacja po reopen) |
| Pusta kolejka | Sekcja Queue **ukryta** |

---

## 7. Źródła (Sources)

### Renderowanie

Pod każdą **zakończoną** wiadomością `assistant` z niepustym `sources[]`:

```tsx
<Sources>
  <SourcesTrigger count={sources.length} />
  <SourcesContent>
    {sources.map(s => <Source key={s.href} href={s.href} title={s.title} />)}
  </SourcesContent>
</Sources>
```

### Zasady demo

- Linki **nie muszą** prowadzić do realnych stron — `href="#"` lub anchor w CRM (`/clients/[id]`, `/deals/[id]`).
- Klik w źródło CRM (np. deal): opcjonalnie `router.push` — **P2**; na P0 wystarczy `title` + wizualny link.
- Liczba źródeł: **2–4** na odpowiedź.

### Typowe źródła

| ID szablonu | Tytuł PL |
| --- | --- |
| `crm-profile` | Profil firmy — CRM |
| `crm-deals` | Pipeline dealów |
| `crm-activities` | Historia aktywności |
| `crm-products` | Katalog produktów bankowych |
| `mock-krs` | KRS — dane rejestrowe (symulacja) |
| `mock-bik` | BIK — scoring (symulacja) |
| `mock-sector` | Raport branżowy (symulacja) |

---

## 8. RBAC i prezentacja

### RBAC

- Brak nowej trasy — feature osadzony w `/clients/[id]`.
- Jeśli użytkownik nie ma dostępu do firmy (`canAccessEntity`), nie widzi karty — przycisk nie wymaga osobnej logiki.

### Scenariusz na spotkanie (~90 s)

1. Wejdź na **Polska Logistyka S.A.** jako doradca Anna.
2. Klik **„Sprawdź firmę”** — puste okno + 5 sugestii.
3. Klik sugestię **„Jakie produkty bankowe warto zaproponować?”** — reasoning się otwiera, potem streamuje odpowiedź ze źródłami.
4. **W trakcie reasoning** wpisz: „A jakie jest ryzyko branżowe?” → widać **Kolejkę (1)**.
5. Po zakończeniu pierwszej odpowiedzi — automatycznie startuje druga z kolejki.
6. Zamknij Sheet, otwórz ponownie — historia zachowana.

### Aktualizacja dokumentacji (po implementacji)

- [`requirements.md`](./requirements.md) §6 — krok w ścieżce prezentacji.
- [`reuse-and-conventions.md`](./reuse-and-conventions.md) — wpis: `company-ai-chat-sheet`, simulator.

---

## Pliki do utworzenia / zmiany

| Plik | Akcja |
| --- | --- |
| `components/crm/company-detail-header.tsx` | Przycisk + state `chatOpen` |
| `components/crm/company-ai-chat-sheet.tsx` | **Nowy** — cały UI chatu |
| `lib/crm/company-ai-chat-simulator.ts` | **Nowy** — templates, matching, timing |
| `lib/crm/company-ai-chat-templates.ts` | **Nowy** — treści PL, reasoning, sources |
| `components/ai-elements/*` | **Nowy** — z registry AI Elements |
| `context/stories/US-52-company-ai-chat/` | Story + taski — **utworzone** |

**Bez zmian:** `DemoDataContext`, seed JSON, route handlers, `.env`.

---

## Kryteria akceptacji

- [x] Przycisk **„Sprawdź firmę”** widoczny w nagłówku karty firmy, na lewo od ⋮.
- [x] Sheet otwiera chat z nazwą bieżącej firmy.
- [x] 5 klikalnych sugestii (AI Elements `Suggestion`).
- [x] `PromptInput` z działającym submitem (Enter / przycisk).
- [x] Po submit: widoczny **Reasoning** ze streamowanym tekstem, potem streamowana **odpowiedź**.
- [x] Pod odpowiedzią: **Sources** z 2–4 pozycjami.
- [x] Submit w trakcie reasoning/streaming → prompt w **Queue**, przetwarzany po zakończeniu bieżącego.
- [x] Treści po polsku, kontekst bankowy, personalizacja nazwy/segmentu firmy.
- [x] **Brak** integracji `useChat` / Route Handlers i **brak** wywołań sieciowych do modeli.
- [x] Zamknięcie i ponowne otwarcie Sheet zachowuje historię w tej samej sesji strony.

---

## Poza zakresem (Etap 1)

- Prawdziwy LLM / AI Gateway / Vercel AI SDK.
- Zapisywanie historii chatu w Context lub JSON.
- Asystent na leadzie/dealu.
- Upload dokumentów w PromptInput.
- Tool calls, plan, chain-of-thought (osobne komponenty).
- Executive dashboard z agregacją AI.

---

## Proponowany podział na taski (US-52)

| Task | Opis |
| --- | --- |
| T-52-01 | Instalacja komponentów AI Elements (bez AI SDK) |
| T-52-02 | Simulator + szablony treści PL |
| T-52-03 | `CompanyAiChatSheet` — UI + integracja komponentów |
| T-52-04 | Przycisk w headerze + scenariusz prezentacji w requirements |

---

## Ryzyka i decyzje

| Temat | Decyzja |
| --- | --- |
| Peer deps AI Elements (streamdown itd.) | Instalować tylko to, co wymusza registry; nie dodawać `ai` |
| Rozmiar bundla | Sheet lazy (`dynamic(..., { ssr: false })`) — opcjonalnie P1 |
| Spójność odpowiedzi | Szablony + interpolacja `{{companyName}}` — nie „prawdziwe” NLU |
| Linki Sources | Na demo wystarczą mocki; opcjonalne deep linki P2 |
