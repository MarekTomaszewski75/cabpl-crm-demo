# T-04-03 — Protected dashboard layout guard

**Story:** [US-04](../story.md)  
**Status:** Done  
**Zależy od:** T-04-01

## Cel

`app/(dashboard)/layout.tsx` — jeśli `!user` → `redirect('/login')`.

## Zakres

- `SessionProvider` + `DemoDataProvider` w drzewie (kolejność: Session wewnątrz lub na zewnątrz — ustal i zapisz w reuse)
- Route group `(auth)` bez guarda

## Done when

- [x] Bez sesji wejście na `/pipeline` przekierowuje na login
