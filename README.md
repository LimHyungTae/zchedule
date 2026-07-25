# Zchedule

A small, installable timetable viewer with separate Morning and Afternoon views.

**Live app:** [https://limhyungtae.github.io/zchedule/](https://limhyungtae.github.io/zchedule/)

## Open locally

Serve the repository root with any static file server. For example:

```sh
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173`.

## Update the timetable

1. Replace `time_table.png` with the new source image, keeping the same filename.
2. Update the structured times in `schedule-data.js` so the cards match the source.
3. Commit and push to `main`.
4. Reopen the app while online. The newest cards and source image replace the offline copy automatically.

The source image remains available through **View original** for visual verification.

## Install on a phone

Open the published page and tap **Install app**. Zchedule chooses the right flow for the device:

- On Android, it opens the native browser install prompt when available. If the prompt is unavailable, follow the browser-menu steps shown in the app.
- On iPhone or iPad, it shows the current **Share → Add to Home Screen → Add** steps. Keep **Open as Web App** turned on if that option appears.

After installation, launch Zchedule from its Home Screen icon.

Long-pressing the icon may also expose Morning and Afternoon shortcuts on supported launchers.

## Privacy note

The page asks search engines not to index or archive it and does not include analytics or social metadata. The published URL and image are still publicly accessible to anyone who knows the address.
