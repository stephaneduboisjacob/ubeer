# uBeer

A region-aware alcohol ordering and delivery marketplace prototype with customer, driver, and admin experiences in a web app and Android shell.

## What is included

- Delivery-area checks backed by server-side geographic boundaries.
- Catalog, cart, checkout, order tracking, and driver workflows.
- Admin tools for delivery regions, products, drivers, orders, and payouts.
- BTCPay payment integration, signed webhook handling, and local AI support-chat integration.
- English, French, Italian, Spanish, Simplified Chinese, and Russian interface text.

External services need operator-owned credentials. The repository includes fictional development data and no production credentials.

## Run locally

Requirements: Node.js 24, npm 11, PostgreSQL, and Docker Compose. PostgreSQL is configured through `.env`; the Compose file provides Redis.

```sh
cp .env.example .env
npm ci
docker compose up -d redis
npm run db:generate
npm run db:migrate
npm run db:seed
```

Run the API and web app in separate terminals:

```sh
npm run dev:api
npm run dev:web
```

The API and Vite development server use local addresses by default. Configure provider credentials only when you need to test the related integration. Never commit `.env`, Android signing material, uploads, or production customer data.

Before an Android release, configure the example HTTPS URL and allowed hosts in `apps/android/app/src/main/java/com/ubeer/app/MainActivity.java`. See [RUNBOOK.md](RUNBOOK.md).

Build a development Android package from the project root with:

```sh
cd apps/android && ./gradlew assembleDebug
```

## Important deployment note

Alcohol delivery is regulated. This prototype does not establish licensing, age verification, tax, privacy, or delivery compliance for any jurisdiction. Do not use it to accept real orders without the required legal and operational controls.

See [RUNBOOK.md](RUNBOOK.md) and the [multilingual operator manuals](docs/ubeer-manual/README.md) for more detail.

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidance and [SECURITY.md](SECURITY.md) for vulnerability reporting.

## License

No license has been selected yet. Public visibility does not grant permission to reuse the code.

## Contact

Stephane Jacob <jacobstephane@outlook.com>
