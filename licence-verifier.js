/**
 * TriggerGuard Licence Verifier (v1)
 *
 * Wynergy Fibre Solutions Ltd
 * Company No: 16082183
 *
 * Verifies integrity, validity, and expiry of licences.
 */

const crypto = require("crypto");

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function verifyIntegrity(licence) {
  if (!licence.integrity || !licence.integrity.hash) {
    return { ok: false, reason: "MISSING_INTEGRITY" };
  }

  const { integrity, ...unsignedLicence } = licence;
  const recalculated = sha256(JSON.stringify(unsignedLicence));

  if (recalculated !== integrity.hash) {
    return { ok: false, reason: "INTEGRITY_MISMATCH" };
  }

  return { ok: true };
}

function verifyStatus(licence) {
  if (licence.status !== "ACTIVE") {
    return { ok: false, reason: "LICENCE_NOT_ACTIVE" };
  }
  return { ok: true };
}

function verifyExpiry(licence) {
  const now = new Date().toISOString();

  if (!licence.expiresAt) {
    return { ok: false, reason: "NO_EXPIRY_DEFINED" };
  }

  if (now > licence.expiresAt) {
    return { ok: false, reason: "LICENCE_EXPIRED" };
  }

  return { ok: true };
}

function verifyLicence(licence) {
  const integrity = verifyIntegrity(licence);
  if (!integrity.ok) return integrity;

  const status = verifyStatus(licence);
  if (!status.ok) return status;

  const expiry = verifyExpiry(licence);
  if (!expiry.ok) return expiry;

  return {
    ok: true,
    licenceId: licence.licenceId,
    tier: licence.tier,
    expiresAt: licence.expiresAt
  };
}

/* CLI test usage */
if (require.main === module) {
  try {
    const licence = require("./licences.json").slice(-1)[0];
    const result = verifyLicence(licence);
    console.log("Verification result:");
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Verification failed:", err.message);
  }
}

module.exports = {
  verifyLicence
};
