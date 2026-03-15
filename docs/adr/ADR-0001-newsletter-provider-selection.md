# ADR-0001: Newsletter Provider Selection

- Status: Proposed
- Date: 2026-02-27
- Owner: Blog Team
- Scope: Newsletter subscription for the blog

## Context

The blog is built with Astro and deployed to GitHub Pages. Most pages are static.
We want to add a newsletter subscribe experience without introducing high operational complexity.

## Decision Drivers

- Low setup and maintenance cost
- Fast time-to-launch
- Works with static deployment
- Good deliverability and unsubscribe handling
- Export portability of subscribers
- API/embed flexibility for future upgrades

## Options Considered

1. beehiiv
2. Kit
3. Buttondown
4. Fully custom email system

## Decision

Adopt a hosted newsletter provider first, starting with an embedded or API-based subscribe flow.
Initial preference: Buttondown or Kit for fast MVP integration.

## Rationale

- Hosted platforms remove the need to build unsubscribe, compliance, and sending infrastructure.
- Astro static deployment can integrate via embed form immediately.
- We can later move to API-first flow while preserving current UX.

## Consequences

### Positive

- Launch quickly with low risk
- Minimal changes to existing deployment
- Better operational reliability for email delivery

### Negative

- Vendor dependency
- Monthly cost as list grows
- Some product behavior is constrained by provider features

## Rollout Plan

1. Create `/newsletter` subscribe page with provider embed form
2. Add basic success/failure UX copy
3. Track conversion events in analytics
4. Re-evaluate provider fit after first milestone

## Exit Criteria and Revisit Trigger

Revisit this ADR when any of the following is true:

- Subscriber count or cost exceeds budget target
- Need advanced segmentation/automation not supported
- Need tighter ownership of data or sending workflow

