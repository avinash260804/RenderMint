import { spawnSync } from "node:child_process";

let pass = 0;
let fail = 0;
const results = [];

function run(command, { expectEmpty = false } = {}) {
  const result = spawnSync(command, {
    shell: true,
    encoding: "utf8",
    stdio: expectEmpty ? "pipe" : "inherit",
  });

  if (expectEmpty) {
    const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
    return { ok: output.length === 0, output };
  }

  return { ok: result.status === 0, output: "" };
}

function record(id, label, command, options = {}) {
  console.log("");
  console.log(`> ${id} - ${label}`);

  const result = run(command, options);
  if (result.ok) {
    console.log("  PASS");
    pass += 1;
    results.push(`PASS ${id} ${label}`);
    return;
  }

  console.log("  FAIL");
  if (result.output) {
    console.log(result.output.split(/\r?\n/).slice(0, 20).join("\n"));
  }
  fail += 1;
  results.push(`FAIL ${id} ${label}`);
}

record("SA-01", "TypeScript zero errors", "npx tsc --noEmit");
record("SA-02", "ESLint zero warnings or errors", "npm run lint -- --max-warnings 0");
record(
  "SA-03",
  "No community-data imports in src/",
  "rg \"community-data\" src/ --glob \"*.ts\" --glob \"*.tsx\"",
  { expectEmpty: true },
);
record(
  "SA-04",
  "No globalThis or new Map stores in modules/api",
  "rg \"globalThis|new Map<\" src/modules/ src/app/api/",
  { expectEmpty: true },
);
record(
  "SA-05",
  "No hardcoded disciplines/softwares arrays outside DB layer",
  "rg \"disciplines\\s*=\\s*\\[|softwares\\s*=\\s*\\[\" src/app/ src/modules/ src/components/",
  { expectEmpty: true },
);
record(
  "SA-06",
  "No console.log in API routes or services",
  "rg \"console\\.log\" src/app/api/ src/modules/",
  { expectEmpty: true },
);
record(
  "SA-07",
  "No bare : any types in modules/api",
  "rg \": any\" src/modules/ src/app/api/ --glob \"*.ts\" --glob \"*.tsx\"",
  { expectEmpty: true },
);
record(
  "SA-08",
  "No API routes with dynamic auto",
  "rg \"dynamic\\s*=\\s*['\\\"]auto['\\\"]\" src/app/api/ --glob \"*.ts\"",
  { expectEmpty: true },
);

console.log("");
console.log(`STATIC ANALYSIS RESULTS - ${pass} passed, ${fail} failed`);
for (const result of results) {
  console.log(`  ${result}`);
}

if (fail > 0) {
  process.exit(1);
}
