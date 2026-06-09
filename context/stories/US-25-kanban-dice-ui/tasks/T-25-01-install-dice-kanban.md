# T-25-01 — Instalacja Kanban (Dice UI)

**Story:** [US-25](../story.md)  
**Status:** Done

## Cel

Dodać komponent Kanban z rejestru Dice UI do projektu.

## Zakres techniczny

### Instalacja

```bash
npx shadcn@latest add @diceui/kanban
```

- Skill **shadcn** przed instalacją.
- Wynik: `components/ui/kanban.tsx` z eksportami: `Kanban`, `KanbanBoard`, `KanbanColumn`, `KanbanColumnHandle`, `KanbanItem`, `KanbanItemHandle`, `KanbanOverlay`.

### Smoke

- Minimalny przykład w Storybook nie jest wymagany — wystarczy że import z `@/components/ui/kanban` kompiluje się.

## Done when

- [x] Plik kanban w `components/ui/`.
- [x] `npm run dev` / build bez błędów importu.
- [x] Zależności DnD z pakietu Dice UI zainstalowane w `package.json`.

## Poza zakresem

- Migracja leadów/deali (→ T-25-02, T-25-03).
