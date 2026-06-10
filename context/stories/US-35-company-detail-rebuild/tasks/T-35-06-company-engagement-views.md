# T-35-06 — Karta firmy: wskaźniki engagement + listy powiązań

**Story:** [US-35](../story.md)  
**Status:** Done  
**Zależy od:** [T-35-02](./T-35-02-client-documents-tab.md)

## Cel

Zastąpić stub **Powiązane jednostki** wskaźnikami i listami na karcie — parity z US-33 T-33-06, rozszerzone o deale, leady, kontakty.

## Zakres

### Wskaźniki — `company-engagement-indicators.tsx` (lub rozszerzenie wzorca z US-33)

Umiejscowienie: karta **O firmie** w `company-detail-sidebar.tsx`.

| Klucz | Źródło | Klik |
| --- | --- | --- |
| `tasks` | `tasks` · `clientId` | Lista zadań |
| `meetings` | `meetings` · `clientId` | Lista spotkań |
| `documents` | `clientDocuments` | Zakładka Dokumenty w composerze |
| `deals` | `deals` · `clientId` | Lista deali + link `/pipeline/[id]` |
| `leads` | `leads` · `clientId` | Lista leadów + link `/leads/[id]` |
| `contacts` | `contacts` z `client.contactIds` | Lista kontaktów |

- `getCompanyEngagementCounts(clientId, data)` w `lib/crm/`.
- Props callbacków: `onTasksClick`, `onMeetingsClick`, … — jak US-33.

### Komponenty list

- `company-tasks-list.tsx`, `company-meetings-list.tsx`, `company-deals-list.tsx`, `company-leads-list.tsx`, `company-contacts-list.tsx`.
- Integracja z `company-activity-panel` (controlled tab dla Dokumenty, sekcje list w prawej kolumnie lub scroll).

### Seed

- Uzupełnić `leads.json`: 2–3 leady z `clientId` (obecnie prawie wyłącznie `null`).

### RBAC

- `filterByScope` na dealach, leadach, zadaniach, spotkaniach w listach.

## Done when

- [ ] 6 wskaźników z licznikami w **O firmie**.
- [ ] Klik Dokumenty → zakładka Dokumenty.
- [ ] Klik Zadania/Spotkania/Deale/Leady/Kontakty → widoczna lista.
- [ ] `client-001` (lub inna firma demo): deale + kontakty widoczne.
- [ ] Liczniki = długość list w scope użytkownika.

## Poza zakresem

- CRUD encji powiązanych na karcie.
- Integracja spotkań z feedem Timeline.
