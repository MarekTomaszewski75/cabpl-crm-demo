# T-52-02 — Simulator chatu + szablony treści PL

**Story:** [US-52](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Czysta logika symulacji odpowiedzi asystenta firmy: matching intencji, szablony bankowe, fake streaming — bez React i bez sieci.

## Zakres

### `lib/crm/company-ai-chat-templates.ts`

- Stałe **5 sugestii** (tablica stringów PL) — patrz spec §5.
- Słownik produktów bankowych (nazwy spójne z modułem Produkty).
- Szablony `reasoning`, `answer`, `sources` per intent:
  - `risk` — kondycja, ryzyko, płatności
  - `products` — rekomendacje cross-sell
  - `pipeline` — deale, szanse
  - `contacts` — relacje, kontakty
  - `operations` — zadania, spotkania
  - `sector` — benchmark branżowy (symulowany)
  - `fallback` — ogólne podsumowanie firmy
- Interpolacja: `{{companyName}}`, `{{segment}}`, `{{companyTypeLabel}}`, `{{dealCount}}`, `{{ownerName}}` itd.

### `lib/crm/company-ai-chat-simulator.ts`

Typy (eksportowane):

```ts
type ChatPhase = 'idle' | 'reasoning' | 'streaming_answer' | 'done'

type SimulatedSource = { title: string; href: string }

type CompanyChatContext = {
  client: Client
  deals: Deal[]
  leads: Lead[]
  openTasks: Task[]
  products: Product[]
  ownerName?: string
}

type ResolvedResponse = {
  reasoning: string
  answer: string
  sources: SimulatedSource[]
}
```

Funkcje:

- `buildCompanyChatContext(clientId, demoData, user)` — agregat z RBAC (`filterByScope` / `getCompanyDeals` itd.).
- `matchChatIntent(prompt: string): ChatIntent` — keyword matching (spec §4).
- `resolveResponseTemplate(prompt, ctx): ResolvedResponse`.
- `getChatSuggestions(): string[]`.

### Hook `useCompanyAiChatSimulator` (może być w tym pliku lub `lib/crm/use-company-ai-chat-simulator.ts`)

State machine:

- `messages`, `phase`, `queue`, `inputStatus` (`ready` | `streaming` | `submitted`).
- `submitPrompt(text)` — jeśli `idle`/`done` → start; jeśli `reasoning`/`streaming_answer` → enqueue.
- Fake streaming: reasoning ~2,5–4,5 s, odpowiedź ~3–8 s (znaki co ~20–40 ms).
- Po `done` → dequeue FIFO i uruchom następny prompt.
- Cleanup timerów przy unmount.

**Bez** `useChat`, `fetch`, Route Handlers.

## Done when

- [x] Dla `client-001` i pytania o produkty zwracana spersonalizowana odpowiedź z ≥2 źródłami.
- [x] Keyword matching pokrywa 6 intencji + fallback.
- [x] Hook obsługuje kolejkę: drugi submit w trakcie reasoning nie przerywa pierwszego.
- [x] Eksport typów i funkcji bez błędów typecheck.

## Poza zakresem

- UI komponentów AI Elements (→ T-52-03).
- Przycisk w headerze (→ T-52-04).
