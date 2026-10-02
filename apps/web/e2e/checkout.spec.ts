import { expect, test } from "@playwright/test";

test("customer finds their region, adds the test pack, and gets a BTCPay checkout link", async ({ page }) => {
  const regionId = "11a0df5d-4f8c-43d6-b2b6-7c66bc5c189e";
  const productId = "be5a078a-f682-4fd8-aa68-8731508d05f2";
  await page.route("**/api/geocode**", (route) => route.fulfill({ json: { latitude: 48.424, longitude: -123.364, label: "Downtown Victoria" } }));
  await page.route("**/api/regions/check**", (route) => route.fulfill({ json: { available: true, region: { id: regionId, name: "Test Region — Downtown", ageGate: 19, minimumOrderCents: 0, deliveryFeeCents: 500 } } }));
  await page.route("**/api/catalog**", (route) => route.fulfill({ json: { region: { id: regionId, name: "Test Region — Downtown", ageGate: 19, deliveryFeeCents: 500 }, products: [{ id: productId, name: "6-Pack Heineken Beer", description: "Test listing: six-pack of Heineken beer.", priceCents: 3000, stock: 999, isTest: true }] } }));
  await page.route("**/api/cart/validate", (route) => route.fulfill({ json: { valid: true } }));
  await page.route("**/api/checkout", (route) => route.fulfill({ status: 201, json: { orderId: "96373de7-c381-4ed3-b999-c70ae04731a7", checkoutLink: "https://payments.btcpay.exchange/i/test-invoice", statusToken: "test-status-token-0123456789-abcdef", deliveryCode: "084216" } }));

  await page.goto("/");
  await page.getByRole("textbox", { name: "Address or postal code" }).first().fill("Downtown Victoria");
  await page.getByRole("button", { name: "Check delivery area" }).click();
  await expect(page.getByText("Good news — we deliver to Test Region — Downtown.")).toBeVisible();
  await page.getByRole("button", { name: "Add one" }).click();
  await page.getByLabel("Email for your receipt").fill("customer@example.test");
  await page.getByRole("checkbox", { name: /I confirm I am at least 19 years old/ }).check();
  await page.getByRole("button", { name: "Continue to secure checkout" }).click();
  await expect(page.getByText("084216")).toBeVisible();
  await expect(page.getByRole("link", { name: "Pay securely with Bitcoin" })).toHaveAttribute("href", "https://payments.btcpay.exchange/i/test-invoice");
});

test("mobile app can be installed and reaches customer, driver, and admin areas", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const manifest = await page.request.get("/manifest.webmanifest");
  expect((await manifest.json()).display).toBe("standalone");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("link", { name: "My orders" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Driver app" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Admin" })).toBeVisible();
});
