# PAMI

Predictive & Autonomous Mapping Intelligence (PAMI)

This repository contains the **public-facing UI and enrolment surface** for PAMI.

## Scope
- Investor-facing demonstration
- Deterministic build
- Static UI routes
- No production logic

## Routes
- `/pami/enrol` – enrolment and positioning surface

## Build Rules
1. `package.json` must exist at repo root
2. `app/layout.tsx` is mandatory
3. Run in order:
   ```bash
   npm install
   npm run build
   npm start

Save and close.

---

### 4. **Final verification (do not skip)**

```powershell
npm run build
npm start
