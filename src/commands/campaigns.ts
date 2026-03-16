import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerCampaignCommands(program: Command): void {
  program
    .command("campaigns <account-id>")
    .description("List campaigns for an ad account")
    .option("--type <type>", "Campaign type: Search, Shopping, Audience, DynamicSearchAds, PerformanceMax (default all)")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const body: Record<string, unknown> = {
          AccountId: accountId,
        };
        if (opts.type) {
          body.CampaignType = opts.type;
        } else {
          body.CampaignType = "Search Shopping Audience DynamicSearchAds PerformanceMax";
        }
        body.ReturnAdditionalFields = "AdScheduleUseSearcherTimeZone BidStrategyId CpvCpmBiddingScheme DynamicDescriptionsSetting DynamicFeedSetting MaxConversionValueBiddingScheme MultimediaAdsBidAdjustment TargetImpressionShareBiddingScheme TargetSetting VerifiedTrackingSetting";
        const data = await callApi({
          creds,
          service: "campaign",
          path: "Campaigns/QueryByAccountId",
          accountId,
          body,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("campaign <campaign-id>")
    .description("Get a specific campaign by ID")
    .option("--account-id <id>", "Ad account ID (uses default from credentials if not set)")
    .action(async (campaignId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          service: "campaign",
          path: "Campaigns/QueryByIds",
          accountId: opts.accountId,
          body: {
            CampaignIds: [campaignId],
            CampaignType: "Search Shopping Audience DynamicSearchAds PerformanceMax",
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
