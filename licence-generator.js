/**
 * TriggerGuard Licence Generator (v1)
 *
 * Wynergy Fibre Solutions Ltd
 * Company No: 16082183
 *
 * Generates deterministic, time-limited licences
 * for TriggerGuard products.
 */

const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const REGISTRY_PATH = path.join(__dirname, "licences.json");

function nowISO() {
  return new Date().toISOString();
}

function addDays(date, days) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

function randomToken(bytes = 4) {
  return crypto.randomBytes(bytes).toString("hex").toUpperCase();
}

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function loadRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
}

function saveRegistry(registry) {
  fs.writeFileSync(
    REGISTRY_PATH,
    JSON.stringify(registry, null, 2),
    "utf8"
  );
}

function generateLicence({
  organisation,
  contactEmail,
  paymentReference
}) {
  const issuedAt = nowISO();
  const expiresAt = addDays(issuedAt, 90);

  const licenceId = `LIC-TG-PILOT-2025-${randomToken(4)}`;

  const licence = {
    licenceId,
    product: "TriggerGuard",
    tier: "PILOT",
    issuedAt,
    expiresAt,
    status: "ACTIVE",
    issuedTo: {
      organisation,
      contactEmail
    },
    payment: {
      provider: "TIDE",
      reference: paymentReference
    }
  };

  const integrityPayload = JSON.stringify(licence);
  const integrityHash = sha256(integrityPayload);

  const sealedLicence = {
    ...licence,
    integrity: {
      hash: integrityHash,
      algorithm: "SHA-256"
    }
  };

  const registry = loadRegistry();
  registry.push(sealedLicence);
  saveRegistry(registry);

  return sealedLicence;
}

/* CLI usage */
if (require.main === module) {
  const [, , org, email, paymentRef] = process.argv;

  if (!org || !email || !paymentRef) {
    console.error(
      "Usage: node licence-generator.js <organisation> <email> <paymentRef>"
    );
    process.exit(1);
  }

  const licence = generateLicence({
    organisation: org,
    contactEmail: email,
    paymentReference: paymentRef
  });

  console.log("Licence issued:");
  console.log(JSON.stringify(licence, null, 2));
}

module.exports = {
  generateLicence
};
