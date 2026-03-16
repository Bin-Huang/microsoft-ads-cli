import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAccountCommands(program: Command): void {
  program
    .command("accounts")
    .description("Search for ad accounts")
    .option("--page-index <n>", "Page index (0-based, default 0)", "0")
    .option("--page-size <n>", "Results per page (default 100)", "100")
    .action(async (opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          service: "customer",
          path: "Accounts/Search",
          body: {
            PageInfo: {
              Index: parseInt(opts.pageIndex),
              Size: parseInt(opts.pageSize),
            },
            Predicates: [
              {
                Field: "AccountLifeCycleStatus",
                Operator: "In",
                Value: "Active,Pause",
              },
            ],
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("account <account-id>")
    .description("Get details of a specific ad account")
    .action(async (accountId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          service: "customer",
          path: "Account/Query",
          body: { AccountId: accountId },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("user")
    .description("Get the current authenticated user info")
    .action(async () => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          service: "customer",
          path: "User/Query",
          body: { UserId: null },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
