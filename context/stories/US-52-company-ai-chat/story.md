# US-52 — Asystent AI „Sprawdź firmę” (symulacja)

**Status:** Done  
**Priorytet:** P1  
**Zależy od:** US-35, US-45, US-49  
**Źródło:** [`company-ai-chat-spec.md`](../../company-ai-chat-spec.md)

## Jako

doradca korporacyjny (demo)

## Chcę

na karcie firmy uruchomić symulowany chat AI z kontekstem klienta bankowego

## Aby

na spotkaniu pokazać wizję asystenta wspierającego analizę firmy, rekomendacje produktów i źródeł danych — bez prawdziwego LLM

## Zakres

### W zakresie

- Przycisk **„Sprawdź firmę”** w nagłówku karty firmy (na lewo od menu ⋮).
- Sheet z chatem: `Conversation`, `Suggestion`, `PromptInput`, `Reasoning`, `Queue`, `Sources` z [AI Elements](https://elements.ai-sdk.dev/).
- Lokalny silnik symulacji: fake streaming reasoning + odpowiedzi, kolejka FIFO przy submit w trakcie generowania.
- Treści PL: bankowość, kondycja firmy, produkty CA — personalizacja z `Client` + powiązania z `DemoDataContext`.
- Symulowane źródła (CRM, pipeline, mock BIK/KRS).
- Historia rozmowy w sesji (state React; bez zapisu w Context/JSON).
- Wpis w [`reuse-and-conventions.md`](../../reuse-and-conventions.md); krok w [`requirements.md`](../../requirements.md) §6.

### Poza zakresem

- Pakiety `ai`, `@ai-sdk/react`, Route Handlers `/api/chat`, klucze API.
- Asystent na leadzie/dealu.
- Upload plików w `PromptInput`, model picker.
- Persystencja historii między odświeżeniami strony.

## Kryteria akceptacji (story)

- [x] Przycisk **„Sprawdź firmę”** otwiera Sheet z nazwą bieżącej firmy.
- [x] 5 sugestii, `PromptInput`, streamowany Reasoning, streamowana odpowiedź, Sources (2–4).
- [x] Drugi prompt w trakcie generowania trafia do Queue i jest przetwarzany po zakończeniu bieżącego.
- [x] Odpowiedzi kontekstowe (nazwa firmy, segment, deale) — bez wywołań sieciowych.
- [x] Zamknięcie i ponowne otwarcie Sheet zachowuje historię w tej samej sesji.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-52-01](./tasks/T-52-01-install-ai-elements.md) | Done | — |
| [T-52-02](./tasks/T-52-02-chat-simulator-templates.md) | Done | — |
| [T-52-03](./tasks/T-52-03-company-ai-chat-sheet.md) | Done | T-52-01, T-52-02 |
| [T-52-04](./tasks/T-52-04-header-button-and-docs.md) | Done | T-52-03 |

## Kolejność implementacji (agent)

1. T-52-01 i T-52-02 **równolegle** (niezależne)
2. T-52-03 → T-52-04
