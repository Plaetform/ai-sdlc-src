# AE Web Brand Guidelines

Use this reference when creating, reviewing, or adjusting AE-branded web interfaces.

## Core Palette

| Token | Hex | RGB | Use |
| --- | --- | --- | --- |
| `--ae-black` | `#000000` | `0, 0, 0` | Text, strong backgrounds, high-contrast UI |
| `--ae-white` | `#ffffff` | `255, 255, 255` | Main surfaces, reverse text |
| `--ae-orange` | `#ff8c00` | `255, 140, 0` | Primary brand accent, gradient start, CTA accents |
| `--ae-red` | `#ff4b28` | `255, 75, 40` | Primary brand accent, gradient end, energetic details |
| `--ae-gradient` | `linear-gradient(135deg, #ff8c00 0%, #ff4b28 100%)` | n/a | Brand energy, highlights, campaign surfaces |

## Supporting Palette

| Token | Hex | RGB | Use |
| --- | --- | --- | --- |
| `--ae-grey-1` | `#faf7f7` | `250, 247, 247` | Warm neutral page backgrounds |
| `--ae-grey-2` | `#e8e3e1` | `232, 227, 225` | Borders, subtle panels |
| `--ae-grey-3` | `#beb9b4` | `190, 185, 180` | Disabled states, dividers |
| `--ae-grey-4` | `#969391` | `150, 147, 145` | Secondary text when contrast permits |
| `--ae-grey-5` | `#7a7674` | `122, 118, 116` | Secondary text and icons |
| `--ae-grey-6` | `#484644` | `72, 70, 68` | Body text alternative, dark surfaces |
| `--ae-yellow` | `#ffbf09` | `255, 191, 9` | Infographic or creative accent |
| `--ae-pink` | `#d20046` | `210, 0, 70` | Infographic or creative accent |
| `--ae-dark-red` | `#71012e` | `113, 1, 46` | Deep accent, charts, contrast support |

Keep black, white, orange, and red as the primary brand signal. Use supporting colours for function, hierarchy, and data clarity.

## Typography

AE's brand typeface is Nexa: Light, Regular, Bold, Heavy, and Black. Use Nexa for web typography when the project has the font files or a licensed delivery route.

Recommended CSS stack:

```css
font-family: "Nexa", "Century Gothic", "Avenir Next", "Montserrat", Arial, sans-serif;
```

Use Century Gothic for Microsoft Office contexts. On the web, it is an acceptable fallback, not a full replacement for Nexa when Nexa is available.

Typography behaviour:

- Use larger headlines for impact.
- Use lighter, smaller body text for legibility.
- Emphasise subheadings or key phrases with bold weight or AE orange/red.
- Keep line spacing generous.
- Prefer left alignment.
- Avoid cramped all-caps blocks except short labels or eyebrow text.

## Logo Usage

Bundled SVGs:

| Asset | Use |
| --- | --- |
| `assets/logos/ae-logo-pos-rgb.svg` | Main AE logo for white or black backgrounds |
| `assets/logos/ae-logo-neg-rgb.svg` | Main AE logo for orange or red backgrounds |
| `assets/logos/ae-logo-partner-pos.rgb.svg` | External communications on white or black backgrounds |
| `assets/logos/ae-logo-partner-neg-rgb.svg` | External communications on orange or red backgrounds |
| `assets/logos/ae-logo-partner-pos-blackback-rgb kopie.svg` | Partner logo variant for black background usage |

Rules:

- Preserve the SVG as supplied. Do not recolour, rotate, distort, outline, crop, or rebuild it.
- Maintain clear space of at least half the logo height on all sides.
- Keep the logo at least 40 px wide in web UI.
- Use the partner tagline logo for external communications such as newsletters, public event pages, campaign pages, and on-site event materials.
- Do not use the partner tagline logo on goodies.
- Do not place the logo on busy imagery or low-contrast backgrounds.

## Layout And Visual Language

AE layouts should feel clean, modern, geometric, personal, and professional.

Use:

- White or warm grey surfaces with black text.
- Orange/red accents for energy and attention.
- The orange-to-red gradient for highlights, campaign emphasis, or dynamic brand moments.
- Logo-derived graphic shapes as subtle layout aids.
- Numbered steps or arrows for sequences and timelines.
- Subtle patterns only when readability remains the priority.

Avoid:

- Generic SaaS blue/purple palettes.
- Heavy decorative cards that drown the brand.
- Recolouring third-party UI kits instead of mapping them to AE tokens.
- Decorative graphic elements that compete with content.
- Dense centred text blocks on content-heavy pages.

## Photography And Imagery

Use images that highlight AE people, vibrant workspaces, and genuine interactions. Prefer bright, soft lighting, a warm tone, and clear compositions. Include AE colours, signage, awards, or workspace details subtly when available.

Always prefer AE-owned photography over stock images. Check copyright before using imagery from the internet. If uncertain, use available AE marketing material.

## Icons

AE has two icon categories:

- Layout icons: may be created or adapted for layout purposes, and may use AE brand colours if they remain clear.
- Website icons: custom-made for ae.be and should not be altered.

For web work, search the target project or ae.be asset set for existing website icons before creating replacements.

## Copy Voice For Web UI

Use British English. AE's voice is professional, insightful, and collaborative. The tone should be authoritative and informative without becoming too technical or wordy.

Prefer:

- Clear action-oriented language.
- Specific claims backed by data or source material.
- Client-centred, empathetic phrasing.
- Natural SEO phrasing, not keyword stuffing.

Avoid:

- Unexplained acronyms and jargon.
- Cliches, generalities, repetition, and digressions.
- Unsupported marketing claims.
- AI-generated copy as the main source without human/source grounding.

Messaging pillars to reinforce when relevant:

- Small enough to care, big enough to deliver.
- A blend of IT and business.
- A true end-to-end partner.
- Broad offering with in-depth expertise.
- A strong belief in people.

## Web QA Checklist

Before finishing:

- Confirm colours use AE tokens or approved hex values.
- Confirm logo variant, size, and clear space.
- Confirm typography stack and hierarchy feel close to Nexa/Century Gothic geometry.
- Confirm CTAs and highlights use orange, red, gradient, black, or white intentionally.
- Confirm imagery is AE-relevant, warm, bright, and not generic stock when AE material is available.
- Confirm icons are existing AE website icons or intentionally compatible layout icons.
- Confirm responsive views do not crop logos, overlap text, or bury the brand signal.
- Run `npx tsx scripts/audit-web-brand.ts <path>` and explain any accepted warnings.
