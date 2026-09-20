# Contributing

Thanks for helping. This guide covers setup, how changes are made, and what a good pull request looks like.

## Setup

```bash
git clone <your-repo-url> ascii-braille-generator
cd ascii-braille-generator
npm install
npm run dev
```

Requirements: a current Node.js LTS release and npm. For browser tests, run `npx playwright install --with-deps` once.

Read [docs/architecture.md](docs/architecture.md) before making structural changes.

## Workflow

1. Open an issue for anything larger than a small fix, so the approach can be agreed first.
2. Create a branch from `main`: `feature/<short-name>` or `fix/<short-name>`.
3. Make focused commits. Use plain, imperative messages ("Add Atkinson kernel", "Fix Braille edge padding").
4. Run the checks below.
5. Open a pull request. Vercel builds a preview; include what changed, why, and how you tested it. For UI changes, add screenshots.

## Checks before opening a pull request

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

If your change touches browser APIs (canvas, clipboard, workers, HEIC), also run `npm run test:e2e`.

## Code guidelines

- TypeScript strict mode. No `any` without a comment explaining why.
- **Keep `src/core/` pure.** No DOM access, no imports from `ui`, `state`, `io`, or `workers`. Functions take typed arrays and settings, and return data.
- Output must be deterministic. No `Math.random()` in conversion code.
- Do not block the main thread with heavy loops; put them in the worker.
- Load large things lazily (HEIC decoder, FIGlet fonts).
- No third-party scripts, styles, or fonts loaded from other origins. Self-host instead.
- Styling uses CSS Modules. Define colors as CSS custom properties.
- Keep components small and controlled. State lives in `src/state/`.

## Tests

- New logic in `src/core/` needs unit tests. For text output, add golden snapshots.
- Bug fixes should include a test that fails without the fix.
- See [docs/testing.md](docs/testing.md) for fixtures and the full list of checks.

## Accessibility

New controls need a visible label, keyboard access, and a focus style. Status changes go through the `aria-live` region. Check your change with keyboard only.

## Documentation

Update the docs in the same pull request when you change behavior, settings, limits, or the architecture. User-facing changes go in [docs/features.md](docs/features.md); internal design changes go in [docs/architecture.md](docs/architecture.md) or [docs/processing.md](docs/processing.md).

## Adding things

| To add | Do this |
|---|---|
| A dither kernel | Add it to `core/dither/kernels.ts`, register the id, add it to the UI select, add a golden test |
| A ramp preset | Add it to `core/ascii/ramp.ts`, ordered lightest to darkest |
| A FIGlet font | Add the `.flf` file, update `figlet-fonts.json`, add the license to `THIRD_PARTY_NOTICES.md` |
| A UI font (raster text) | Open-license fonts only; add the license file beside the font |
| An export format | Add a pure formatter in `core/export/`, then a button in `ExportPanel` |
| A dependency | Explain why in the pull request. Prefer small, maintained packages; check the license |

## Licensing of contributions

By submitting a pull request you agree that your contribution can be distributed under the project's license (see `LICENSE` once it is added). Do not include code, fonts, or images you do not have the right to share. Do not copy code, text, or assets from other ASCII generators; this project is an independent implementation.

## Reporting bugs

Open an issue with:

- What you did, what you expected, and what happened.
- Browser and version, and operating system.
- The image format (and size) or text you used. Do not attach private photos; a small reproducing image is enough.
- Your settings, if the bug depends on them.

## Security

If you find a security problem, do not open a public issue. Contact the maintainers privately, using the address listed in the repository's security policy once one is published.
