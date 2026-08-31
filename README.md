# Booty by Mal

One-page coaching site for [bootybyemal.com](https://bootybyemal.com/). Layout and intake UX follow HxTraining; branding is dark-feminine around the BBM sticker logo.

## Setup

```bash
pnpm install
pnpm run dev
```

## Intake form (no Google login)

The on-site form posts to her existing [NEW CLIENT FORM](https://docs.google.com/forms/d/e/1FAIpQLScdJWwmtroPL3rji7M31OcceNxawLVuw9J85lqHw6rVrjkH9A/viewform). Submissions land in her Form responses / linked Sheet.

- Field IDs live in `src/lib/googleForm.ts`. If she edits the Google Form questions, remap `entry.*` IDs from the public viewform HTML (`FB_PUBLIC_LOAD_DATA_`).
- Default: hidden iframe POST (works on GitHub Pages, no extra services).
- Optional: deploy `worker/` with Wrangler and set `VITE_FORM_PROXY_URL` for real HTTP success/error.

```bash
cd worker
pnpm install
pnpm run deploy
```

Then add the worker URL to `.env` locally and as the `VITE_FORM_PROXY_URL` GitHub Actions secret.

## Photos

Replace placeholders anytime:

- `src/assets/hero.webp`
- `src/assets/about.webp`
- `src/assets/philosophy.webp`
- `src/assets/placeholders/result-1.webp` … `result-3.webp`
- `src/assets/bbm-logo.png` (prefer a transparent cutout of the sticker)

## Deploy

Push to `main`. GitHub Actions builds and publishes `dist/` to `gh-pages`.

Live URL until DNS is ready: https://4444studios.github.io/bootybymal/

Repo secrets (optional):

- `VITE_FORM_PROXY_URL`

When you point `bootybyemal.com` at GitHub Pages, add `public/CNAME` with that domain and set Pages → Custom domain. Asset paths are relative, so the same build works on both.
