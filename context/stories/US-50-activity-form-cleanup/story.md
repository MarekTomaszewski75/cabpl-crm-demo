# US-50 — Aktywność: bez E-mail i załączników

**Status:** Done  
**Priorytet:** P1  
**Zależy od:** US-33, US-34, US-35  
**Źródło:** [`contacts-and-documents-spec.md`](../../contacts-and-documents-spec.md) §5

## Jako

doradca korporacyjny (demo)

## Chcę

dodawać aktywności bez typu „E-mail” i bez załączników w formularzu

## Aby

formularz odzwierciedlał zakres Etapu 1 (kanały operacyjne bez symulacji poczty i uploadu w aktywności)

## Zakres

### W zakresie

- Wspólna lista opcji typów aktywności **bez** „E-mail” (formularz nowej aktywności).
- Usunięcie sekcji **Załączniki** (`CrmFileUploadPanel`) z formularzy aktywności: firma, lead, deal.
- Zachowanie typu `email` w `ChannelContactEventType` i wyświetlania historycznych wpisów w feedzie.

### Poza zakresem

- Usuwanie wpisów e-mail z timeline / seedu.
- Zmiana `CompanySource.email` i innych źródeł encji.

## Kryteria akceptacji (story)

- [x] W formularzu nowej aktywności (firma, lead, deal) brak przycisku „E-mail”.
- [x] W formularzu brak sekcji załączników.
- [x] Istniejące wpisy e-mail w feedzie nadal się wyświetlają.

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-50-01](./tasks/T-50-01-shared-activity-type-options.md) | Done | — |
| [T-50-02](./tasks/T-50-02-remove-activity-attachments-ui.md) | Done | T-50-01 |

## Kolejność implementacji (agent)

1. T-50-01 → T-50-02
