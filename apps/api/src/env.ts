import dotenv from "dotenv";
import { existsSync } from "node:fs";
import path from "node:path";

export function loadEnv(): void {
  if (process.env.UBEER_ENV_FILE) {
    dotenv.config({ path: process.env.UBEER_ENV_FILE });
    return;
  }
  const localFile = path.resolve(process.cwd(), ".env");
  const workspaceRootFile = path.resolve(process.cwd(), "../../.env");
  dotenv.config({ path: existsSync(localFile) ? localFile : workspaceRootFile });
}
