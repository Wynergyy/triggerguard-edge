# TriggerGuard Sentinel (Edge)

## Purpose
TriggerGuard Sentinel is the runtime observation and normalisation layer for edge and hosted environments.

It captures execution context and platform constraints and emits structured, deterministic observations.
It never decides. It never classifies faults.

---

## Determinism Guarantee
- Sentinel observes only.
- No heuristics.
- No policy logic.
- Same runtime conditions produce the same observation output.

---

## Canonical Fault Model
Sentinel does not emit faults.
All downstream fault classification conforms to the WFSL Canonical Fault Model.

Reference:
https://github.com/Wynergy-Fibre-Solutions/wfsl-core/blob/main/docs/faults.md

---

## Evidence Standard
All Sentinel outputs are:
- Deterministic
- Reproducible
- Attributable
- Suitable for cryptographic sealing downstream

---

## Verification
This repository includes evidence scripts to demonstrate:
- Stable observation output
- Environment normalisation
- Sealed execution proof



---

Run:

## Expansion Policy
Sentinel expands only to support new runtimes.
No decision logic is introduced here.

