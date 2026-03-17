import { accessSync, constants } from "node:fs";
import { spawnSync } from "node:child_process";

function canWriteGitConfig() {
  try {
    accessSync(new URL("../.git/config", import.meta.url), constants.R_OK | constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

if (!canWriteGitConfig()) {
  console.log("husky skipped (cannot write .git/config in this environment)");
  process.exit(0);
}

const result = spawnSync("husky", { stdio: "inherit" });
process.exit(result.status ?? 0);
