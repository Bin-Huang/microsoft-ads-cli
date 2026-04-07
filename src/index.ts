#!/usr/bin/env node
import { createRequire } from "node:module";
import { Command } from "commander";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };
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
  .description("Microsoft Advertising CLI & Skills for AI agents")
  .version(version)
  .option("--format <format>", "Output format", "json")
  .option("--credentials <path>", "Path to credentials JSON file")
  .addHelpText(
    "after",
    "\nDocs: https://github.com/Bin-Huang/microsoft-ads-cli"
  );

program.configureOutput({
  writeErr: (str: string) => {
    const msg = str.replace(/^error: /i, "").trim();
    if (msg) process.stderr.write(JSON.stringify({ error: msg }) + "\n");
  },
  writeOut: (str: string) => {
    process.stdout.write(str);
  },
});

program.showHelpAfterError(false);

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

program.on("command:*", (operands) => {
  process.stderr.write(
    JSON.stringify({ error: `Unknown command: ${operands[0]}. Run --help for available commands.` }) + "\n"
  );
  process.exit(1);
});
if (process.argv.length <= 2) {
  program.outputHelp();
  process.exit(0);
}

program.parse();
