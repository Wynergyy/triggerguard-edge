/**
 * TriggerGuard Licence Issuer (v2)
 *
 * Issues time-limited licences after confirmed payment.
 *
 * Wynergy Fibre Solutions Ltd
 * Company No: 16082183
 * Registered office: 5 Brayford Square, London, E1 0SG
 */

const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const LICENCE_FILE = path.join(__dirname, "licences.json");

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function generateLicenceId() {
  return "TG-" + crypto.randomBytes(8).toString("hex").toUpperCase();
}

function parseTierFlag(argv) {
  const tierArg = argv.find(arg => arg.startsWith("--tier="));
  if (!tierArg) return "PILOT";
  return tierArg.split("=")[1].toUpperCase();
}

function issueLicence({
  customerEmail,
  paymentReference,
  tier,
  durationDays = 30
}) {
  const issuedAt = new Date();
  const expiresAt = new Date(
    issuedAt.getTime() + durationDays * 24 * 60 * 60 * 1000
  );

  const licence = {
    licenceId: generateLicenceId(),
    product: "TriggerGuard – Edge Request Control Licence",
    tier,
    status: "ACTIVE",
    customerEmail,
    paymentReference,
    issuedAt: issuedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    issuer: "Wynergy Fibre Solutions Ltd"
  };

  licence.integrity = {
    hash: sha256(JSON.stringify(licence))
  };

  let licences = [];
  if (fs.existsSync(LICENCE_FILE)) {
    licences = JSON.parse(fs.readFileSync(LICENCE_FILE, "utf8"));
  }

  licences.push(licence);
  fs.writeFileSync(LICENCE_FILE, JSON.stringify(licences, null, 2));

  return licence;
}

/* CLI usage */
if (require.main === module) {
  const [, , email, paymentRef, ...rest] = process.argv;

  if (!email || !paymentRef) {
    console.error("Usage:");
    console.error("node licence-issuer.js <email> <paymentRef> [--tier=SENTINEL_PLUS]");
    process.exit(1);
  }

  const tier = parseTierFlag(rest);

  const licence = issueLicence({
    customerEmail: email,
    paymentReference: paymentRef,
    tier
  });

  console.log("Licence issued successfully:");
  console.log(JSON.stringify(licence, null, 2));
}

module.exports = {
  issueLicence
};
