import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

let pass = 0;
let fail = 0;
const results = [];
const commandEnv = loadTestEnv();

function run(command) {
  return spawnSync(command, {
    shell: true,
    encoding: "utf8",
    stdio: "pipe",
    env: commandEnv,
  });
}

function loadTestEnv() {
  const env = { ...process.env, NODE_ENV: process.env.NODE_ENV ?? "test" };
  if (!existsSync(".env.test")) {
    return env;
  }

  const lines = readFileSync(".env.test", "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed
      .slice(index + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");

    if (key && !(key in env)) {
      env[key] = value;
    }
  }

  env.DIRECT_URL ??= env.TEST_DATABASE_URL ?? env.DATABASE_URL;
  return env;
}

function record(id, label, ok, detail = "") {
  console.log("");
  console.log(`> ${id} - ${label}`);

  if (ok) {
    console.log("  PASS");
    pass += 1;
    results.push(`PASS ${id} ${label}`);
    return;
  }

  console.log(`  FAIL${detail ? ` - ${detail}` : ""}`);
  fail += 1;
  results.push(`FAIL ${id} ${label}${detail ? ` - ${detail}` : ""}`);
}

function schemaText() {
  return readFileSync("prisma/schema.prisma", "utf8");
}

const validate = run("npx prisma validate");
record(
  "SCH-01",
  "Prisma schema is valid",
  validate.status === 0,
  validate.stderr.trim() || validate.stdout.trim(),
);

const generate = run("npx prisma generate");
record(
  "SCH-02",
  "Prisma client in sync with schema",
  generate.status === 0 && !`${generate.stdout}${generate.stderr}`.includes("Schema has changed"),
  generate.stderr.trim() || generate.stdout.trim(),
);

const migrateStatus = run("npx prisma migrate status");
record(
  "SCH-03",
  "No pending unapplied migrations",
  migrateStatus.status === 0 && /up to date|no pending/i.test(`${migrateStatus.stdout}${migrateStatus.stderr}`),
  migrateStatus.stderr.trim() || migrateStatus.stdout.trim(),
);

const schema = schemaText();
record("SCH-04", "Post model has deletedAt field", /model\s+Post[\s\S]*deletedAt\s+DateTime\?/.test(schema));
record(
  "SCH-05",
  "Comment model has deletedAt field",
  /model\s+Comment[\s\S]*deletedAt\s+DateTime\?/.test(schema),
);

let deletedAtIndexCount = 0;
const migrationDir = "prisma/migrations";
if (existsSync(migrationDir)) {
  for (const dir of readdirSync(migrationDir, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const migrationPath = join(migrationDir, dir.name, "migration.sql");
    if (!existsSync(migrationPath)) continue;
    const migration = readFileSync(migrationPath, "utf8");
    const matches = migration.match(/CREATE INDEX[\s\S]*?deleted_at/gi);
    deletedAtIndexCount += matches?.length ?? 0;
  }
}
record(
  "SCH-06",
  "Post and Comment have indexes on deletedAt",
  deletedAtIndexCount >= 2,
  `found ${deletedAtIndexCount}, need >= 2`,
);

record(
  "SCH-07",
  "Vote table has unique constraint authorId, postId",
  /@@unique\(\[authorId,\s*postId\](?:,\s*map:\s*"[^"]+")?\)/.test(schema),
);
record(
  "SCH-08",
  "Vote table has unique constraint authorId, commentId",
  /@@unique\(\[authorId,\s*commentId\](?:,\s*map:\s*"[^"]+")?\)/.test(schema),
);

const supabaseVersion = run("npx supabase --version");
if (supabaseVersion.status === 0) {
  const tap = run("npx supabase test db --local");
  const tapOk = tap.status === 0;
  const tapDetail = tap.stderr.trim() || tap.stdout.trim();
  record("SCH-09", "pgTAP posts table assertions", tapOk, tapDetail);
  record("SCH-10", "pgTAP votes constraints assertions", tapOk, tapDetail);
} else {
  record("SCH-09", "pgTAP posts table assertions", false, "Supabase CLI unavailable");
  record("SCH-10", "pgTAP votes constraints assertions", false, "Supabase CLI unavailable");
}

console.log("");
console.log(`SCHEMA RESULTS - ${pass} passed, ${fail} failed`);
for (const result of results) {
  console.log(`  ${result}`);
}

if (fail > 0) {
  process.exit(1);
}
