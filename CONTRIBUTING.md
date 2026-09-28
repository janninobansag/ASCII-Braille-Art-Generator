# Contributing

Thanks for helping. This guide covers setup, how changes are made, and what a good pull request looks like.

## Setup

```bash
git clone <your-repo-url> ascii-braille-generator
cd ascii-braille-generator
npm install
npm run dev
```

Requirements: Node.js 20 or newer and npm. Automated browser tests are planned but are not installed in this scaffold yet.

Read [docs/architecture.md](docs/architecture.md) before making structural changes.

## Workflow

1. Open an issue for anything larger than a small fix, so the approach can be agreed first.
2. Create a branch from `main`: `feature/<short-name>` or `fix/<short-name>`.
3. Make focused commits. Use plain, imperative messages ("Add Atkinson kernel", "Fix Braille edge padding").
4. Run the checks below.
5. Open a pull request. Include what changed, why, and how you tested it. For UI changes, add screenshots. Vercel preview builds apply only after the repository is connected to Vercel.

## Checks before opening a pull request

```bash
npm run lint
npm run typecheck
npm run build
```

There are currently no `npm test` or `npm run test:e2e` scripts. Add the corresponding dependencies and scripts before relying on automated unit or browser tests.

## Code guidelines

- TypeScript strict mode. No `any` without a comment explaining why.
- **Keep `src/core/` pure.** No DOM access, no imports from `ui`, `state`, `io`, or `workers`. Functions take typed arrays and settings, and return data.
- Output must be deterministic. No `Math.random()` in conversion code.
- Do not block the main thread with heavy loops; put them in the worker.
- Load large things lazily when those decoders or font bundles are added.
- No third-party scripts, styles, or fonts loaded from other origins. Self-host instead.
- Styling uses CSS Modules. Define colors as CSS custom properties.
- Keep components small and controlled. State lives in `src/state/`.

## Tests

- New logic in `src/core/` should receive unit tests once the test harness is added. For text output, use golden snapshots.
- Bug fixes should include a regression test when the relevant harness exists.
- See [docs/testing.md](docs/testing.md) for the planned coverage and the checks that are currently available.

## Accessibility

New controls need a visible label, keyboard access, and a focus style. Status changes go through the `aria-live` region. Check your change with keyboard only.

## Documentation

Update the docs in the same pull request when you change behavior, settings, limits, or the architecture. User-facing changes go in [docs/features.md](docs/features.md); internal design changes go in [docs/architecture.md](docs/architecture.md) or [docs/processing.md](docs/processing.md).

## Adding things

| To add | Do this |
|---|---|
| A dither kernel | Add it to the appropriate module in `src/core/dither/index.ts`, register the id, and update the control |
| A ramp preset | Add it to `src/core/ascii/index.ts`, ordered lightest to darkest |
| A text font | Add the asset under `public/` only when text rendering is wired, with its license documented |
| An export format | Add a pure formatter under `src/core/`, then wire the action in `src/ui/ExportPanel.tsx` |
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
