# uBeer

uBeer is a region-gated alcohol delivery marketplace. Customers check a delivery area, browse the local catalog and pay through BTCPay. Drivers apply for approval and manage assigned deliveries. Administrators manage coverage, products, drivers, orders and payouts.

## Architecture

```text
Customer / Driver / Admin PWA (React 19, Vite)
                     │ HTTPS
                     ▼
           Nginx (TLS + static files)
              │ /api proxy
              ▼
        Fastify API (Node 24)
          ├── PostgreSQL 18 (Prisma)
          ├── Redis 7 (rate limits + BullMQ reconciliation)
          └── BTCPay Greenfield API + signed webhooks
```

The customer, driver and admin views are one React app, with separate routes and layouts. The API is Fastify; its plugin system keeps request parsing, security headers, cookies, CORS and rate limits explicit. PostgreSQL is the source of truth for orders, refresh tokens and audit history. Redis stores distributed rate-limit state and schedules invoice reconciliation. Email uses a pluggable transport with a structured console transport by default.

## Mobile app

The customer, driver and admin workflows are delivered in one installable, mobile-first PWA, so users can install uBeer from their phone browser without a native build. On iPhone or iPad, open uBeer in Safari and choose **Share → Add to Home Screen**. On Android, open it in Chrome and choose **Install app** (or **Add to Home screen**). The app menu links to customer orders, the driver console and admin; the home-screen shortcuts open customer orders and the driver app directly.

Region geometry is stored as GeoJSON JSONB. The API performs authoritative polygon, multipolygon and circle checks for customer lookups, checkout and driver assignment. Leaflet and OpenStreetMap render the admin region map; Leaflet Draw creates polygon boundaries.

Customer address lookup posts the typed query to Nominatim without putting the address in a URL or access log. The API returns only verified street-address or full Canadian postal-code matches; ambiguous matches are shown for the customer to select. The selected point is checked against active delivery polygons on the server. Postal-code checks are marked approximate and cannot be checked out until an exact street address is selected. Cart and checkout requests repeat the server-side boundary check, and checkout saves the delivery address and coordinates for customer tracking and driver navigation.

## Requirements

- Node.js 24 and npm 11
- PostgreSQL 18
- Docker Engine and Docker Compose (Redis 7)

PostgreSQL is expected to run on the host. Redis is the only container in the compose file.

## Local setup

1. Create the ignored environment file and fill in application secrets:

   ```sh
   cp .env.example .env
   ```

   Set a PostgreSQL URL for a dedicated `ubeer` role and database, plus random values for `JWT_SECRET` and `COOKIE_SECRET`. Keep `.env` private. The BTCPay credentials may remain empty while developing other features; checkout and webhook handling return a clear configuration error until they are set.

2. Install dependencies, start Redis, apply the schema and seed data:

   ```sh
   npm ci
   docker compose up -d redis
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

   Seeding creates `admin@ubeer.local` with a random password and TOTP secret, a clearly marked test region following the Island of Montréal shoreline, the `$30.00` test Heineken six-pack, and one pending driver application. The checked-in boundary is a simplified OpenStreetMap polygon; generated art and client-side maps are never used for delivery eligibility. The seed prints the initial admin credentials once and writes them to `/root/ubeer-admin-credentials.txt` with mode `0600`. Run the seed as root when that exact credentials file is required; the seed is idempotent and does not recreate credentials for an existing admin.

3. Run the API and web app in separate terminals:

   ```sh
   npm run dev:api
   npm run dev:web
   ```

   The web app is at `http://127.0.0.1:5173`; Vite proxies `/api` to `127.0.0.1:4000`. The API binds to loopback by default.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | Runtime mode; production enables `Secure` cookies. |
| `PORT`, `HOST` | API bind address; default is `127.0.0.1:4000`. |
| `PUBLIC_BASE_URL`, `BTCPAY_BASE_URL` | Public app URL used for invoice return links. |
| `WEB_ORIGIN` | Exact browser origin allowed by CORS. |
| `DATABASE_URL` | PostgreSQL connection for the dedicated `ubeer` role. |
| `REDIS_URL` | Redis connection for rate limits and BullMQ. |
| `JWT_SECRET` | HMAC signing secret, minimum 32 bytes. |
| `COOKIE_SECRET` | Reserved cookie secret for future signed-cookie use. |
| `UPLOAD_DIR` | Private driver ID storage; default `/var/lib/ubeer/uploads`. |
| `PLATFORM_FEE_PERCENT` | Default driver platform fee; admin can update it. |
| `BTCPAY_HOST` | BTCPay server URL. |
| `BTCPAY_STORE_ID` | BTCPay store identifier. |
| `BTCPAY_API_KEY` | Greenfield API key with invoice read/create access. |
| `BTCPAY_WEBHOOK_SECRET` | Secret used to verify webhook HMAC signatures. |
| `SMTP_URL` | Reserved for the SMTP mail transport adapter. |

## BTCPay Setup

Configure a webhook in BTCPay after the public endpoint is deployed:

- **Webhook URL:** `https://ubeer.btcpay.exchange/api/webhooks/btcpay`
- **Events:** `InvoiceCreated`, `InvoiceReceivedPayment`, `InvoiceProcessing`, `InvoiceSettled`, `InvoiceExpired`, `InvoiceInvalid`
- Put the values in the ignored project `.env` file on the server: `BTCPAY_STORE_ID`, `BTCPAY_API_KEY`, and `BTCPAY_WEBHOOK_SECRET`.

The API creates invoices in USD and records the invoice ID and hosted checkout link on the order. It redirects back to the order status view after payment. Webhooks require a valid HMAC-SHA256 signature from `BTCPay-Sig` (BTCPay's documented header) or `BTCPAY-WEBHOOK-SIG`; delivery IDs are unique in the database, so retries are idempotent. A BullMQ scheduler checks pending invoices older than ten minutes every five minutes. Credential values are supplied only through the server environment.

## Build and verification

```sh
npm ci
npm run build
npm run typecheck
npm test
npx playwright install chromium   # once, for the browser smoke test
npm run test:e2e
```

The Vitest suite covers polygon/circle geofencing and BTCPay HMAC checks. The Playwright smoke test stubs the API and confirms the customer path reaches a BTCPay checkout URL without making a real invoice or payment.

## Deployment

Deployment templates are in `deploy/`. The intended installation is `/opt/ubeer`, with the static build copied to `/var/www/ubeer/web` and private uploads under `/var/lib/ubeer/uploads`. The API systemd service runs as the dedicated `ubeer` user, while Nginx terminates TLS and proxies `/api/` to loopback port 4000. PostgreSQL and Redis remain bound to localhost.

For TLS issuance, Certbot needs a contact email; enter the operator’s real address when prompted before requesting the production certificate. Do not install the HTTPS vhost until the certificate exists, or use the included HTTP challenge vhost first. See [RUNBOOK.md](RUNBOOK.md) for service, key rotation and backup commands.

## Current product notes

- The seeded listing and polygon are test data. The catalog marks the beer as a test listing in both the UI and database.
- The ID check at handoff uses a six-digit customer code; the driver enters it to complete delivery.
- BTCPay refunds are out of scope for the MVP. Admins can record a manual refund note and status.
- SMTP is not configured by default. Replace the console `MailTransport` in `apps/api/src/email.ts` with an SMTP adapter when credentials are available.
