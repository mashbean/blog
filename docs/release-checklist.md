# Release Checklist

Use this checklist before merging large updates to `main`.

## 1. Scope and Decision

- [ ] All planned tasks for this release are listed
- [ ] Related ADR(s) are linked (if architecture/vendor decisions were made)
- [ ] Rollback strategy is defined

## 2. Local Validation

- [ ] `npm ci`
- [ ] `npm run lint`
- [ ] `npm run sign:posts:check`
- [ ] `npm run check:covers`
- [ ] `npm run build`
- [ ] `npm run preview` and quick manual check completed

## 3. Smoke Test (Core Paths)

- [ ] Home page loads
- [ ] Blog post page loads
- [ ] Tag/archive page loads
- [ ] RSS endpoint works
- [ ] New feature path (for this release) works

## 4. PR Gate

- [ ] Commit messages are clear and scoped
- [ ] PR description includes summary, risk, rollback, and test evidence
- [ ] CI is green
- [ ] Review comments are resolved

## 5. Deploy Checks

- [ ] Merge to `main` completed
- [ ] GitHub Pages deploy workflow succeeds
- [ ] If content changed, IPFS/IPNS workflow succeeds
- [ ] Production URL and critical routes are reachable

## 6. Post-Release (24-48h)

- [ ] Error monitoring shows no critical issues
- [ ] User-facing metrics are stable
- [ ] Any incident or follow-up tasks are recorded

