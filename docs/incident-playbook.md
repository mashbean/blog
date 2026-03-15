# Incident Playbook

Purpose: provide a fast and repeatable way to respond when production issues happen.

## Severity Levels

- P1: Core reading path unavailable (home/post major route down)
- P2: Major feature degraded but partial workaround exists
- P3: Minor defect with limited impact

## Response Workflow

## 1. Detect and Triage

- [ ] Capture timestamp and symptom
- [ ] Identify impacted routes/features
- [ ] Assign severity (P1/P2/P3)
- [ ] Freeze non-critical merges until stabilized

## 2. Contain

- [ ] If needed, rollback to last known good commit/PR
- [ ] Confirm critical routes recover
- [ ] Record what was rolled back and why

## 3. Communicate

- [ ] Write a short status update: impact, scope, current action
- [ ] Update again when mitigation is complete

## 4. Fix Forward

- [ ] Create `hotfix/*` branch
- [ ] Add targeted fix
- [ ] Run validation:
  - [ ] `npm run lint`
  - [ ] `npm run build`
  - [ ] Core smoke paths verified
- [ ] Open PR and merge after checks pass

## 5. Verify Recovery

- [ ] Confirm production routes are healthy
- [ ] Confirm deploy workflows are green
- [ ] Confirm no repeated errors for monitoring window

## 6. Postmortem (within 24h)

- [ ] Root cause
- [ ] Trigger and detection gap
- [ ] Why protection failed (or was missing)
- [ ] Permanent fixes (test/check/process)
- [ ] Owner and due date for each follow-up action

## Quick Commands Reference

Use project-specific commands as needed:

- `npm run lint`
- `npm run build`
- `npm run preview`
- `npm run sign:posts:check`
- `npm run check:covers`

