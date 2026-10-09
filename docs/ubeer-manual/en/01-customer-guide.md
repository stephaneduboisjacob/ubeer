# Customer Guide

## 1. Open uBeer

Visit https://ubeer.example.com on a phone or computer. On iPhone or iPad, open the page in Safari, tap Share, then choose Add to Home Screen. On Android, open it in Chrome and choose Install app or Add to Home screen. The home page also links to the Android APK. The Android app is a signed WebView app that presents the uBeer mobile site; keep Android set to allow installation from the source you chose and install updates only from the official uBeer site.

Choose a language from the header. Quebec visitors are normally shown French first; a delivery region can set its own default language. You can change the language manually.

## 2. Check your address

Enter a street address and submit the search, or request your device location and then confirm an address. Select the exact matching street address from the results. A postal-code result is approximate: it can indicate likely coverage, but it is not enough to place an order. The server checks the selected point against the active service boundary before it shows the catalog, validates the cart, and accepts checkout.

If the address is outside every active region, uBeer shows a coming-soon message and a waitlist form. Enter an email address to request an update. A waitlist entry is not an order or a promise of service.

Current prototype limitation: address search is restricted to Canada and a Montréal-area view. The only configured region is Montréal Island. Overseas addresses will not be served by this deployment, even if the interface has a language option for that country.

## 3. Choose products and review the cart

The current seed catalog contains one test item: 6-Pack Heineken Beer, $30.00 USD. The product image and TEST LISTING label identify prototype inventory. Availability and stock are checked by the server when you add an item and again at checkout. The region's delivery fee and minimum order value, if any, appear in the cart. Checkout currently bills in USD.

Before continuing, check the item, quantity, delivery fee, total, delivery address, and email for the receipt. Do not order alcohol for someone who is not legally allowed to receive it in the delivery location.

The email address is saved with the order, but delivery of email notifications depends on the operator configuring and verifying an email service. Use the order-status page and BTCPay receipt as your records until email delivery is confirmed.

## 4. Confirm age and pay

Enter a valid email and exact delivery address. Check the age confirmation shown for the region. The current application supports configured gates of 19+ or 21+; the checkout checkbox is a customer declaration, not identity or age verification. Have valid government-issued photo identification ready for the handoff and follow local rules.

Continue to secure checkout. uBeer creates an order and opens BTCPay Server in a separate hosted checkout. Review the amount and payment options shown there and complete payment before the invoice expires. Actual currencies and payment networks depend on the BTCPay store configuration and availability; use the checkout page as the definitive list.

After checkout is created, save the six-digit delivery code shown by uBeer. Give it only to your assigned driver at the handoff. Do not post it in chat, send it with a payment screenshot, or share it before the driver is physically completing delivery. The code is required to mark the order delivered.

## 5. Track an order and view history

Use the order-status link presented after checkout. Keep the browser session or link private because it grants access to that order's status. The status page refreshes automatically and shows the order stages; it does not provide a live driver map. Possible stages include pending payment, paid, accepted, preparing, out for delivery, delivered, failed, cancelled, and refunded.

You may create an account or sign in at My orders to see orders associated with that account. Guest orders remain accessible using their private status link. Signing in after a guest order does not automatically attach that earlier order to the account.

## 6. Help and responsible use

The floating uBeer Support chat can answer general platform questions in the selected language. It cannot inspect your order, change an order, or verify payment. Do not share passwords, authenticator codes, delivery codes, payment secrets, or identity documents in chat. For a payment or delivery problem, contact the operator using the published support channel and provide the order reference, never a secret code.

Alcohol delivery is only for eligible adults and is subject to the laws and operating rules of the actual delivery location. Do not drive after drinking. If you think a payment has been taken but the order still says pending, save the BTCPay receipt and ask support to reconcile the invoice; do not pay a second time until the first invoice is checked.

---

Contact: Stephane Jacob <jacobstephane@outlook.com>
