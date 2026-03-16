import type { Credentials } from "./auth.js";

const BASE_URLS = {
  campaign: "https://campaign.api.bingads.microsoft.com/CampaignManagement/v13",
  customer: "https://clientcenter.api.bingads.microsoft.com/CustomerManagement/v13",
  reporting: "https://reporting.api.bingads.microsoft.com/Reporting/v13",
  adInsight: "https://adinsight.api.bingads.microsoft.com/Api/Advertiser/AdInsight/v13",
  bulk: "https://bulk.api.bingads.microsoft.com/Api/Advertiser/CampaignManagement/v13",
} as const;

type ServiceName = keyof typeof BASE_URLS;

interface CallOptions {
  creds: Credentials;
  service: ServiceName;
  path: string;
  body?: Record<string, unknown>;
  accountId?: string;
  customerId?: string;
}

export async function callApi(opts: CallOptions): Promise<unknown> {
  const url = `${BASE_URLS[opts.service]}/${opts.path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${opts.creds.access_token}`,
    DeveloperToken: opts.creds.developer_token,
  };

  const accountId = opts.accountId || opts.creds.account_id;
  const customerId = opts.customerId || opts.creds.customer_id;
  if (accountId) headers["CustomerAccountId"] = accountId;
  if (customerId) headers["CustomerId"] = customerId;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(opts.body || {}),
  });

  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    data = { rawResponse: text };
  }

  if (!res.ok) {
    const msg = typeof data === "object" && data !== null && "Message" in data
      ? (data as Record<string, unknown>).Message
      : `HTTP ${res.status}`;
    throw new Error(String(msg));
  }

  return data;
}
