# T-33-06 — Karta leada: klikalne wskaźniki zadań / spotkań / dokumentów

**Story:** [US-33](../story.md)  
**Status:** Done  
**Zależy od:** [T-33-05](./T-33-05-lead-documents-tab.md)

## Cel

Ikony engagement w lewej kolumnie prowadzą do realnej treści na karcie leada.

## Zakres

### `LeadEngagementIndicators`

- Props: `onTasksClick`, `onMeetingsClick`, `onDocumentsClick`.
- Kursor / `button` semantics dla klikalnych ikon.

### Integracja

- **Dokumenty** — klik przełącza composer na zakładkę Dokumenty (`lead-activity-panel` — controlled tab lub callback z sidebara).
- **Zadania** — lista `tasks.filter(t => t.leadId === lead.id)` + `filterByScope`; komponent `lead-tasks-list.tsx` (tytuł, termin, status).
- **Spotkania** — lista `meetings` z `leadId`; `lead-meetings-list.tsx`.

### Umiejscowienie list

- Sekcje pod composerem w prawej kolumnie lub scroll do sekcji po kliku ikony.
- Klik ikony → pokaż odpowiednią sekcję / przewiń.

### Liczniki

- Zgodność z długością list po RBAC.

## Done when

- [ ] Klik **Dokumenty** → zakładka Dokumenty w composerze.
- [ ] Klik **Zadania** → widoczna lista zadań leada (seed: np. `lead-001`).
- [ ] Klik **Spotkania** → widoczna lista spotkań leada.
- [ ] Liczniki = długość list w scope użytkownika.

## Poza zakresem

- CRUD zadań/spotkań na karcie.
- Integracja zadań z feedem Timeline.
