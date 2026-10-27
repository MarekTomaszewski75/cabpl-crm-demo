# US-56 — Dane i copy korporacyjne

**Status:** Done

## Jako

prezenter demo przed Bankiem (bankowość korporacyjna)

## Chcę

żeby słowniki, nazwy, kontakty i teksty wyglądały jak w CRM bankowości korporacyjnej, bez śladów detalu, Uspacy i reżyserii demo

## Aby

ocena z 23.10 („słowniki z detalu”, „szablonowe nazwy”, „kontakty o nazwiskach doradców”, „ślady przygotowania”, „błędy językowe”) nie powtórzyła się na pokazie

## Kryteria akceptacji

- [x] **Źródła** (lead, deal, firma), stara wartość → nowa:
  - `phone_call` → `rm_initiative`, „Inicjatywa opiekuna”,
  - `email` → `client_request`, „Zapytanie klienta”,
  - `recommendation` → `client_referral`, „Rekomendacja klienta”,
  - `advertising` → `ca_group`, „Grupa Crédit Agricole”,
  - `partner` → `partner`, „Partner / pośrednik”,
  - `link` → `industry_event`, „Wydarzenie branżowe”.
  - Seed i słownik `/sales-rules` są zmigrowane.
- [x] **Typy firm:** Aktywny klient / Prospekt / Były klient / Nieokreślony. Usunięto Partner, Wykonawca, Konkurent i Spam.
- [x] **Aktywność:** „Czat” → „Wideokonferencja” (`video_call`).
- [x] **Powody utraty** w języku korporacyjnym, np. „Warunki cenowe nieakceptowane”, „Wybór oferty innego banku”.
- [x] **UI bez pól detalicznych:** „Media społecznościowe” na karcie firmy i leada, „Towar/Usługa” w produktach. „Artykuł” → „Produkt”.
- [x] **Segmenty Banku:** Mid Corporate / Large Corporate / Instytucje finansowe.
  - Mazovia Leasing S.A. (dawniej DataCenter East), Vistula Towarzystwo Ubezpieczeń S.A. (dawniej SecureNet Cyber) i FinTech Solutions PL są w segmencie instytucji finansowych.
  - Plan segmentów w `kpi.json`.
- [x] **Nazwy deali:** 406 nazw w formacie „cel — klient”, 437 / 437 unikalnych. Deale, do których odwołują się powiadomienia, zadania, spotkania, leady lub dokumenty, zachowały nazwę. Kwoty otwartych deali są zróżnicowane, więc w Top 10 nie ma identycznych kwot.
- [x] **Kontakty:** zamiast Anny Kowalskiej i Piotra Nowaka (imiona doradców) w Polskiej Logistyce są Magdalena Szulc i Krzysztof Bielecki. Katarzyna Lewandowska → Joanna Pawlak.
- [x] **Leady:**
  - 52 leady innych firm odpięto od klienta, bo to prospekci,
  - 15 to cross-sell u klienta, z nazwą firmy klienta.
- [x] **Ślady demo:**
  - komentarz „Demo: …” w `opp-demo-gate` zastąpiony notatką opiekuna,
  - usunięto „(demo)” na Planie i realizacji oraz w roadmapie Compliance,
  - usunięto „Wkrótce” w lejku.
- [x] **Język:**
  - `pluralPl` w `lib/format/pl.ts` („Zaimportowano 2 prospekty”, „Wykorzystano 3 źródła”),
  - „Wszystkie regiony / segmenty”,
  - „prospekt” zamiast „prospect”,
  - szablony AI bez odmiany imion i branż: „sektora „…””, „opiekuna (Anna Kowalska)”, „rzeczownik: liczba”.

## Poza zakresem (przeniesione)

- Deale w EUR i przeliczanie walut → US-60 (QW-05: prawdopodobieństwo, waluta).
- Rotujący baner i „Reset demo” → US-58.
- Etykiety modeli AI („CA On-premise (demo)” → Azure OpenAI), AI bez proponowania produktów, które klient już ma → US-61.
- Nazwa „Deal” → „Szansa” (D4) → US-61.

## Weryfikacja

- `tsc --noEmit` przechodzi.
- Niezmienniki dat (US-54) i spójność KPI (US-55) bez zmian. Segmenty: realizacja 90–94% 27.10, 66–73% 18.12.
- Render 37 odpowiedzi AI dla 3 firm: 0 konstrukcji z odmianą imienia, branży lub liczebnika.
- `next dev` zwraca 200 dla `/login`, `/leads`, `/pipeline`, `/clients`, `/clients/client-001`, `/products`, `/dashboard` i `/sales-rules`.
