#!/usr/bin/env node
import { Command } from "commander";
import { registerAccountCommands } from "./commands/accounts.js";
import { registerCampaignCommands } from "./commands/campaigns.js";
import { registerAdgroupCommands } from "./commands/adgroups.js";
import { registerAdCommands } from "./commands/ads.js";
import { registerKeywordCommands } from "./commands/keywords.js";
import { registerAudienceCommands } from "./commands/audiences.js";
import { registerBudgetCommands } from "./commands/budgets.js";
import { registerReportCommands } from "./commands/report.js";

const program = new Command();

program
  .name("microsoft-ads-cli")
  .description("Microsoft Advertising CLI for AI agents")
  .version("0.1.0")
  .option("--format <format>", "Output format", "json")
  .option("--credentials <path>", "Path to credentials JSON file")
  .addHelpText(
    "after",
    "\nDocs: https://github.com/Bin-Huang/microsoft-ads-cli"
  );

program.configureOutput({
  writeErr: () => {},
});

program.hook("preAction", () => {
  const format = program.opts().format;
  if (format !== "json" && format !== "compact") {
    process.stderr.write(
      JSON.stringify({ error: "Format must be 'json' or 'compact'." }) + "\n"
    );
    process.exit(1);
  }
});

registerAccountCommands(program);
registerCampaignCommands(program);
registerAdgroupCommands(program);
registerAdCommands(program);
registerKeywordCommands(program);
registerAudienceCommands(program);
registerBudgetCommands(program);
registerReportCommands(program);

if (process.argv.length <= 2) {
  program.outputHelp();
  process.exit(0);
}

program.parse();
