# T-42-04 — Podpięcie uploadu: firma, lead, deal

**Story:** [US-42](../story.md)  
**Status:** Done  
**Zależy od:** [T-42-03](./T-42-03-crm-file-upload-panel.md)

## Cel

Zastąpić stub uploadu działającą symulacją we wszystkich panelach aktywności.

## Zakres

| Plik | Zakładka |
| --- | --- |
| `company-activity-panel.tsx` | Pliki |
| `lead-activity-panel.tsx` | Pliki |
| `deal-activity-panel.tsx` | Pliki |

- Lista plików z Context pod strefą uploadu.
- Po uploadzie: aktualizacja liczników engagement (jeśli dotyczy).
- Usunąć toast „Etap 2” z legacy strefy.

## Done when

- [x] Upload w trzech kontekstach dodaje plik do listy widocznej w UI.
- [x] Zachowanie spójne między modułami.

## Poza zakresem

- Formularze aktywności z załącznikami (jeśli osobny flow).
