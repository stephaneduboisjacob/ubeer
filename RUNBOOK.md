# uBeer Runbook

## Services

The production API unit is `ubeer-api.service`; Nginx serves the PWA and proxies `/api/`. Redis runs from the repository compose file and PostgreSQL is host-native.

```sh
sudo systemctl restart ubeer-api
sudo systemctl status ubeer-api
sudo journalctl -u ubeer-api -f
sudo systemctl status ollama
ollama list
sudo journalctl -u ollama -f
cd /opt/ubeer && sudo docker compose ps
sudo nginx -t
sudo systemctl reload nginx
```

Ollama must remain bound to loopback port `11434`; do not expose it publicly. The support API defaults to `ghunghab/qwen2.5-1.5b:q4km`. If the support widget reports that the assistant is unavailable, confirm Ollama and the model are present and running, then inspect the API and Ollama journals above.

For a code update, install from the committed lockfile, build both workspaces, apply migrations, publish the new static bundle and restart the API:

```sh
cd /opt/ubeer
sudo npm ci
sudo npm run build
sudo npm run db:migrate
sudo rsync -a --delete apps/web/dist/ /var/www/ubeer/web/
sudo systemctl restart ubeer-api
```

## BTCPay key rotation

1. Create a replacement Greenfield API key and webhook secret in BTCPay.
2. Update `BTCPAY_API_KEY` and `BTCPAY_WEBHOOK_SECRET` in `/opt/ubeer/.env`; keep the file owned by `root:ubeer` and mode `0640` so only root and the API service group can read it.
3. Update the BTCPay webhook registration to use the new secret, then restart `ubeer-api`.
4. Send a BTCPay test webhook and confirm the API returns success. Check `journalctl -u ubeer-api` for signature errors or duplicate deliveries.
5. Revoke the old API key and secret after the new integration is confirmed.

Never paste secret values into tickets, source files, shell history or logs. The admin settings screen only shows whether credentials exist and a masked store ID.

## PostgreSQL backup and restore

Create a compressed logical backup as the application database role:

```sh
sudo -u postgres pg_dump --format=custom --no-owner --dbname=ubeer \
  --file=/var/backups/ubeer-$(date -u +%Y%m%dT%H%M%SZ).dump
```

Restrict backup access and copy backups off-host. To restore into a prepared database:

```sh
sudo -u postgres pg_restore --clean --if-exists --no-owner \
  --dbname=ubeer /var/backups/ubeer-backup.dump
```

Include `/var/lib/ubeer/uploads` in the backup plan; it contains private driver application documents. Keep the database and uploads backup schedules aligned.

## BTCPay reconciliation

The API schedules reconciliation every five minutes when Redis is available. It checks pending orders older than ten minutes. Inspect recent webhook rows and orders with Prisma Studio only from a trusted local session; never expose it publicly. If Redis was unavailable at API startup, restore Redis and restart the API to register the repeatable job.

## Driver uploads

Documents are limited to 5 MiB and accepted only when their contents match JPEG, PNG or PDF signatures. Files are stored outside the web root with restrictive permissions and downloaded only through the admin-authenticated document route. Confirm `/var/lib/ubeer/uploads` is owned by `ubeer` and mode `0700`.
