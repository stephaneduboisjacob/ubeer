# Launch and Operations Guide

## Overseas launch gate

The current production environment is a Montréal prototype, not an overseas-ready marketplace. Its active region is Montréal Island; the only seeded item is a TEST LISTING six-pack at $30.00 USD; address lookup is hardcoded to Canada and a Montréal-area view; invoice currency is USD; and region age gates are limited to 19 or 21. The region map drawing control in the admin UI is disconnected. Do not accept orders from a new country until the items below are resolved, implemented, and reviewed.

For each target country and city, have qualified local advisers and the relevant authorities confirm the required seller, marketplace, alcohol, delivery, advertising, worker, tax, consumer, privacy, payments, and identity-check rules. Define which licensed party sells and delivers each product, how IDs and refused handoffs are handled, permitted operating hours, records and retention, taxes and refunds, support language, and emergency escalation. These requirements vary by market; this checklist is not legal advice.

Then configure and verify: address geocoding for that country; an accurate server-enforced region polygon; local minimum age and age-check process; local products and stock; currency, taxes, and fees; delivery staff and coverage hours; translated customer and legal content; data retention; BTCPay assets and webhook; customer support; and incident/reconciliation procedures. Run successful test orders with each payment method and every delivery state before announcing launch.

## Payment and support notes

uBeer sends checkout to BTCPay Server and uses signed invoice webhooks plus a reconciliation job. Register the webhook at:

https://ubeer.example.com/api/webhooks/btcpay

Subscribe to InvoiceCreated, InvoiceReceivedPayment, InvoiceProcessing, InvoiceSettled, InvoiceExpired, and InvoiceInvalid. Put BTCPAY_STORE_ID, BTCPAY_API_KEY, and BTCPAY_WEBHOOK_SECRET in the protected server .env file. Never place values in this document, admin chat, or source control. Checkout currently creates USD invoices. The payment methods visible in hosted checkout depend on the BTCPay store configuration.

The floating AI support assistant uses a local Ollama service. It answers general platform questions, but cannot inspect customer orders or perform actions. Do not ask customers to provide secrets. Email notifications use a console transport by default until an SMTP adapter is configured; do not promise email delivery until end-to-end verified.

## Service checklist

Before each operating period, confirm the API, database, Redis, Nginx, and Ollama services are healthy; confirm the correct region and products are active; and confirm driver coverage. Afterward, reconcile BTCPay invoice state with uBeer order state, investigate failed or pending invoices, review manual refunds and driver payouts, and check audit entries. Avoid changing order status merely to make dashboards look correct; document the reason and reconcile payment and inventory separately.

Production service commands are run on the server by an authorized operator:

- Restart API: sudo systemctl restart ubeer-api
- API logs: sudo journalctl -u ubeer-api -f
- Nginx validation: sudo nginx -t
- Compose services: cd /opt/ubeer && sudo docker compose ps
- Build and publish a release: cd /opt/ubeer, then npm ci, npm run build, npm run db:migrate, copy apps/web/dist to /var/www/ubeer/web, and restart ubeer-api.

Take regular PostgreSQL backups with pg_dump and store them off-host with restricted access. Back up /var/lib/ubeer/uploads alongside the database because driver application files are stored there. Test restores. Keep the Android release signing key in encrypted backup; future Android updates must use the same key. Follow RUNBOOK.md for the complete commands and BTCPay key rotation procedure.

## Customer support quick answers

**My address is unavailable.** The service is limited to active regions. The current deployment only has Montréal Island and Canada-only address search. A waitlist request does not reserve a delivery.

**My payment says pending.** Check the BTCPay invoice page and keep its receipt. Support should reconcile the invoice before asking for another payment.

**The payment expired or failed.** Do not assume funds were returned or retry blindly. Support should check invoice status in BTCPay and follow the region's refund policy.

**Can support change my order or see my order through AI chat?** No. The AI chat provides general guidance only. Use the published support channel with the order reference, never the delivery code or payment credentials.

**How do refunds and driver payouts work?** The admin panel records refund notes and payout records; it does not automatically issue BTCPay refunds or transfer driver funds. An operator must make and verify the real-world/provider transaction separately.

## Incident response

If a secret is exposed, rotate it at the source, update protected server configuration, restart the API, verify the integration, and revoke the old credential. If payment events stop, check the API and Redis health, webhook signature errors, BTCPay invoice state, and reconciliation job. If personal documents are exposed, restrict access, preserve incident details, notify the designated privacy lead, and follow applicable reporting obligations. Do not delete logs or records needed for a lawful incident review.

---

Contact: Stephane Jacob <jacobstephane@outlook.com>
