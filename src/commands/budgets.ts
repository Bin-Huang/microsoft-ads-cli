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
    .option("--page-index <n>", "Page index (0-based, default 0)", "0")
    .option("--page-size <n>", "Results per page (default 1000)", "1000")
    .action(async (opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          service: "campaign",
          path: "Labels/QueryByPage",
          accountId: opts.accountId,
          body: {
            PageInfo: {
              Index: parseInt(opts.pageIndex),
              Size: parseInt(opts.pageSize),
            },
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
