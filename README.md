# React Architecture Starter

Osnovni React + Vite starter sa feature-oriented strukturom.

## Pokretanje

```bash
npm install
npm run dev
```

## Struktura

```text
src/
  app/        # bootstrap, providers, layout i globalni stilovi
  pages/      # page-level komponente i composition
  features/   # business funkcionalnosti po domenima
  shared/     # reusable UI, utili, hookovi i asseti
```

## Pravila arhitekture

- `app` zna za sve ostale slojeve i sklapa aplikaciju.
- `pages` koriste `features` i `shared`, ali ne obrnuto.
- `features` sadrze izolovanu poslovnu logiku i UI po feature-u.
- `shared` ne sadrzi business pravila, samo genericke delove.

## Sledeci koraci

- dodaj router ako projekat ide na vise strana
- uvedi state manager samo kada lokalni state i propovi vise nisu dovoljni
- dodaj API sloj kroz `shared/api` ili kroz feature-specific servise
