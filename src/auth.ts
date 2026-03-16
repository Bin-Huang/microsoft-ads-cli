import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

export interface Credentials {
  access_token: string;
  developer_token: string;
  customer_id?: string;
  account_id?: string;
}

const DEFAULT_PATH = join(
  homedir(),
  ".config",
  "microsoft-ads-cli",
  "credentials.json"
);

export function loadCredentials(path?: string): Credentials {
  // Try explicit path first
  if (path) {
    return JSON.parse(readFileSync(path, "utf-8"));
  }

  // Try env vars
  if (process.env.MICROSOFT_ADS_ACCESS_TOKEN && process.env.MICROSOFT_ADS_DEVELOPER_TOKEN) {
    return {
      access_token: process.env.MICROSOFT_ADS_ACCESS_TOKEN,
      developer_token: process.env.MICROSOFT_ADS_DEVELOPER_TOKEN,
      customer_id: process.env.MICROSOFT_ADS_CUSTOMER_ID,
      account_id: process.env.MICROSOFT_ADS_ACCOUNT_ID,
    };
  }

  // Try default path
  if (existsSync(DEFAULT_PATH)) {
    return JSON.parse(readFileSync(DEFAULT_PATH, "utf-8"));
  }

  throw new Error(
    `No credentials found. Set MICROSOFT_ADS_ACCESS_TOKEN + MICROSOFT_ADS_DEVELOPER_TOKEN env vars, ` +
    `use --credentials <path>, or place credentials at ${DEFAULT_PATH}`
  );
}
