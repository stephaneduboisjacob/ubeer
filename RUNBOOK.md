# Deployment runbook

This is a generic self-hosting outline. Replace example values with values for a domain and host you control. Deployment files in this repository are templates, not a record of a live host.

## Services

The API, PostgreSQL, Redis, static client, and optional local language model should run on private interfaces behind a TLS-terminating reverse proxy. Keep the language-model service and database off the public network.

## Deployment outline

1. Create a dedicated service account and install the checkout under a directory such as `/opt/ubeer`.
2. Store `DATABASE_URL`, fresh JWT and cookie secrets, public origin, and provider credentials in a protected environment file outside the repository.
3. Install dependencies from the lockfile, apply database migrations, and build the workspaces.
4. Configure PostgreSQL, Redis, BTCPay, mail, and optional Ollama endpoints for the target environment. Use payment-provider sandboxes during development.
5. Serve the web build through Nginx or another reverse proxy. Configure TLS, secure cookies, upload limits, and private storage for customer and driver documents.
6. Review delivery-area boundaries, age checks, consent flows, payment webhooks, backups, and incident procedures before accepting real orders.
7. Before an Android release, replace the example HTTPS host and allowed hosts in `apps/android/app/src/main/java/com/ubeer/app/MainActivity.java` with domains you control. Build with the Gradle wrapper and sign locally. Keep `signing.properties`, keystores, and release APKs outside Git.

Do not commit `.env`, local Android properties, signing material, uploads, identity documents, customer records, or production logs. Alcohol delivery is regulated; this software does not establish compliance for any jurisdiction.

## Contact

Stephane Jacob <jacobstephane@outlook.com>
