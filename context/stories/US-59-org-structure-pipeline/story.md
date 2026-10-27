# US-59 — Lejek wg struktury: Pion → Departament → Region → Zespół → RM (Appendix B #6)

**Status:** Done

## Jako

menedżer regionu / członek Zarządu

## Chcę

przejrzeć lejek zespołu z zejściem po strukturze, filtrem segmentu, produktu i etapu oraz porównać prognozę ważoną i nieważoną

## Aby

dowieźć obietnicę ze slajdu 101 oferty („Drill-down Pion → Departament → Region → Zespół → RM”) i scenariusz 6 („compare forecast views”, decyzja D3)

## Kryteria akceptacji

- [x] `data/sales-structure.json` (`SalesOrgUnit`):
  - Pion Bankowości Korporacyjnej,
  - 2 departamenty: Centrum (Mazowsze) i Regiony (Małopolska, Pomorze),
  - 3 regiony i 4 zespoły,
  - RM to doradcy z `teamId` w `users.json`.
- [x] Analityka → zakładka **Lejek wg struktury**: drzewo z rozwijanymi wierszami na 5 poziomach. Zarząd widzi cały pion, menedżer swój region.
- [x] Kolumny: otwarte szanse, lejek nominalny i ważony, wygrane, plan, realizacja, **prognoza ważona i nieważona**. Horyzont do wyboru: bieżący kwartał albo do końca roku.
- [x] Filtry segmentu, produktu (lejka) i etapu (lista etapów wybranego lejka).
- [x] Kafle: wygrane, prognoza ważona, prognoza nieważona, każda jako % planu. Badge **Etap 2** przy korektach kierownictwa i snapshotach (QW-08 poza QW).
- [x] Sumy na poziomie pionu i regionów są zgodne z KPI (US-55): wygrane 138 mln zł, plan roczny 200 mln zł, plan Q4 61 mln zł, realizacja regionów taka jak w Planie i celach.

## Zasady liczenia

- Plan RM = plan regionu podzielony po równo, tak samo jak w panelu menedżera (`getAdvisorWonAmountRows`). Wyższe poziomy sumują poziomy niższe.
- Filtr segmentu i produktu skaluje plan udziałem segmentu i kategorii w planie rocznym (to samo przybliżenie co `getFilterScale`). Przy obu filtrach naraz realizacja bywa zawyżona.
- Prognoza ważona = wygrane + Σ kwota × p szans z zamknięciem do końca horyzontu (także przeterminowanych). Prognoza nieważona = wygrane + Σ kwota tych samych szans.

## Weryfikacja

Skrypt dla 27.10:
- zarząd (rok): 69%, prognoza ważona 195,5 mln zł, nieważona 244,3 mln zł,
- zarząd (Q4): 19%, prognoza ważona 69,2 mln zł, nieważona 118,1 mln zł,
- menedżer widzi tylko Mazowsze (2 zespoły, 2 RM), a doradca żadnego węzła,
- kombinacja segmentu i produktu przeliczona.

`tsc --noEmit` przechodzi, `/dashboard` zwraca 200.

## Poza zakresem

Obszar sektorowy (4 poziomy), korekty prognozy i snapshoty (Etap 2), filtr struktury w Panelu głównym.
