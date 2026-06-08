# CABPL CRM Demo

Lokalne demo CRM (Next.js + shadcn/ui) dla Credit Agricole Bank Polska.

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

Aplikacja: [http://localhost:3000/login](http://localhost:3000/login)

## Deploy na Vercel

**Opcja A — CLI (najszybciej, bez GitHuba)**

```bash
npm i -g vercel
vercel login
vercel          # pierwszy deploy (preview)
npm run deploy  # produkcyjny URL
```

**Opcja B — GitHub**

1. Wypchnij repo na GitHub.
2. [vercel.com/new](https://vercel.com/new) → Import projektu.
3. Vercel wykryje Next.js automatycznie — kliknij Deploy.

Po deployu wyślij użytkownikom link z `/login` (np. `https://twoj-projekt.vercel.app/login`).
