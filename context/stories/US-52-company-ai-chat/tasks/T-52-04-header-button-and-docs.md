# T-52-04 — Przycisk w headerze + dokumentacja prezentacji

**Story:** [US-52](../story.md)  
**Status:** Done  
**Zależy od:** T-52-03

## Cel

Podłączyć asystenta do karty firmy i zaktualizować dokumentację demo pod scenariusz prezentacji.

## Zakres

### `components/crm/company-detail-header.tsx`

- Przycisk **„Sprawdź firmę”** (`variant="default"`) **na lewo** od menu ⋮.
- Opcjonalna ikona: `SparklesIcon` lub `BotIcon` (lucide).
- State `chatOpen` + render `CompanyAiChatSheet` z `client`, `open`, `onOpenChange`.
- RBAC: bez dodatkowego guarda (ten sam widok co karta firmy).

### [`requirements.md`](../../../requirements.md) §6

Dodać krok scenariusza (~90 s), np. po wejściu na kartę klienta:

1. Klik **„Sprawdź firmę”** na **Polska Logistyka S.A.**
2. Sugestia o produktach → reasoning + odpowiedź ze źródłami
3. W trakcie reasoning — drugie pytanie → kolejka
4. Zamknięcie i ponowne otwarcie — historia zachowana

### [`reuse-and-conventions.md`](../../../reuse-and-conventions.md)

Uzupełnić (jeśli nie w T-52-01):

- `CompanyAiChatSheet` — Sheet asystenta na `/clients/[id]`
- `useCompanyAiChatSimulator` / `company-ai-chat-simulator.ts` — symulacja bez AI SDK
- `components/ai-elements/*` — registry wizualne, nie łączyć z `useChat`

### [`company-ai-chat-spec.md`](../../../company-ai-chat-spec.md)

- Status → **In story — US-52**
- Link do story w nagłówku

## Done when

- [x] Przycisk widoczny na `/clients/[id]` dla dowolnej firmy w scope.
- [x] Klik otwiera Sheet z poprawną nazwą firmy.
- [x] Scenariusz w `requirements.md` §6 zaktualizowany.
- [x] `reuse-and-conventions.md` ma wpisy asystenta.

## Poza zakresem

- Asystent na leadzie/dealu.
- Deep linki ze Sources do deali (P2).
