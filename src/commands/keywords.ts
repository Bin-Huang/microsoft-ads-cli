import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerKeywordCommands(program: Command): void {
  program
    .command("keywords <adgroup-id>")
    .description("List keywords for an ad group")
    .option("--account-id <id>", "Ad account ID")
    .action(async (adgroupId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          service: "campaign",
          path: "Keywords/QueryByAdGroupId",
          accountId: opts.accountId,
          body: {
            AdGroupId: adgroupId,
            ReturnAdditionalFields: "ImpressionTrackingUrls",
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("negative-keywords <entity-id>")
    .description("List negative keywords for a campaign or ad group")
    .option("--account-id <id>", "Ad account ID")
    .option("--type <type>", "Entity type: Campaign or AdGroup (default Campaign)", "Campaign")
    .action(async (entityId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          service: "campaign",
          path: "NegativeKeywords/QueryByEntityIds",
          accountId: opts.accountId,
          body: {
            EntityIds: [entityId],
            EntityType: opts.type,
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
