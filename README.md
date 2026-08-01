# Zchedule

A small, installable timetable viewer for four shuttle routes and the Route 251 Hillsdale–Foster City loop.

Made by Hyungtae "Hugo" Lim.

**Live app:** [https://limhyungtae.github.io/zchedule/](https://limhyungtae.github.io/zchedule/)

## Open locally

Serve the repository root with any static file server. For example:

```sh
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173`.

Run the calendar checks with `npm test`.

## Update the timetable

1. Replace the matching source image in `original_images/`, keeping its normalized filename:
   - `hillsdale.png`
   - `north-foster-city-morning.png`
   - `north-foster-city-afternoon.png`
   - `fremont.png`
   - `bart.png`
   - `251_weekday.png`
   - `251_sat.png`
   - `251_sun.png`
2. Update the structured times so the cards match the source:
   - Shuttle routes live in `schedule-data.js`.
   - Route 251 lives in `bus-251-data.js` with separate weekday, Saturday, and Sunday rows.
3. Commit and push to `main`.
4. Reopen the app while online. The newest cards and source images replace the offline copy automatically.

The source image for the selected route and period remains available through **View original** for visual verification.

## Route links

The selected route is stored on the device and can also be opened directly:

- Hillsdale: `?route=hillsdale#morning`
- North Foster City: `?route=north-foster-city#morning`
- Fremont: `?route=fremont#morning`
- BART: `?route=bart#morning`
- Route 251: `?service=251`

Change `#morning` to `#afternoon` for the second service period. Fremont and BART label that period **Evening** in the app to match their source timetables. Route 251 automatically picks its direction from the current time, and its two direction buttons can override that choice.

## Service days

Live countdowns run on weekdays in the `America/Los_Angeles` time zone. They are disabled on weekends and observed U.S. federal holidays; the Morning and Afternoon timetables remain available to browse.

Route 251 runs from its supplied daily tables instead: Monday–Friday, Saturday, or Sunday is selected automatically in Pacific time. Its morning view boards at Hillsdale Bay 7, while its return view boards at E Hillsdale Blvd & Foster City Blvd.

For a company-specific closure, add an entry to `service.extraClosureDates` in `schedule-data.js`:

```js
{ date: "2026-12-24", label: "Company holiday" }
```

## Install on a phone

Open the published page and tap **Install app**. Zchedule chooses the right flow for the device:

- On Android, it opens the native browser install prompt when available. If the prompt is unavailable, follow the browser-menu steps shown in the app.
- On iPhone or iPad, it shows the current **Share → Add to Home Screen → Add** steps. Keep **Open as Web App** turned on if that option appears.

After installation, launch Zchedule from its Home Screen icon.

Long-pressing the icon may also expose Morning and PM shortcuts for the most recently selected route on supported launchers.

## Privacy note

The page asks search engines not to index or archive it and does not include analytics or social metadata. The published URL and original images are still publicly accessible to anyone who knows the address.
