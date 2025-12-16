/**
 * TriggerGuard Runtime Licence Hook
 *
 * Enforces licence validity before any request handling occurs.
 *
 * Wynergy Fibre Solutions Ltd
 * Company No: 16082183
 * Registered office: 5 Brayford Square, London, E1 0SG
 */

const fs = require("fs");
const path = require("path");
const { verifyLicence } = require("./licence-verifier");

const LICENCE_PATH = path.join(__dirname, "licences.json");

function loadLicence() {
  if (!fs.existsSync(LICENCE_PATH)) {
    return {
      ok: false,
      reason: "LICENCE_FILE_MISSING"
    };
  }

  try {
    const licences = JSON.parse(fs.readFileSync(LICENCE_PATH, "utf8"));

    if (!Array.isArray(licences) || licences.length === 0) {
      return {
        ok: false,
        reason: "NO_LICENCES_PRESENT"
      };
    }

    // Always evaluate the most recent licence
    const licence = licences[licences.length - 1];
    return verifyLicence(licence);
  } catch (err) {
    return {
      ok: false,
      reason: "LICENCE_PARSE_ERROR",
      detail: err.message
    };
  }
}

function enforceLicenceOrExit() {
  const result = loadLicence();

  if (!result.ok) {
    console.error("TriggerGuard licence enforcement failed");
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log("TriggerGuard licence verified");
  console.log(`Licence ID: ${result.licenceId}`);
  console.log(`Tier: ${result.tier}`);
  console.log(`Valid until: ${result.expiresAt}`);
}

module.exports = {
  enforceLicenceOrExit
};

/* CLI execution */
if (require.main === module) {
  enforceLicenceOrExit();
}
