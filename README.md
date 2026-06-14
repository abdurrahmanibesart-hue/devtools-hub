# DevTools Hub

Internal links page. Got tired of the bookmarks doc nobody updates, so this is the replacement.

NestJS + Mongo + Vue 3.

## Quick start

```bash
cp .env.example .env
docker compose up
# open http://localhost:3000
```

First admin is seeded by `mongo-init.js` — creds are in `.env.example`. **Change `JWT_SECRET` before you put this anywhere shared.**

Log in (top-right), CRUD links from the admin panel.

## Dev

```bash
docker compose -f docker-compose.dev.yml up mongodb
npm install && npm run start:dev          # backend :3000
cd frontend && npm install && npm run dev # frontend :5173
```

Swagger at `/api/docs`.

## Tests

Requires `npm install` and MongoDB running (start it via dev compose above).

```bash
npm test           # unit
npm run test:e2e
```

## TODO

- proper role model if more than one admin ever logs in
- favicon
