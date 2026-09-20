# ASCII & Braille Art Generator

Turn images and text into ASCII art or Unicode Braille art, in the browser. Nothing is uploaded: all conversion runs on your device.

> **Status:** pre-release. This README describes the intended v1 behavior. Commands below assume the project scaffold from [docs/architecture.md](docs/architecture.md).

## What it does

| Input | ASCII output | Braille output |
|---|---|---|
| **Image** (PNG, JPEG, WebP, GIF, BMP, AVIF, SVG, **HEIC/HEIF**) | Shaded text using a glyph ramp, with dithering | Dot-pattern characters (U+2800–U+28FF), with dithering |
| **Text** | FIGlet block letters, or any web font rendered and shaded | Any web font rendered as Braille dots |

Other features:

- Live preview. Sliders update the output without freezing the page.
- Controls for width, brightness, contrast, gamma, stretch, invert, threshold, and character ramp.
- Dithering: Floyd–Steinberg, Atkinson, ordered (Bayer), blue noise, or your own kernel.
- Sobel edge detection that swaps in directional characters (`/ \ | -`) in ASCII mode.
- Color output and two-color gradients.
- Export as text, `.txt`, PNG (1×, 2×, 4×), Discord code block, or full-width Unicode for Twitch and YouTube chat.

## Why a Braille mode

Each Braille character holds a 2×4 grid of dots, so one character carries eight samples of the image instead of one. At the same character count, Braille output shows about twice the horizontal and four times the vertical detail of ASCII. Tone comes from dot density, which is why dithering matters so much in this mode.

Use ASCII when you want the classic look or need to paste into a terminal or README. Use Braille when you want photo detail at a small size. See [docs/features.md](docs/features.md#ascii-or-braille).

## Quick start

Requirements: a current Node.js LTS release and npm.

```bash
git clone <your-repo-url> ascii-braille-generator
cd ascii-braille-generator
npm install
npm run dev
```

Open the local URL that Vite prints (usually `http://localhost:5173`).

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run browser tests (Playwright) |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm run format` | Format with Prettier |

## Using it

**Image mode**

1. Choose **Image**, then **ASCII** or **Braille**.
2. Drop a file, click to browse, or paste an image from the clipboard.
3. Set **Width** (characters). Start around 120.
4. Adjust brightness and contrast until the shading looks right.
5. Pick a dithering method. Floyd–Steinberg suits photos; Atkinson gives a bolder, higher-contrast look.
6. Copy or download the result.

**Text mode**

1. Choose **Text**, then **ASCII** or **Braille**.
2. Type your text.
3. For ASCII, pick the **FIGlet** engine for classic block letters, or the **Raster** engine to render any font and shade it.
4. For Braille, pick a font and weight. Braille text stays readable at far fewer characters than FIGlet.
5. Optionally add a color gradient, then export.

Tip: on a dark background, light characters read as "bright". If your output looks inverted, toggle **Invert**.

## Supported formats

| Format | Notes |
|---|---|
| PNG, JPEG, WebP, BMP, AVIF | Decoded by the browser |
| GIF | First frame only |
| SVG | Rasterized at a fixed width |
| **HEIC / HEIF** | Decoded by the browser when possible, otherwise by a WebAssembly decoder loaded on demand. See [docs/heic-support.md](docs/heic-support.md) |

Default limits: 25 MB per file, images downscaled to 4096 px on the longest side, HEIC capped at 64 megapixels. These are configurable.

## Tech stack

- TypeScript, Vite, React, CSS Modules
- Web Workers for decoding and conversion
- [`libheif-js`](https://www.npmjs.com/package/libheif-js) (WebAssembly) for HEIC fallback
- [`figlet`](https://www.npmjs.com/package/figlet) for block-letter text
- Vitest and Playwright for tests
- Vercel for hosting

## Project structure

```text
.
├─ public/fonts/           # FIGlet .flf fonts and self-hosted UI fonts
├─ src/
│  ├─ app/                 # App shell
│  ├─ ui/                  # Components
│  ├─ state/               # Settings store
│  ├─ workers/             # pipeline.worker.ts, heic.worker.ts
│  ├─ io/                  # File decode, clipboard, download
│  └─ core/                # Pure algorithms: color, resample, dither, ascii, braille, text, export
├─ tests/                  # Unit, e2e, fixtures
├─ docs/                   # Documentation
└─ vercel.json
```

## Documentation

| Document | Contents |
|---|---|
| [docs/features.md](docs/features.md) | What each feature does, when to use it, troubleshooting |
| [docs/ui-spec.md](docs/ui-spec.md) | Layout, controls, states, accessibility |
| [docs/architecture.md](docs/architecture.md) | System design, threading, data model, decisions |
| [docs/processing.md](docs/processing.md) | Image pipeline, ASCII and Braille engines, dithering |
| [docs/text-mode.md](docs/text-mode.md) | FIGlet and raster text engines, text to Braille |
| [docs/heic-support.md](docs/heic-support.md) | HEIC detection, decoding, limits |
| [docs/deployment.md](docs/deployment.md) | Vercel setup, headers, CI |
| [docs/testing.md](docs/testing.md) | Test strategy and fixtures |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute |

## Deploy to Vercel

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import it in Vercel. The Vite preset is detected automatically.
3. Confirm: build command `npm run build`, output directory `dist`.
4. Deploy. Pull requests get preview URLs; merges to `main` go to production.

The app is static, so there are no environment variables or server functions in v1. Full details, including security headers, are in [docs/deployment.md](docs/deployment.md).

## Browser support

Latest two major versions of Chrome, Edge, Firefox, and Safari, on desktop and mobile. Safari 16.4 or newer is needed for `OffscreenCanvas`.

## Privacy

Images and text are processed in memory in your browser. They are not sent to a server, logged, or stored. Only interface settings are saved locally.

## Roadmap

| Phase | Scope |
|---|---|
| 1 | Core library, ASCII and Braille from images, dithering, copy and `.txt` export, Vercel deployment |
| 2 | HEIC support, text to ASCII and Braille, PNG export, Discord and full-width export, ramp calibration, edge detection |
| 3 | Color and gradients everywhere, custom dither kernels in the UI, SVG/HTML export, shareable settings links |
| Later | Optional URL-image proxy, glyph shape matching, literary Braille transliteration, animated GIF |

## License

Not yet chosen. Add a `LICENSE` file before publishing. Third-party components (libheif, FIGlet fonts, UI fonts) have their own licenses; list them in `THIRD_PARTY_NOTICES.md`.

## Acknowledgements

The feature set was informed by public ASCII generators such as [asciigenerators.com](https://asciigenerators.com/). This is an independent implementation and does not reuse their code, copy, or assets. HEIC decoding uses [libheif](https://github.com/strukturag/libheif) through `libheif-js`.
