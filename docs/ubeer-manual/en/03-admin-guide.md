# Administrator Guide

## Access and account security

Open https://ubeer.example.com/admin. Sign in with the administrator email and password provisioned for this installation, then enter the current six-digit code from the enrolled authenticator app. Administrator TOTP is mandatory. Bootstrap credentials are stored separately on the server; do not copy them into this manual, a ticket, or a chat. If the initial authenticator has not been enrolled, use the protected bootstrap instructions. The web app currently has no self-service admin password or TOTP recovery flow; restrict server recovery to trusted operators and rotate any exposed credentials.

For this installation, the one-time bootstrap credential file is the protected path configured with `ADMIN_CREDENTIALS_PATH` and is readable only by the server administrator. Ask the authorized host operator to provision access securely, enroll the authenticator, and remove the file afterward. Never place the password or TOTP seed in email, a ticket, or this documentation.

Use a unique password, lock devices, and sign out on shared computers. The session uses secure, HTTP-only cookies. Admin mutations create audit records; review the Audit log after sensitive changes.

## Dashboard and order operations

The overview reports orders today, paid revenue in USD, approved online drivers, and failed payments. Use Orders to inspect recent orders and filter by status. Statuses include pending_payment, paid, accepted, preparing, out_for_delivery, delivered, cancelled, refunded, and failed.

Use Change status only to correct an exceptional operational state. Enter a clear audit note describing evidence and reason. A forced status change does not itself reverse a BTCPay payment, refund cryptocurrency, notify every party, or guarantee stock reconciliation. For refunds, use Refund note to record the decision and operational note. This changes the uBeer order status to refunded but does not issue an on-chain or BTCPay refund. Process any actual payment return separately according to the payment provider and local policy, then document the result.

## Regions and market configuration

Regions control the authoritative delivery boundary, language default, active state, minimum order, delivery fee, and the displayed age gate. Customer region checks and checkout are enforced by the API, not by the map image. Deactivating a region stops new delivery checks from accepting it. The current application only allows age-gate values of 19 or 21, and checkout currency is fixed to USD.

**Current UI limitation:** the region page displays existing geometry, but its map drawing control is not connected. Do not assume a polygon can be created by clicking the map. The region API accepts GeoJSON, but adding or changing coverage currently requires a reviewed engineering/operator process. Test the resulting coordinates against the actual legal and dispatch boundary before activating a region. The deployed search service is restricted to Canada and a Montréal-area view, so adding an overseas polygon alone will not enable overseas address search.

The live Montréal Island region is a prototype. Keep it active only for testing. Before a commercial launch, configure the destination market's boundary, language, fee, minimum, legal age, local currency behavior, geocoder, products, legal notices, and delivery operations.

## Catalog

Products can be created in the admin screen with name, description, USD price, stock, one or more regions, and a test-listing flag. The interface can pause/reactivate a listing; detailed edits and archive actions are also available through the API. Confirm product legality, supplier availability, label and image rights, stock, taxes, and final price before activating. The seeded Heineken six-pack is test inventory and must not be treated as a commercial offer.

## Drivers, customers, and payouts

Review Drivers → Applications & drivers. Inspect the application details and identity document through the admin-only document access. Approve, reject, or suspend with an appropriate note. Approval generates a temporary password shown once; transfer it privately to the verified applicant. Protect downloaded ID files and delete them under the approved retention policy.

Users lets admins ban or unban customer accounts. Payouts are manual records: select a driver, enter the amount and note, then mark a payout paid only after an actual transfer has been verified. Earnings and payout entry are not automated banking or crypto payments.

## Settings, audit, and routine checks

Settings displays the platform-fee percentage and masked BTCPay configuration state. The fee can be changed there. BTCPay store ID, API key, webhook secret, database credentials, and signing keys belong in protected server configuration, never in the browser, source control, or this guide. The admin panel does not reveal secret values.

Check the Dashboard and Audit log daily. Reconcile paid orders, failed invoices, driver availability, manual refunds, and payout records. Use the [Launch and operations guide](05-launch-and-operations.md) for payment setup, backups, incident triage, and market approval gates.

---

Contact: Stephane Jacob <jacobstephane@outlook.com>
