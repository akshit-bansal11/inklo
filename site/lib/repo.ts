import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * The one fact the site reads from the app itself at build time rather than typing it
 * again: the version in the repository's package.json. A copy typed into a page is one
 * more place to forget when the version changes.
 *
 * The path resolves from the working directory, which is site/ for every npm script, so
 * the site must be built from inside the repository. If the version cannot be read the
 * build fails, rather than shipping a page with none.
 */
const ROOT = path.resolve(process.cwd(), "..");

function fail(what: string): never {
  throw new Error(
    `Could not read ${what}. The site is built from the app's own files; update lib/repo.ts if their shape changed.`,
  );
}

export function loadVersion(): string {
  const manifest: unknown = JSON.parse(
    readFileSync(path.join(ROOT, "package.json"), "utf8"),
  );
  if (
    typeof manifest === "object" &&
    manifest !== null &&
    "version" in manifest &&
    typeof manifest.version === "string"
  ) {
    return manifest.version;
  }
  return fail("the version in package.json");
}
