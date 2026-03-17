import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAudienceCommands(program: Command): void {
  program
    .command("audiences")
    .description("List audiences by type")
    .option("--type <type>", "Audience type: Custom, InMarket, Product, RemarketingList, SimilarRemarketingList, CustomerList, CombinedList (comma-separated, default RemarketingList)")
    .option("--account-id <id>", "Ad account ID")
    .action(async (opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const types = opts.type
          ? opts.type.split(",").map((t: string) => t.trim())
          : ["RemarketingList"];
        const data = await callApi({
          creds,
          service: "campaign",
          path: "Audiences/QueryByIds",
          accountId: opts.accountId,
          body: {
            AudienceIds: null,
            Type: types.join(" "),
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("uet-tags")
    .description("List UET (Universal Event Tracking) tags")
    .option("--account-id <id>", "Ad account ID")
    .action(async (opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          service: "campaign",
          path: "UetTags/QueryByIds",
          accountId: opts.accountId,
          body: { TagIds: null },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("conversion-goals")
    .description("List conversion goals")
    .option("--account-id <id>", "Ad account ID")
    .option("--type <type>", "Goal type: Url, Duration, PagesViewedPerVisit, Event, AppInstall, OfflineConversion, InStoreTransaction (comma-separated, default all)")
    .option("--tag-ids <ids>", "UET tag IDs to filter by (comma-separated, default all)")
    .action(async (opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const types = opts.type
          ? opts.type
          : "Url Duration PagesViewedPerVisit Event AppInstall OfflineConversion InStoreTransaction";
        const tagIds = opts.tagIds
          ? opts.tagIds.split(",").map((id: string) => id.trim())
          : null;
        const data = await callApi({
          creds,
          service: "campaign",
          path: "ConversionGoals/QueryByTagIds",
          accountId: opts.accountId,
          body: {
            TagIds: tagIds,
            ConversionGoalTypes: types,
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
