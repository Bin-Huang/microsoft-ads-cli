# microsoft-ads-cli

Give AI agents direct access to Microsoft Advertising data. One command to query campaigns, keywords, audiences, and pull performance reports -- no SDK, no docs to read, no tokens wasted on boilerplate.

**Works with:** OpenClaw, Claude Code, Cursor, Codex, and any agent that can run shell commands.

## Installation

```bash
npm install -g microsoft-ads-cli
```

Or run directly with npx:

```bash
npx microsoft-ads-cli --help
```

## How it works

Built on the official [Bing Ads API v13](https://learn.microsoft.com/en-us/advertising/guides/get-started). Handles OAuth2 Bearer token authentication with Developer Token headers. Every command outputs structured JSON to stdout, ready for agents to parse without extra processing.

Core APIs covered:

- **[Customer Management](https://learn.microsoft.com/en-us/advertising/customer-management-service/customer-management-service-reference)** -- accounts, user info
- **[Campaign Management](https://learn.microsoft.com/en-us/advertising/campaign-management-service/campaign-management-service-reference)** -- campaigns, ad groups, ads, keywords, audiences
- **[Reporting](https://learn.microsoft.com/en-us/advertising/reporting-service/reporting-service-reference)** -- campaign, ad group, and keyword performance reports

## Setup

### Step 1: Register an application

1. Go to [Azure Portal](https://portal.azure.com/) and sign in.
2. Navigate to Azure Active Directory → App registrations → New registration.
3. Set redirect URI to `https://login.microsoftonline.com/common/oauth2/nativeclient` for desktop apps.
4. Note your **Application (client) ID**.

### Step 2: Get a Developer Token

1. Sign in to the [Microsoft Advertising Developer Portal](https://developers.ads.microsoft.com/Account).
2. Request a Developer Token (universal token recommended).

### Step 3: Get an OAuth2 access token

Use the Microsoft identity platform OAuth2 flow:

```bash
# 1. Get authorization code (open in browser)
# https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https://login.microsoftonline.com/common/oauth2/nativeclient&scope=https://ads.microsoft.com/msads.manage

# 2. Exchange code for tokens
curl -X POST https://login.microsoftonline.com/common/oauth2/v2.0/token \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "grant_type=authorization_code" \
  -d "code=YOUR_AUTH_CODE" \
  -d "redirect_uri=https://login.microsoftonline.com/common/oauth2/nativeclient" \
  -d "scope=https://ads.microsoft.com/msads.manage"
```

### Step 4: Place the credentials file

```bash
mkdir -p ~/.config/microsoft-ads-cli
cat > ~/.config/microsoft-ads-cli/credentials.json << EOF
{
  "access_token": "YOUR_ACCESS_TOKEN",
  "developer_token": "YOUR_DEVELOPER_TOKEN",
  "customer_id": "YOUR_CUSTOMER_ID",
  "account_id": "YOUR_DEFAULT_ACCOUNT_ID"
}
EOF
```

Or use environment variables:

```bash
export MICROSOFT_ADS_ACCESS_TOKEN=your_access_token
export MICROSOFT_ADS_DEVELOPER_TOKEN=your_developer_token
export MICROSOFT_ADS_CUSTOMER_ID=your_customer_id
export MICROSOFT_ADS_ACCOUNT_ID=your_account_id
```

## Usage

All commands output pretty-printed JSON by default. Use `--format compact` for compact single-line JSON.

### accounts

Search for ad accounts you have access to.

```bash
microsoft-ads-cli accounts
microsoft-ads-cli accounts --page-size 50
```

Options:
- `--page-index <n>` -- page index, 0-based (default 0)
- `--page-size <n>` -- results per page (default 100)

### account

Get details of a specific ad account.

```bash
microsoft-ads-cli account 123456789
```

### user

Get the current authenticated user info.

```bash
microsoft-ads-cli user
```

### campaigns

List campaigns for an ad account.

```bash
microsoft-ads-cli campaigns 123456789
microsoft-ads-cli campaigns 123456789 --type Search
microsoft-ads-cli campaigns 123456789 --type "Shopping PerformanceMax"
```

Options:
- `--type <type>` -- campaign type: Search, Shopping, Audience, DynamicSearchAds, PerformanceMax (space-separated for multiple, default all)

### campaign

Get a specific campaign by ID.

```bash
microsoft-ads-cli campaign 987654321
microsoft-ads-cli campaign 987654321 --account-id 123456789
```

Options:
- `--account-id <id>` -- ad account ID

### adgroups

List ad groups for a campaign.

```bash
microsoft-ads-cli adgroups 987654321
microsoft-ads-cli adgroups 987654321 --account-id 123456789
```

Options:
- `--account-id <id>` -- ad account ID

### ads

List ads for an ad group.

```bash
microsoft-ads-cli ads 111222333
microsoft-ads-cli ads 111222333 --type ResponsiveSearch
```

Options:
- `--account-id <id>` -- ad account ID
- `--type <type>` -- ad type filter

### keywords

List keywords for an ad group.

```bash
microsoft-ads-cli keywords 111222333
```

Options:
- `--account-id <id>` -- ad account ID

### negative-keywords

List negative keywords for a campaign or ad group.

```bash
microsoft-ads-cli negative-keywords 987654321 --type Campaign
microsoft-ads-cli negative-keywords 111222333 --type AdGroup
```

Options:
- `--account-id <id>` -- ad account ID
- `--type <type>` -- entity type: Campaign or AdGroup (default Campaign)

### audiences

List audiences by type.

```bash
microsoft-ads-cli audiences
microsoft-ads-cli audiences --type "RemarketingList,CustomerList"
```

Options:
- `--account-id <id>` -- ad account ID
- `--type <type>` -- audience type (comma-separated): Custom, InMarket, Product, RemarketingList, SimilarRemarketingList, CustomerList, CombinedList (default RemarketingList)

### uet-tags

List UET (Universal Event Tracking) tags.

```bash
microsoft-ads-cli uet-tags
```

Options:
- `--account-id <id>` -- ad account ID

### conversion-goals

List conversion goals.

```bash
microsoft-ads-cli conversion-goals
microsoft-ads-cli conversion-goals --type "Event,OfflineConversion"
```

Options:
- `--account-id <id>` -- ad account ID
- `--type <type>` -- goal type (comma-separated): Url, Duration, PagesViewedPerVisit, Event, AppInstall, OfflineConversion, InStoreTransaction (default all)

### budgets

Get budgets by IDs.

```bash
microsoft-ads-cli budgets 111,222,333
```

Options:
- `--account-id <id>` -- ad account ID

### bid-strategies

Get bid strategies by IDs.

```bash
microsoft-ads-cli bid-strategies 111,222
```

Options:
- `--account-id <id>` -- ad account ID

### labels

List labels for the account.

```bash
microsoft-ads-cli labels
microsoft-ads-cli labels --page-size 500
```

Options:
- `--account-id <id>` -- ad account ID
- `--page-index <n>` -- page index, 0-based (default 0)
- `--page-size <n>` -- results per page (default 1000)

### report

Submit a campaign performance report request.

```bash
microsoft-ads-cli report 123456789 \
  --start-date 2026-03-01 \
  --end-date 2026-03-15 \
  --granularity Daily
```

Options:
- `--start-date <date>` -- start date, YYYY-MM-DD (required)
- `--end-date <date>` -- end date, YYYY-MM-DD (required)
- `--granularity <gran>` -- Daily, Weekly, Monthly, Summary (default Daily)
- `--columns <cols>` -- report columns (comma-separated, default common set)

Returns a `ReportRequestId` to poll with `report-status`.

### report-status

Check the status of a submitted report.

```bash
microsoft-ads-cli report-status abc123-report-id
```

When status is `Success`, the response includes a `ReportDownloadUrl`.

### keyword-report

Submit a keyword performance report request.

```bash
microsoft-ads-cli keyword-report 123456789 \
  --start-date 2026-03-01 \
  --end-date 2026-03-15
```

Options:
- `--start-date <date>` -- start date (required)
- `--end-date <date>` -- end date (required)
- `--granularity <gran>` -- Daily, Weekly, Monthly, Summary (default Daily)

### adgroup-report

Submit an ad group performance report request.

```bash
microsoft-ads-cli adgroup-report 123456789 \
  --start-date 2026-03-01 \
  --end-date 2026-03-15
```

Options:
- `--start-date <date>` -- start date (required)
- `--end-date <date>` -- end date (required)
- `--granularity <gran>` -- Daily, Weekly, Monthly, Summary (default Daily)

## Error output

Errors are written to stderr as JSON with an `error` field and a non-zero exit code:

```json
{"error": "AuthenticationTokenExpired"}
```

## API Reference

- Get Started: https://learn.microsoft.com/en-us/advertising/guides/get-started
- Authentication: https://learn.microsoft.com/en-us/advertising/guides/authentication-oauth
- Campaign Management: https://learn.microsoft.com/en-us/advertising/campaign-management-service/campaign-management-service-reference
- Reporting: https://learn.microsoft.com/en-us/advertising/reporting-service/reporting-service-reference

## Related

- [google-analytics-cli](https://github.com/Bin-Huang/google-analytics-cli) -- Google Analytics CLI for AI agents
- [google-search-console-cli](https://github.com/Bin-Huang/google-search-console-cli) -- Google Search Console CLI for AI agents
- [tiktok-ads-cli](https://github.com/Bin-Huang/tiktok-ads-cli) -- TikTok Ads CLI for AI agents
- [x-ads-cli](https://github.com/Bin-Huang/x-ads-cli) -- X Ads CLI for AI agents
- [reddit-ads-cli](https://github.com/Bin-Huang/reddit-ads-cli) -- Reddit Ads CLI for AI agents
- [apple-ads-cli](https://github.com/Bin-Huang/apple-ads-cli) -- Apple Ads CLI for AI agents
- [pinterest-ads-cli](https://github.com/Bin-Huang/pinterest-ads-cli) -- Pinterest Ads CLI for AI agents

## License

Apache-2.0
