# T-52-03 — CompanyAiChatSheet — UI chatu

**Story:** [US-52](../story.md)  
**Status:** Done  
**Zależy od:** T-52-01, T-52-02

## Cel

Sheet z pełnym UI symulowanego asystenta firmy — składanie komponentów AI Elements + hook symulatora.

## Zakres

### `components/crm/company-ai-chat-sheet.tsx`

Props:

```ts
type CompanyAiChatSheetProps = {
  client: Client
  open: boolean
  onOpenChange: (open: boolean) => void
}
```

Layout (spec §2):

| Warstwa | Komponenty |
| --- | --- |
| Shell | `Sheet`, `SheetContent` (`side="right"`, `sm:max-w-lg` lub `xl`), `flex flex-col h-full` |
| Nagłówek | `SheetHeader` — tytuł **„Asystent firmy”**, podtytuł `client.name` |
| Konwersacja | `Conversation`, `ConversationContent`, `ConversationScrollButton` |
| Wiadomości | `Message`, `MessageContent`, `MessageResponse` (user / assistant) |
| Reasoning | `Reasoning`, `ReasoningTrigger`, `ReasoningContent` — `isStreaming` gdy faza `reasoning` |
| Sources | `Sources`, `SourcesTrigger`, `SourcesContent`, `Source` — pod zakończoną odpowiedzią assistant |
| Sugestie | `Suggestions`, `Suggestion` — widoczne gdy `phase` ∈ `{ idle, done }` i brak aktywnego streamu |
| Kolejka | `Queue`, `QueueSection`, `QueueSectionLabel`, `QueueList`, `QueueItem`, … — gdy `queue.length > 0` |
| Input | `PromptInput`, `PromptInputTextarea`, `PromptInputSubmit` |

Zachowanie:

- `useCompanyAiChatSimulator(client.id)` — kontekst z `useDemoData` + `useSession`.
- Submit sugestii / PromptInput → `submitPrompt`.
- `PromptInputSubmit` `status` z hooka; submit dozwolony w trakcie streamu (→ Queue).
- Historia **nie** resetuje się przy zamknięciu Sheet (state w komponencie lub rodzicu).
- Język UI: pl-PL.

Uproszczenia (spec §3):

- **Bez** model pickera, załączników, `Loader` (opcjonalnie).

Opcjonalnie P1: `dynamic(() => import(...), { ssr: false })` dla Sheet — mniejszy bundel initial.

## Done when

- [x] Sheet renderuje się z mockiem otwartym w Storybook/dev (lub ręczny test z T-52-04).
- [x] Pełny flow: sugestia → reasoning stream → answer stream → sources.
- [x] Queue widoczna po drugim submit w trakcie generowania; druga odpowiedź startuje automatycznie.
- [x] Scroll konwersacji działa (`ConversationScrollButton`).
- [x] Brak regresji typecheck / lint na nowych plikach.

## Poza zakresem

- Przycisk „Sprawdź firmę” w headerze (→ T-52-04).
- Aktualizacja `requirements.md` (→ T-52-04).
