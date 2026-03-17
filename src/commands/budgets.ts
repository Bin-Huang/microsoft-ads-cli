import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerBudgetCommands(program: Command): void {
  program
    .command("budgets <budget-ids>")
    .description("Get budgets by IDs (comma-separated)")
    .option("--account-id <id>", "Ad account ID")
    .action(async (budgetIds: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          service: "campaign",
          path: "Budgets/QueryByIds",
          accountId: opts.accountId,
          body: {
            BudgetIds: budgetIds.split(",").map((id: string) => id.trim()),
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("bid-strategies <bid-strategy-ids>")
    .description("Get bid strategies by IDs (comma-separated)")
    .option("--account-id <id>", "Ad account ID")
    .action(async (bidStrategyIds: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          service: "campaign",
          path: "BidStrategies/QueryByIds",
          accountId: opts.accountId,
          body: {
            BidStrategyIds: bidStrategyIds.split(",").map((id: string) => id.trim()),
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("labels")
    .description("List labels for the account")
    .option("--account-id <id>", "Ad account ID")
    .action(async (opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          service: "campaign",
          path: "Labels/QueryByIds",
          accountId: opts.accountId,
          body: {
            LabelIds: null,
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
