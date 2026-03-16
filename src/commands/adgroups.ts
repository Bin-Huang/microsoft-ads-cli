import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAdgroupCommands(program: Command): void {
  program
    .command("adgroups <campaign-id>")
    .description("List ad groups for a campaign")
    .option("--account-id <id>", "Ad account ID")
    .action(async (campaignId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          service: "campaign",
          path: "AdGroups/QueryByCampaignId",
          accountId: opts.accountId,
          body: {
            CampaignId: campaignId,
            ReturnAdditionalFields: "AdScheduleUseSearcherTimeZone CpmBid CpvBid MultimediaAdsBidAdjustment",
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
