# DevTools Hub

Internal developer tools landing page. Links stored in MongoDB, served via NestJS with a Vue 3 frontend.

**Live API docs**: http://localhost:3000/api/docs (Swagger UI)  
**GraphQL playground**: http://localhost:3000/graphql

## Quick Start

```bash
cp .env.example .env
docker compose up
# Open http://localhost:3000
```

The default admin account is created automatically on first start via `mongo-init.js`.

## Admin Access

Click **Login** (top-right) and sign in with credentials from `.env` (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).  
Create, edit, and delete links from the Admin Panel.

Each link has: title, URL, description, category, sort order, active flag.

## Tech Stack

- **Backend**: NestJS 10 + TypeScript 5
- **Database**: MongoDB 7 + Mongoose
- **Auth**: JWT (access 15m, refresh 7d) + bcrypt
- **API Docs**: Swagger/OpenAPI at /api/docs
- **GraphQL**: Apollo Server at /graphql
- **Frontend**: Vue 3 + Vite + Pinia + Tailwind CSS v4
- **Container**: Docker multi-stage, non-root user

## Architecture

- `DatabaseModule`: Mongoose global connection
- `LinksModule`: LinksController (GET /api/links, public) + LinksService
- `AuthModule`: AuthController + JwtStrategy + bcrypt
- `AdminModule`: AdminLinksController, JWT-protected CRUD
- `HealthModule`: GET /health + MongoDB ping
- `GraphqlModule`: LinksResolver (links, link by ID)

## Development

```bash
# Start MongoDB + app with hot-reload
docker compose -f docker-compose.dev.yml up

# Or run separately:
docker compose -f docker-compose.dev.yml up mongodb

# Backend (hot-reload on :3000)
npm install
npm run start:dev

# Frontend (Vite dev server on :5173, proxies /api to :3000)
cd frontend && npm install && npm run dev

# Seed admin account
npm run seed
```

## Production Deployment

```bash
docker compose up --build -d
docker compose logs -f app
docker compose down
```

## Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| MONGO_URI | Yes | - | MongoDB connection string |
| JWT_SECRET | Yes | - | Min 32 chars |
| PORT | No | 3000 | HTTP port |
| JWT_ACCESS_EXPIRES_IN | No | 15m | Access token lifetime |
| JWT_REFRESH_EXPIRES_IN | No | 7d | Refresh token lifetime |
| BCRYPT_ROUNDS | No | 12 | Password hashing rounds |
| SEED_ADMIN_EMAIL | Seed only | - | First admin email |
| SEED_ADMIN_PASSWORD | Seed only | - | First admin password |

## Testing

```bash
npm test          # Unit tests (mocked Mongoose models)
npm run test:e2e  # E2E tests (requires running MongoDB)
```

## Docker Images

Images are built and pushed to GHCR on every push to `main`:

```
ghcr.io/abdurrahmanibesart-hue/devtools-hub:latest
```

## API Reference

Full interactive docs at `http://localhost:3000/api/docs`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health | None | Health + MongoDB status |
| GET | /api/links | None | All active links |
| POST | /api/auth/login | None | Admin login, returns tokens |
| POST | /api/auth/refresh | None | Refresh access token |
| POST | /api/auth/setup | None | Create first admin |
| GET | /api/admin/links | Bearer | All links (incl. inactive) |
| POST | /api/admin/links | Bearer | Create link |
| PUT | /api/admin/links/:id | Bearer | Update link |
| DELETE | /api/admin/links/:id | Bearer | Delete link |

GraphQL (playground at /graphql):
```graphql
query { links { id title url category } }
query { link(id: "abc") { title url } }
```
