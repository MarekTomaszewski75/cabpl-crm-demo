# T-44-03 — Usunięcie menu „…” z kart widżetów

**Story:** [US-44](../story.md)  
**Status:** Done  
**Zależy od:** —

## Cel

Usunąć mylącą ikonę trzech kropek z nagłówka widżetu analityki.

## Zakres

### `analytics-widget.tsx`

- Usunąć `Button` z `MoreHorizontalIcon` i otaczający `Tooltip`.
- Zachować `GripVerticalIcon` (drag handle).

## Done when

- [x] Karty widżetów bez ikony „…”.
- [x] DnD widżetów nadal działa.

## Poza zakresem

- Menu kontekstowe widżetu (Etap 2).
