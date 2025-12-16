/**
 * TriggerGuard Licence Renewal Check
 *
 * Authoritative renewal policy evaluator.
 * Deterministic. No side effects.
 */

import fs from "fs";
import path from "path";

const LICENCE_FILE = path.join(process.cwd(), "licences.json");

const RENEWAL_WINDOW_DAYS = 14;
const SENTINEL_GRACE_DAYS = 7;

function daysBetween(a, b) {
  const ms = 24 * 60 * 60 * 1000;
  return Math.floor((b - a) / ms);
}

export function evaluateLicence(licence) {
  const now = new Date();
  const expiresAt = new Date(licence.expiresAt);

  const daysRemaining = daysBetween(now, expiresAt);

  if (daysRemaining < 0) {
    if (licence.tier === "SENTINEL_PLUS") {
      if (Math.abs(daysRemaining) <= SENTINEL_GRACE_DAYS) {
        return {
          status: "GRACE",
          action: "RENEW_IMMEDIATELY",
          daysOverdue: Math.abs(daysRemaining),
        };
      }
    }

    return {
      status: "EXPIRED",
      action: "BLOCK_RUNTIME",
      daysOverdue: Math.abs(daysRemaining),
    };
  }

  if (daysRemaining <= RENEWAL_WINDOW_DAYS) {
    return {
      status: "RENEWAL_WINDOW",
      action: "SEND_RENEWAL_NOTICE",
      daysRemaining,
    };
  }

  return {
    status: "ACTIVE",
    action: "NONE",
    daysRemaining,
  };
}

export function checkAllLicences() {
  if (!fs.existsSync(LICENCE_FILE)) {
    throw new Error("licences.json not found");
  }

  const licences = JSON.parse(fs.readFileSync(LICENCE_FILE, "utf8"));

  return licences.map((licence) => ({
    licenceId: licence.licenceId,
    customerEmail: licence.customerEmail,
    tier: licence.tier,
    evaluation: evaluateLicence(licence),
  }));
}

/**
 * CLI usage:
 * node renewal-check.js
 */
if (process.argv[1].includes("renewal-check.js")) {
  const report = checkAllLicences();
  console.log(JSON.stringify(report, null, 2));
}
