import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import { verifyWebhookSignature } from "./btcpay.js";

describe("BTCPay webhook signatures", () => {
  afterEach(() => { delete process.env.BTCPAY_WEBHOOK_SECRET; });

  it("accepts a valid HMAC-SHA256 signature", () => {
    const body = '{"deliveryId":"test-1","type":"InvoiceSettled"}';
    process.env.BTCPAY_WEBHOOK_SECRET = "unit-test-webhook-secret";
    const signature = createHmac("sha256", process.env.BTCPAY_WEBHOOK_SECRET).update(body).digest("hex");
    expect(verifyWebhookSignature(body, signature)).toBe(true);
    expect(verifyWebhookSignature(body, `sha256=${signature}`)).toBe(true);
  });

  it("rejects missing, malformed and mismatched signatures", () => {
    process.env.BTCPAY_WEBHOOK_SECRET = "unit-test-webhook-secret";
    expect(verifyWebhookSignature("{}", undefined)).toBe(false);
    expect(verifyWebhookSignature("{}", "abc")).toBe(false);
    expect(verifyWebhookSignature("{}", "0".repeat(64))).toBe(false);
  });
});
