# US-42 — Upload plików (Dice UI File Upload)

**Status:** Done  
**Priorytet:** P0  
**Zależy od:** US-33, US-34, US-35, US-25 (rejestr Dice UI)  
**Źródło:** [`demo-feedback-iteration-2-spec.md`](../../demo-feedback-iteration-2-spec.md) §5, §6, §8

## Jako

doradca korporacyjny (demo)

## Chcę

dodawać pliki na karcie firmy, leada i deala z symulowanym przesyłaniem i listą już dodanych plików

## Aby

prezentacja pokazywała realistyczny flow dokumentacji bez prawdziwego storage — oraz naprawić niedziałające uploady i dokumenty

## Zakres

### W zakresie

- Instalacja `@diceui/file-upload` → `components/ui/file-upload.tsx`.
- Wspólny wrapper `CrmFileUploadPanel` w `components/crm/`.
- Typy plików demo + metody Context (`addClientFile` / `addLeadFile` / `addDealFile` lub równoważne).
- Podpięcie w panelach aktywności: firma, lead, deal (zakładka **Pliki**).
- Symulacja progress (`onUpload` + opóźnienie demo).
- Naprawa `addClientDocument` / `addDealDocument` / `addLeadDocument` (`regionId` z encji gdy `user.regionId` null).
- `toast.error` przy nieudanym zapisie dokumentu.

### Poza zakresem

- Prawdziwy storage / base64 / localStorage binarny.
- Podgląd PDF w modalu.

## Kryteria akceptacji (story)

- [x] Upload pliku we wszystkich trzech kontekstach dodaje wpis do listy w UI.
- [x] Progress przesyłania widoczny podczas symulacji.
- [x] Dodawanie nazwanego dokumentu działa dla wszystkich ról demo (w tym executive).
- [x] Wpis w [`reuse-and-conventions.md`](../../reuse-and-conventions.md).

## Taski

| Task | Status | Zależy od |
|------|--------|-----------|
| [T-42-01](./tasks/T-42-01-install-file-upload-dice-ui.md) | Done | — |
| [T-42-02](./tasks/T-42-02-file-types-and-context.md) | Done | T-42-01 |
| [T-42-03](./tasks/T-42-03-crm-file-upload-panel.md) | Done | T-42-02 |
| [T-42-04](./tasks/T-42-04-wire-activity-panels.md) | Done | T-42-03 |
| [T-42-05](./tasks/T-42-05-fix-named-documents-region.md) | Done | — |

## Kolejność implementacji (agent)

1. T-42-01, T-42-05 (równolegle — niezależne)  
2. T-42-02 → T-42-03 → T-42-04
