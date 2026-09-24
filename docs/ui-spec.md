# UI Specification

Layout, controls, states, and accessibility for the app. The structure follows the common two-pane pattern used by existing ASCII generators (controls on the left, output on the right). Visual styling, copy, and assets are original to this project.

## Contents

- [Layout](#layout)
- [Top-level switches](#top-level-switches)
- [Controls panel](#controls-panel)
- [Output pane](#output-pane)
- [Export panel](#export-panel)
- [States](#states)
- [Responsive behavior](#responsive-behavior)
- [Accessibility](#accessibility)
- [Theming](#theming)

## Layout

```text
┌────────────────────────────────────────────────────────────────────┐
│ Logo / name              About  Contact  Privacy  Terms   [theme]  │
├──────────────────────┬─────────────────────────────────────────────┤
│ CONTROLS   Reset all │ OUTPUT               −  100%  +   120×48    │
│ [ Image | Text Aa ]  │                                             │
│ [ ASCII | Braille ]  │                                             │
│ ───────────────────  │            (rendered art, scrollable        │
│ scrollable controls  │             and zoomable)                   │
│ ...                  │                                             │
│ EXPORT               │                                             │
│ [ Copy art ]         │                                             │
└──────────────────────┴─────────────────────────────────────────────┘
```

- Layout is centered horizontally with a maximum width of 1040px on wide screens
- Left pane: fixed width (360px), own scroll area. Header stays visible while controls scroll.
- Right pane: fills the remaining width within the constrained layout. Output scrolls in both directions when larger than the pane.
- Section labels use small uppercase monospace text. Numeric values appear in a small badge next to each slider label.
- Content area has horizontal padding matching the navigation bar's content inset for visual alignment.

## Top-level switches

Two segmented controls sit at the top of the controls panel.

| Switch | Options | Behavior |
|---|---|---|
| Input | **Image**, **Text Aa** | Changes which input controls appear |
| Output | **ASCII**, **Braille ⣿** | Changes which rendering controls appear |

**Difference from the reference layout:** the Output switch stays visible in Text mode, because text-to-Braille is a supported feature here. In Text mode an additional **Engine** selector (FIGlet / Raster) appears; Braille output requires the Raster engine, so choosing Braille selects it automatically.

Settings shared by both outputs (width, brightness, contrast, invert, dithering) keep their values when the user switches output mode.

## Controls panel

### Image input

- Drop zone with an upload icon, the text "Drop image or click to browse", and a hint listing accepted formats: PNG, JPG, GIF, WebP, **HEIC**.
- Paste support: pasting an image anywhere on the page loads it.
- **Paste URL** field with a **Load** button. On CORS failure, show an inline message (see [States](#states)).

### Rendering controls (Image input)

| Control | Type | Range / default | Shown for |
|---|---|---|---|
| Width | Slider + badge ("120 chars") | 20–300 / 120 | Both |
| Font size | Slider + badge ("8px") | 4–24 / 8 | Both (preview only) |
| Brightness | Slider + badge | −100–100 / 0 | Both |
| Contrast | Slider + badge ("1.00×") | 0.25–3 / 1 | Both |
| Gamma | Slider + badge | 0.5–2.5 / 1 | Both |
| *Reset brightness & contrast* | Button | | Both |
| Stretch X / Y | Slider + badge | 0.5–2 / 1 | Both |
| *Reset stretch* | Button | | Both |
| Threshold | Slider + **Auto** toggle + value | Auto / 128 | Braille; ASCII with dithering off |
| Dithering | Segmented or select: None, Atkinson, Floyd–Steinberg, Ordered, Blue noise, Custom | Floyd–Steinberg | Both |
| Dither strength | Slider | 0–1 / 1 | Error-diffusion methods |
| Serpentine scan | Checkbox | On | Error-diffusion methods |
| Bayer size | Segmented: 2, 4, 8 | 4 | Ordered |
| Character ramp | Preset select + custom text field + **Calibrate to font** toggle | Classic / off | ASCII |
| Edge detect | Toggle + threshold slider | Off / 40 | ASCII |
| Fill blank cells | Checkbox | Off | Braille |
| Color | Segmented: None, Source, Gradient | None | Both |
| Invert brightness | Checkbox | Off | Both |

A short helper line under **Dithering** describes the selected method (for example, "Hard threshold: sharp edges, no halftoning").
Under **Threshold**, when Auto is on: "Auto finds the best split for your image."

### Text input

| Control | Type | Notes |
|---|---|---|
| Text | Multi-line text area | Placeholder: "Type something" |
| Engine | Segmented: FIGlet, Raster | |
| Font (FIGlet) | Grouped select | Groups: Popular, 3D and Shadow, Bold and Block, Futuristic, Stylized, Isometric, Novelty, All |
| Font preview | Small strip under the select | Renders the selected font's name in that font |
| Layout (FIGlet) | Select | default, full, fitted, controlled smushing, universal smushing |
| Font family, weight, line height (Raster) | Select, slider, slider | Self-hosted fonts |
| Effects (Raster) | Outline width, shadow | Optional |
| Alignment | Segmented: left, center, right | |
| Wrap width | Slider | |
| Color gradient | Checkbox, then From / To color pickers and a Horizontal / Vertical toggle | |

The Braille and ASCII rendering controls from the table above also apply when the Raster engine is selected.

## Output pane

Header:

- Label **OUTPUT**.
- Zoom: **−**, current percentage (default 100%), **+**. Range 50–400%.
- Size readout in characters, for example `35×5 chars` (columns × rows).
- Zoom buttons and Choose image button show hover effects for improved interactivity.

Body:

- Monospace preformatted text for plain output. Canvas renderer for color or very large output.
- Text is selectable in the plain renderer.
- The container has `role="img"` and an `aria-label` (see [Accessibility](#accessibility)).

Empty state: an icon, the heading "No image yet.", the line "Upload an image from the panel to see it here.", and a **Choose image** button. In Text mode the pane renders as soon as text is entered.

## Export panel

Located at the bottom of the controls panel.

```text
EXPORT
[            Copy art             ]      primary button

PASTE AS TEXT
  (info card, shown in ASCII mode: "Braille mode stays aligned on
   most platforms. Switch to Braille →")
[ Discord ]  [ Twitch · YouTube ]

PASTE AS IMAGE
RESOLUTION                     [ 1× | 2× | 4× ]
[ Copy image ]  [ Download PNG ]

[          Download .txt          ]

(notes card)
Discord: monospace code block.
Twitch · YouTube: full-width Unicode characters.
Copy image: PNG, for Twitter, Instagram, and similar.
```

Behavior details:

- After a successful copy, the button label changes to "Copied" for about two seconds and a polite live region announces it.
- The Discord button shows the character count and turns to a warning style when the standard message limit is exceeded.
- If a clipboard call is blocked, show a short message and offer the download instead.
- In Braille mode, replace the info card with a note about the **Fill blank cells** option.

## States

| State | Presentation |
|---|---|
| Empty | Empty-state block in the output pane |
| Decoding | Inline progress text in the output pane. For the HEIC fallback: "Decoding HEIC…" |
| Rendering | Previous output stays visible with a subtle busy indicator; never blank the pane during slider drags |
| Error: unsupported | "This file type isn't supported. Try PNG, JPG, WebP, GIF, or HEIC." |
| Error: too large | "This file is larger than 25 MB." (value follows the configured limit) |
| Error: corrupt | "This file couldn't be read." |
| Error: URL blocked | "That site doesn't allow loading its images here. Download the image and upload it instead." |
| Warning: long output | Non-blocking notice when output exceeds a chat platform's limit |

Errors appear inline near the input, never as blocking dialogs.

## Responsive behavior

- Wide screens: two panes as above.
- Below about 900 px: single column. Output first, controls in a bottom sheet opened by a **Controls** button.
- Touch targets at least 44×44 px. Sliders also expose numeric inputs.

## Accessibility

- Every control is a native form element with a programmatic label.
- Full keyboard operation, visible focus rings, logical tab order.
- The output container is `role="img"` with `aria-label` such as "ASCII art of photo.jpg, 120 by 60 characters". Reading thousands of glyphs aloud is not useful, so the actual text is available through Copy and Download.
- Status messages ("Decoding HEIC", "Copied", errors) go to an `aria-live="polite"` region.
- Respect `prefers-reduced-motion` (no zoom or fade animations) and `prefers-color-scheme`.
- Color contrast meets WCAG 2.2 AA in both themes.

## Theming

- Dark theme by default with a light alternative; a theme toggle sits in the header.
- Colors are defined as CSS custom properties on `:root` and redefined for the light theme.
- Interface font: a sans-serif for body text; a monospace for labels, badges, and output.
