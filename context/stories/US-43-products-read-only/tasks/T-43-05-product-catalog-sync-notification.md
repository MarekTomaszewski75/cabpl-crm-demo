# T-43-05 — Notyfikacja synchronizacji katalogu produktów

**Story:** [US-43](../story.md)  
**Status:** Done  
**Zależy od:** US-22 (system powiadomień)

## Cel

Symulować komunikat o aktualizacji katalogu z systemu bankowego.

## Zakres

- Przy wejściu na `/products`: losowo ~30% szans (raz na sesję — `sessionStorage` klucz np. `products-sync-notified`).
- Baner informacyjny (reuse US-23 — Dice UI `Banners`):
  - Tytuł: „Katalog produktów zaktualizowany”
  - Treść: „Pobrano zmiany z systemu produktowego banku.”
- Implementacja: `ProductsCatalogSyncBanner` na `/products` + reguły w `banner-rules.ts`.

## Done when

- [x] Notyfikacja pojawia się zgodnie z regułą demo (nie przy każdym wejściu).
- [x] Teksty po polsku.

## Poza zakresem

- Prawdziwy sync / polling.
