import { execSync } from "node:child_process";
import crypto from "node:crypto";

function run(cmd) {
  return execSync(cmd, { encoding: "utf8" });
}

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

const invalidOut = run("node evidence/run-invalid.js");
const validOut = run("node evidence/run-valid.js");

const bundle = {
  runtime: {
    node: process.version,
    platform: process.platform,
    arch: process.arch
  },
  outputs: {
    invalid: JSON.parse(invalidOut),
    valid: JSON.parse(validOut)
  }
};

const json = JSON.stringify(bundle, null, 2);
const hash = sha256(json);

console.log(json);
console.log("\nSHA256:");
console.log(hash);
