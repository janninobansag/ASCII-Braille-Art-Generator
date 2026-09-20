# Features

This guide explains what each feature does and when to use it. For how it works internally, see [processing.md](processing.md).

## Contents

- [Modes at a glance](#modes-at-a-glance)
- [ASCII or Braille](#ascii-or-braille)
- [Image controls](#image-controls)
- [Dithering](#dithering)
- [Character ramps](#character-ramps)
- [Edge detection](#edge-detection)
- [Color](#color)
- [Text mode](#text-mode)
- [Exporting](#exporting)
- [Limits](#limits)
- [Troubleshooting](#troubleshooting)

## Modes at a glance

The app has two switches:

| Switch | Options |
|---|---|
| **Input** | Image, Text |
| **Output** | ASCII, Braille |

Every combination works: image to ASCII, image to Braille, text to ASCII, text to Braille.

## ASCII or Braille

| | ASCII | Braille |
|---|---|---|
| Samples per character | 1 | 8 (a 2×4 dot grid) |
| How tone is made | Glyphs of different ink density, plus dithering | Dot density (dots are on or off), plus dithering |
| Detail at 120 columns | Moderate | High |
| Look | Classic, textured | Smooth, fine grain |
| Alignment | Needs a monospace font | Braille glyphs are usually uniform width, but the blank pattern is fragile |
| Best for | Terminals, READMEs, retro style | Photos at small sizes, chat apps, social posts |

Because a Braille dot is only on or off, **dithering is what makes Braille photos look good.** Without it, the output is a hard silhouette.

## Image controls

| Control | Range | Effect |
|---|---|---|
| Width | 20–300 characters | Output width. Height follows the image and the character aspect ratio |
| Font size | 4–24 px | Preview size only. Does not change the text output |
| Brightness | −100 to +100 | Shifts all tones lighter or darker |
| Contrast | 0.25× to 3× | Expands or compresses the tonal range |
| Gamma | 0.5 to 2.5 | Adjusts midtones without moving black and white |
| Stretch X / Y | 0.5× to 2× | Corrects aspect ratio for fonts with unusual proportions |
| Invert | on / off | Swaps light and dark. Use it when art meant for a light background is shown on a dark one, or the reverse |
| Threshold | Auto or 0–255 | Cut-off between "on" and "off". Auto uses Otsu's method. Used when dithering is off |

Start with width, then contrast, then dithering. Change one thing at a time.

## Dithering

Dithering spreads the rounding error from each pixel to its neighbors. The result is that patches of dots or glyphs average out to the right brightness when seen from a distance.

| Method | Look | Use for |
|---|---|---|
| None | Hard edges, no gradients | Logos, line art |
| Floyd–Steinberg | Smooth, fine grain | Photos, portraits |
| Atkinson | Higher contrast, cleaner whites and blacks, some loss in the deepest shadows | Small outputs, graphics |
| Ordered (Bayer 2/4/8) | Regular, stable pattern | Predictable texture |
| Blue noise | Organic grain without visible structure | Natural gradients |
| Custom kernel | Whatever you define | Experiments |

**Strength** (0–1) reduces how much error is passed on. Lower values give a cleaner but less tonally accurate result.
**Serpentine** scanning alternates row direction, which reduces diagonal streaks.

## Character ramps

A ramp is the list of characters used for shading, from lightest to darkest. The default is ten characters, from a space up to a dense symbol.

- **Presets:** classic, extended, blocks.
- **Custom:** type your own string, lightest first.
- **Calibrate to font:** measures how much ink each character actually uses in the current font, then orders and spaces the ramp by those measurements. This gives smoother gradients than a hand-written ramp.

## Edge detection

ASCII mode only. A Sobel filter finds strong edges and replaces the shading character with one that points along the edge: `-`, `/`, `|`, or `\`. Raise the threshold to keep only the strongest edges.

## Color

| Option | What you get |
|---|---|
| None | Plain text |
| Source | Each character takes the average color of the part of the image it covers |
| Gradient | Two colors blended horizontally or vertically (mainly for text) |

Color shows in the preview and PNG export. Plain-text exports (`.txt`, Discord, full-width) carry no color.

## Text mode

Choose **Text**, type your words, then choose ASCII or Braille output.

| Engine | Output | Notes |
|---|---|---|
| **FIGlet** | ASCII | Classic block letters. Over 200 fonts in groups such as Popular, 3D and Shadow, Bold and Block, Futuristic, Stylized, Isometric, Novelty |
| **Raster** | ASCII or Braille | Draws your text in a chosen web font, then converts it like an image. Supports outline and shadow effects |

Layout options for FIGlet: default, full, fitted, controlled smushing, universal smushing. Alignment and wrap width apply to both engines. See [text-mode.md](text-mode.md).

## Exporting

| Action | Result | Notes |
|---|---|---|
| Copy art | Plain text on the clipboard | |
| Download `.txt` | UTF-8 file, LF line endings | |
| Discord | Text wrapped in a code block | Discord limits message length (currently 2,000 characters for accounts without Nitro; check current limits). The app shows a character count |
| Twitch · YouTube | Full-width Unicode | Keeps columns aligned in chats that use proportional fonts |
| Copy image | PNG on the clipboard | Paste into Twitter, Instagram, and similar |
| Download PNG | PNG at 1×, 2×, or 4× | Keeps color and background |

## Limits

| Limit | Default |
|---|---|
| File size | 25 MB |
| Longest side after decode | 4096 px |
| HEIC pixel count | 64 megapixels |
| Output width | 300 characters |

## Troubleshooting

**The Braille output is ragged or misaligned.**
Use a monospace font that includes Braille (for example DejaVu Sans Mono or Noto Sans Symbols 2). Turn on **Fill blank cells** so empty cells use a single dot instead of the blank pattern. If the destination app still misaligns it, export a PNG.

**The image looks inverted.**
Toggle **Invert**. Light text on a dark background needs bright pixels to map to dense characters; dark text on a light background needs the opposite.

**The image looks too flat or too noisy.**
Flat: raise contrast. Noisy: lower dither strength, switch to Atkinson, or increase width so each character covers less.

**A HEIC file takes a few seconds the first time.**
The decoder loads on first use. Later files in the same session are faster.

**Loading from a URL fails.**
The image host must allow cross-origin access. Download the image and upload it instead.

**Copy image does not work in Safari.**
Safari requires the clipboard write to happen directly from a click. If it still fails, use **Download PNG**.
