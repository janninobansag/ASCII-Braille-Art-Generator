# Repository Guidelines

## Project Structure & Module Organization

This is a client-only React and TypeScript application built with Vite. Application code lives under `src/`:

- `src/app/` contains the application shell, entry point, and global theme tokens.
- `src/ui/` contains React components and colocated CSS Modules; reusable controls live in `src/ui/controls/`.
- `src/state/` defines settings and the application state hook.
- `src/core/` contains framework-free image, ASCII, Braille, color, dithering, and resampling algorithms.
- `src/workers/` runs expensive conversion work off the main thread.
- `src/io/` wraps browser image-decoding APIs.
- `docs/` records architecture, processing, deployment, and UI decisions.

Treat `node_modules/`, `.vite/`, and `dist/` as generated content. Do not edit or commit generated cache changes.

## Build, Test, and Development Commands

Use Node.js 20 or newer.

- `npm install` installs dependencies from `package-lock.json`.
- `npm run dev` starts the Vite development server.
- `npm run typecheck` runs strict TypeScript checks without emitting files.
- `npm run build` type-checks and creates the production bundle in `dist/`.
- `npm run preview` serves the production bundle locally.
- `npm run lint` runs ESLint once its configuration and dependency are present.

The documentation proposes Vitest and Playwright, but this scaffold currently has no test scripts or test dependencies. Add those before relying on `npm test` or end-to-end commands.

## Coding Style & Naming Conventions

Use two-space indentation, single quotes in TypeScript, semicolons, strict types, and functional React components. Name components and exported types in `PascalCase`, hooks and functions in `camelCase`, and CSS Modules as `Component.module.css`. Keep `src/core/` deterministic and free of React, DOM, state, or worker imports. Move CPU-heavy loops into workers and avoid `any` unless justified in a comment.

## Testing Guidelines

Add unit tests for new `src/core/` logic and regression tests for bug fixes. Prefer deterministic fixtures and golden snapshots for generated character art. Browser-facing changes involving canvas, clipboard, workers, or decoding should receive cross-browser end-to-end coverage when Playwright is configured.

## Commit & Pull Request Guidelines

History follows short Conventional Commit-style subjects, such as `feat(core): implement core engine` and `fix: layout bugs`. Keep commits focused and imperative. Pull requests should explain what changed and why, link relevant issues, list verification commands, update affected documentation, and include screenshots for UI changes.

## Security & Privacy

Preserve client-only processing: images and text must not be uploaded or logged. Self-host fonts and assets, validate file limits, and avoid introducing third-party runtime requests without explicit review.
