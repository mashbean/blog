# Mashbean Blog UI Style Guide (v1.0)

## 1. Purpose
This guide defines the visual language and interaction rules for Mashbean Blog.
Goal: keep the reading experience calm, consistent, and scalable while preserving the blog's humanistic technology identity.

## 2. Brand Direction
- Positioning: long-form editorial blog on public internet, governance, culture-tech, and web3.
- Tone: thoughtful, restrained, trustworthy, and readable.
- Visual personality: paper-like, warm background, low saturation, clear hierarchy.

## 3. Design Principles
- Content first: reading flow always wins over decoration.
- Low cognitive load: one main task per section.
- Consistency over novelty: repeated patterns should look and behave the same.
- Progressive enhancement: no JS should still provide complete core reading/navigation.
- Accessibility by default: keyboard focus, color contrast, and readable spacing are non-negotiable.

## 4. Foundations

### 4.1 Color Tokens
Use the existing palette as source of truth.

- `--color-paper`: page background
- `--color-ink`: main text
- `--color-muted`: secondary text
- `--color-accent`: primary action / active state
- `--color-accent-soft`: soft accent surface

Add and maintain these semantic aliases:
- `--color-border-subtle`: low-contrast borders
- `--color-surface-elevated`: card surfaces
- `--color-focus-ring`: keyboard focus outlines
- `--color-success`: positive feedback states
- `--color-warning`: caution highlight (search match, etc.)

Usage rules:
- Main text on paper must remain high contrast.
- Accent color appears only in actions/active states, not large decorative blocks.
- Avoid introducing additional brand colors unless there's a functional reason.

### 4.2 Typography
- Serif: editorial headings and key identity moments.
- Sans: body, metadata, controls.
- Monospace: code and data strings.

Recommended scale:
- H1: 1.9rem - 2.2rem
- H2: 1.35rem - 1.55rem
- H3: 1.1rem - 1.25rem
- Body: 1rem
- Meta: 0.82rem - 0.92rem

Line-height:
- Body: 1.78 - 1.9
- Meta/UI text: 1.45 - 1.6

Measure:
- Reading body: target 62ch - 74ch.

### 4.3 Spacing System
Use an 8px rhythm:
- 8, 12, 16, 24, 32, 48

Rules:
- Component inner padding: >= 16px
- Section gap: >= 24px
- Dense chips/metadata: 8 - 12px spacing

### 4.4 Radius, Border, Shadow
- Radius: use consistent tiers (`0.6rem`, `0.85rem`, `1rem`, `999px`).
- Border first, shadow second.
- Avoid heavy shadows in reading surfaces.

## 5. Component Guidelines

### 5.1 Header & Nav
- Keep nav actions concise and equal-weight, except one highlighted CTA.
- Mobile header must never create horizontal scroll.
- Divider placement should be semantically meaningful (utility vs social actions).

### 5.2 Buttons
- Primary: one per context.
- Secondary: neutral border + subtle background.
- Feedback states should be brief and explicit (e.g. "已複製").

### 5.3 Cards
- All cards should share border/radius/surface rules.
- Thumbnail cards: title and meta must align with list cards.
- Avoid mixing multiple card visual styles on same page.

### 5.4 Tag Chips
- Topic chips: stronger visual emphasis.
- Keyword chips: secondary tone.
- System/import tags are never shown as reader-facing chips.

### 5.5 Accordion (Years/Tags)
- Summary row: icon + title + count + optional note.
- Notes should be visible at summary level if critical context is needed.
- Expand/collapse motion: 150-240ms; support reduced motion.

### 5.6 Reading Tools
- Focus reading controls appear only in focus mode.
- Focus mode hides discovery/utility noise (related posts, archive nav, etc.).

### 5.7 Search Results
- Keep card padding generous and consistent.
- Define explicit states: empty, no result, loaded, error.
- Highlight color should not compromise readability.

## 6. Page-Level Patterns

### 6.1 Home
- Hero sets editorial tone, not a marketing pitch.
- Latest posts should be immediately scannable.

### 6.2 Blog Archive
- Year is the primary axis.
- Year narrative note is visible before expansion.
- Keep archive entries compact but breathable.

### 6.3 Tags
- Topics are primary navigation.
- Keywords support discovery, but do not dominate layout.

### 6.4 Article
- Enter in focused reading mode by default.
- Keep title/meta/tags readable and compact.
- Sidebar tools should never overpower article body.

### 6.5 Experimental Views (e.g. 3D graph)
- Keep experiments opt-in and clearly labeled MVP.
- Always provide path back to canonical list pages.

## 7. Motion & Interaction
- Motion should clarify state changes, not decorate.
- Default transition duration: 150-240ms.
- Respect `prefers-reduced-motion` in all animated components.

## 8. Accessibility Requirements
- Keyboard focus visible on all actionable controls.
- Color contrast meets WCAG AA for body text.
- Pointer targets >= 40px on mobile controls.
- No critical meaning conveyed by color alone.

## 9. SEO & Machine-Readable UX
- Keep metadata consistent with visual hierarchy and page purpose.
- Maintain and validate:
  - `sitemap-index.xml`
  - `rss.xml`
  - `llms.txt`
  - `content-index.json`
- Ensure visible titles and feed/search titles are normalized and user-friendly.

## 10. Content Taxonomy Rules
- Primary taxonomy: 6 topics.
- Secondary taxonomy: keywords.
- System tags (e.g. import/source) are never shown in UI taxonomy.
- Use aliases to normalize concept variants (AI/人工智慧, web3/NFT, etc.).

## 11. QA Checklist (Visual)
Before each release, verify:
- No horizontal layout shift when opening accordion.
- Mobile nav has no overflow and no clipped actions.
- Focus mode hides non-reading UI correctly.
- Archive and tag pages maintain consistent line wrapping.
- Search results spacing and left padding remain stable.
- OG preview title/description/image are correct.

## 12. Roadmap: Next UI Improvements

### Phase A (High Priority, 1-2 weeks)
1. Token consolidation
- Extract repeated color/border/radius values into semantic CSS tokens.

2. Component consistency pass
- Normalize all buttons/cards/chips/accordion spacing and states.

3. Search state design
- Build consistent empty/loading/error/result states.

### Phase B (Medium Priority, 2-4 weeks)
4. Article intro system
- Add optional lead paragraph style for long-form entry.

5. TOC usability polish
- Strengthen active section state and spacing hierarchy.

6. 3D graph MVP hardening
- Add explicit mobile fallback mode (2D/simple list).

### Phase C (Strategic)
7. Theme layer
- Optional high-contrast / night reading variant.

8. Design audit automation
- Add visual regression snapshots for key templates.

## 13. Governance
- Any new UI pattern must be documented in this guide.
- Avoid one-off styles without token/component rationale.
- Major UI changes should include before/after screenshots in PR.
