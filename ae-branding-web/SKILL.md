---
name: ae-branding-web
description: Apply AE brand identity guidelines to web design and frontend implementation. Use when Codex is creating, reviewing, redesigning, or QAing AE-branded websites, web apps, landing pages, newsletters, social/web graphics, CSS design tokens, UI components, typography, logos, icons, imagery, or marketing copy so the UI follows AE brand guidelines.
---

# AE Branding Web

## Workflow

1. Inspect the target UI, framework, stylesheet conventions, available assets, and current rendered state when possible.
2. Load `references/web-brand-guidelines.md` before making brand decisions. Load `references/source/AE Brandbook March 2025.pdf` only when exact visual examples are needed.
3. Use the bundled assets in `assets/logos/` and `assets/social/`; do not redraw or recolour the AE logo.
4. Implement with explicit AE tokens. Prefer adapting the local design system over adding a separate one.
5. Run `npx tsx scripts/audit-web-brand.ts <project-or-file>` after editing frontend code, then perform visual QA in browser screenshots when a UI is runnable.

## Brand Rules

- Use AE's core palette as the dominant identity: black, white, orange, red, and the orange-to-red gradient.
- Use greys for functional surfaces and balance. Use bright supporting colours only for specific accents such as infographics or graphic details.
- Use Nexa for brand/web typography when available. If the project does not include Nexa, use a pragmatic stack that starts with `Nexa` and falls back to `Century Gothic`, `Avenir Next`, `Montserrat`, `Arial`, and sans-serif.
- Keep typography generous, clean, and preferably left-aligned. Use large headlines, lighter body text, and bold or colour accents for emphasis.
- Keep the logo clear space equal to at least half the logo height. Do not place text, controls, crop edges, or decorative elements inside that area.
- Keep the AE mark at least 40 px wide in web UI.
- Use the positive logo on white or black backgrounds. Use the negative logo on orange or red backgrounds. Use the partner tagline logo for external communications such as campaign pages, newsletters, event pages, and other public marketing surfaces.
- Never change logo colours, rotate the logo, distort it, change the partner tagline lock-up, or place it where readability is compromised.
- Prefer bright, warm photography of AE people and real workspaces over stock imagery.
- Use parts of the AE logo as graphic elements only when they support structure, balance, or visual interest. Keep them purposeful and subordinate to content.
- Website icons are custom and should not be altered. If the full collection is not present, check the existing web project or ae.be source before inventing a replacement style.
- Write UI and marketing copy in British English, with a professional, insightful, collaborative voice. Be authoritative and informative without becoming too technical or wordy.

## Implementation Guidance

- Start from `assets/ae-web-theme.css` when a project has no existing tokens. Otherwise map the values from `references/web-brand-guidelines.md` into the local token system.
- Use CSS variables for AE colours and typography instead of scattering raw hex values through components.
- Build UI screens as real working product surfaces. Avoid generic decorative gradients, oversized marketing cards, stock-like imagery, and one-note orange/red saturation.
- Preserve accessibility. Check contrast when placing white text on orange/red or orange/red text on light greys.
- Keep components quiet and purposeful for operational tools. For public marketing pages, use the logo, gradient, photography, and AE graphic elements more visibly.
- Treat brand compliance as both code and visual QA: token usage, asset choice, layout, contrast, copy tone, and screenshot review all matter.

## Bundled Resources

- `references/web-brand-guidelines.md`: detailed AE web guidance, colour values, logo usage, typography, imagery, copy voice, and review checklist.
- `references/source/AE Brandbook March 2025.pdf`: original brandbook source for visual examples and edge cases.
- `assets/ae-web-theme.css`: copyable CSS variables and base web styles.
- `assets/logos/`: approved SVG logo variants.
- `assets/social/`: AE LinkedIn banner references for visual tone.
- `scripts/audit-web-brand.ts`: run with `npx tsx` to scan frontend files for hardcoded non-AE hex colours.
