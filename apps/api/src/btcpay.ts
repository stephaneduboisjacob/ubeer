import { createHmac, timingSafeEqual } from "node:crypto";

type InvoiceInput = {
  orderId: string;
  amount: string;
  currency: string;
  redirectURL: string;
};

type BtcpayInvoice = {
  id: string;
  checkoutLink: string;
  status?: string;
};

export class BtcpayConfigurationError extends Error {
  constructor(message = "BTCPay is not configured. Set BTCPAY_HOST, BTCPAY_STORE_ID, BTCPAY_API_KEY and BTCPAY_WEBHOOK_SECRET.") {
    super(message);
    this.name = "BtcpayConfigurationError";
  }
}

export class BtcpayClient {
  private get config() {
    const host = process.env.BTCPAY_HOST;
    const storeId = process.env.BTCPAY_STORE_ID;
    const apiKey = process.env.BTCPAY_API_KEY;
    if (!host || !storeId || !apiKey) throw new BtcpayConfigurationError();
    return { host: host.replace(/\/$/, ""), storeId, apiKey };
  }

  assertConfigured(): void {
    void this.config;
    if (!process.env.BTCPAY_WEBHOOK_SECRET) throw new BtcpayConfigurationError();
  }

  async createInvoice(input: InvoiceInput): Promise<BtcpayInvoice> {
    const { host, storeId, apiKey } = this.config;
    const response = await fetch(`${host}/api/v1/stores/${encodeURIComponent(storeId)}/invoices`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `token ${apiKey}` },
      body: JSON.stringify({
        amount: input.amount,
        currency: input.currency,
        metadata: { orderId: input.orderId },
        checkout: { redirectURL: input.redirectURL, redirectAutomatically: true },
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`BTCPay invoice creation failed (${response.status}): ${await response.text()}`);
    const invoice = (await response.json()) as Partial<BtcpayInvoice>;
    if (!invoice.id || !invoice.checkoutLink) throw new Error("BTCPay response did not include invoice id and checkoutLink");
    return invoice as BtcpayInvoice;
  }

  async getInvoice(invoiceId: string): Promise<BtcpayInvoice> {
    const { host, storeId, apiKey } = this.config;
    const response = await fetch(`${host}/api/v1/stores/${encodeURIComponent(storeId)}/invoices/${encodeURIComponent(invoiceId)}`, {
      headers: { Authorization: `token ${apiKey}` },
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`BTCPay invoice lookup failed (${response.status}): ${await response.text()}`);
    return (await response.json()) as BtcpayInvoice;
  }
}

export function verifyWebhookSignature(rawBody: string, providedSignature: string | undefined): boolean {
  const secret = process.env.BTCPAY_WEBHOOK_SECRET;
  if (!secret || !providedSignature) return false;
  const normalized = providedSignature.startsWith("sha256=") ? providedSignature.slice(7) : providedSignature;
  if (!/^[a-fA-F0-9]{64}$/.test(normalized)) return false;
  const expected = createHmac("sha256", secret).update(Buffer.from(rawBody, "utf8")).digest();
  const actual = Buffer.from(normalized, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
