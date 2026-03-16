import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAdCommands(program: Command): void {
  program
    .command("ads <adgroup-id>")
    .description("List ads for an ad group")
    .option("--account-id <id>", "Ad account ID")
    .option("--type <type>", "Ad types to return (default all)")
    .action(async (adgroupId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const body: Record<string, unknown> = {
          AdGroupId: adgroupId,
          AdTypes: opts.type
            ? [opts.type]
            : ["AppInstall", "DynamicSearch", "ExpandedText", "Hotel", "Product", "ResponsiveAd", "ResponsiveSearch"],
        };
        const data = await callApi({
          creds,
          service: "campaign",
          path: "Ads/QueryByAdGroupId",
          accountId: opts.accountId,
          body,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
