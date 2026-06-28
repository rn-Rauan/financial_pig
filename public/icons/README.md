# Icons

Baseline PWA icon. `icon.svg` is the working vector icon used during
foundational phases and is the only icon referenced today (by
`index.html`, `public/manifest.webmanifest`, and the PWA plugin in
`vite.config.ts`).

Raster icons (`icon-192.png`, `icon-512.png`) and the `apple-touch-icon` are
added in the PWA story (tasks T089–T090). When they land, re-add their entries
to the manifest, the `<link rel="apple-touch-icon">` in `index.html`, and the
plugin `includeAssets` list.
