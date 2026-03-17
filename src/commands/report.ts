import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerReportCommands(program: Command): void {
  program
    .command("report <account-id>")
    .description("Submit a campaign performance report request")
    .requiredOption("--start-date <date>", "Start date (YYYY-MM-DD)")
    .requiredOption("--end-date <date>", "End date (YYYY-MM-DD)")
    .option("--granularity <gran>", "Time granularity: Daily, Weekly, Monthly, Summary (default Daily)", "Daily")
    .option("--columns <cols>", "Report columns (comma-separated, default common set)")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const [sy, sm, sd] = opts.startDate.split("-").map(Number);
        const [ey, em, ed] = opts.endDate.split("-").map(Number);
        const columns = opts.columns
          ? opts.columns.split(",").map((c: string) => c.trim())
          : [
              "TimePeriod", "AccountId", "AccountName",
              "CampaignId", "CampaignName", "CampaignStatus",
              "Impressions", "Clicks", "Ctr",
              "Spend", "AverageCpc", "Conversions",
              "ConversionRate", "CostPerConversion", "Revenue",
            ];
        const data = await callApi({
          creds,
          service: "reporting",
          path: "GenerateReport/Submit",
          accountId,
          body: {
            ReportRequest: {
              Type: "CampaignPerformanceReportRequest",
              ExcludeColumnHeaders: false,
              ExcludeReportFooter: true,
              ExcludeReportHeader: true,
              Format: "Csv",
              FormatVersion: "2.0",
              ReportName: "CampaignPerformanceReport",
              ReturnOnlyCompleteData: false,
              Aggregation: opts.granularity,
              Columns: columns,
              Scope: {
                AccountIds: [accountId],
              },
              Time: {
                CustomDateRangeStart: { Year: sy, Month: sm, Day: sd },
                CustomDateRangeEnd: { Year: ey, Month: em, Day: ed },
              },
            },
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("report-status <report-id>")
    .description("Check the status of a submitted report")
    .action(async (reportId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          service: "reporting",
          path: "GenerateReport/Poll",
          body: { ReportRequestId: reportId },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("keyword-report <account-id>")
    .description("Submit a keyword performance report request")
    .requiredOption("--start-date <date>", "Start date (YYYY-MM-DD)")
    .requiredOption("--end-date <date>", "End date (YYYY-MM-DD)")
    .option("--granularity <gran>", "Time granularity: Daily, Weekly, Monthly, Summary (default Daily)", "Daily")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const [sy, sm, sd] = opts.startDate.split("-").map(Number);
        const [ey, em, ed] = opts.endDate.split("-").map(Number);
        const data = await callApi({
          creds,
          service: "reporting",
          path: "GenerateReport/Submit",
          accountId,
          body: {
            ReportRequest: {
              Type: "KeywordPerformanceReportRequest",
              ExcludeColumnHeaders: false,
              ExcludeReportFooter: true,
              ExcludeReportHeader: true,
              Format: "Csv",
              FormatVersion: "2.0",
              ReportName: "KeywordPerformanceReport",
              ReturnOnlyCompleteData: false,
              Aggregation: opts.granularity,
              Columns: [
                "TimePeriod", "AccountId", "CampaignId", "CampaignName",
                "AdGroupId", "AdGroupName", "Keyword", "KeywordId",
                "BidMatchType", "DeliveredMatchType",
                "Impressions", "Clicks", "Ctr",
                "Spend", "AverageCpc", "Conversions",
                "QualityScore",
              ],
              Scope: {
                AccountIds: [accountId],
              },
              Time: {
                CustomDateRangeStart: { Year: sy, Month: sm, Day: sd },
                CustomDateRangeEnd: { Year: ey, Month: em, Day: ed },
              },
            },
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("adgroup-report <account-id>")
    .description("Submit an ad group performance report request")
    .requiredOption("--start-date <date>", "Start date (YYYY-MM-DD)")
    .requiredOption("--end-date <date>", "End date (YYYY-MM-DD)")
    .option("--granularity <gran>", "Time granularity: Daily, Weekly, Monthly, Summary (default Daily)", "Daily")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const [sy, sm, sd] = opts.startDate.split("-").map(Number);
        const [ey, em, ed] = opts.endDate.split("-").map(Number);
        const data = await callApi({
          creds,
          service: "reporting",
          path: "GenerateReport/Submit",
          accountId,
          body: {
            ReportRequest: {
              Type: "AdGroupPerformanceReportRequest",
              ExcludeColumnHeaders: false,
              ExcludeReportFooter: true,
              ExcludeReportHeader: true,
              Format: "Csv",
              FormatVersion: "2.0",
              ReportName: "AdGroupPerformanceReport",
              ReturnOnlyCompleteData: false,
              Aggregation: opts.granularity,
              Columns: [
                "TimePeriod", "AccountId", "CampaignId", "CampaignName",
                "AdGroupId", "AdGroupName", "AdGroupStatus",
                "Impressions", "Clicks", "Ctr",
                "Spend", "AverageCpc", "Conversions",
                "ConversionRate", "CostPerConversion",
              ],
              Scope: {
                AccountIds: [accountId],
              },
              Time: {
                CustomDateRangeStart: { Year: sy, Month: sm, Day: sd },
                CustomDateRangeEnd: { Year: ey, Month: em, Day: ed },
              },
            },
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
