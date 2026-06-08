# T-16-07 — Po utworzeniu: redirect + zdarzenie „Utworzono firmę”

**Story:** [US-16](../story.md)  
**Status:** Done  
**Zależy od:** [T-16-03](./T-16-03-demo-data-company-crud.md), [T-16-06](./T-16-06-company-create-sheet-form.md)

## Cel

Po zapisie nowej firmy — **od razu** otworzyć kartę rekordu i pokazać wpis na osi czasu jak na screenie Uspacy.

## Zachowanie

1. `CompanyFormDialog` / `company-form`: w `onSuccess` → `router.push(\`/clients/${id}\`)` + zamknięcie Sheet.
2. Przy `addClient` (lub tuż po) dodać wpis aktywności widoczny w feedzie prawej kolumny.

## Model zdarzenia (propozycja)

**Opcja A (preferowana):** rozszerzyć `ContactEvent` o opcjonalny `kind: "channel" | "system"` i dla systemu `type: "company_created"` + `titlePl: "Utworzono firmę"`.

**Opcja B:** osobna tablica `companyActivities` w Context — tylko jeśli A psuje semantykę US-08.

Wybór w implementacji — w Done when wystarczy jeden spójny feed.

## Wpis na timeline

- Treść: nazwa firmy (np. „E Corp”).
- Autor: avatar / inicjały zalogowanego użytkownika (`users` / session).
- Timestamp: czas utworzenia (`occurredAt`).

## Done when

- [ ] Utworzenie firmy z listy kończy się na `/clients/[id]` bez ręcznego kliku w tabelę.
- [ ] Na karcie nowej firmy feed pokazuje co najmniej jeden wpis „Utworzono firmę”.
- [ ] `ownerId` na wpisie / firmie = użytkownik, który utworzył rekord.

## Poza zakresem

- Pełny composer notatek (→ T-16-10).
