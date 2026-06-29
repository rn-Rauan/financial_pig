# Icons

PWA icons for Financial Pig.

- `icon.svg`: source vector used as the browser favicon and generic manifest
  icon.
- `icon-180.png`: Apple touch icon referenced by `index.html`.
- `icon-192.png` and `icon-512.png`: installable PWA icons referenced by
  `public/manifest.webmanifest` and precached by the PWA plugin in
  `vite.config.ts`.

If the brand icon changes, regenerate the PNG files from the SVG source and keep
the manifest, `index.html`, and `vite.config.ts` references in sync.
