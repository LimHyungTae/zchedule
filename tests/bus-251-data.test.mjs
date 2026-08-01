import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { BUS_251, bus251CommuteKey, bus251DayKey, nextBusRow } from "../bus-251-data.js";

const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

test("selects the matching Route 251 timetable for every day of the week", () => {
  assert.equal(bus251DayKey(0), "sunday");
  assert.equal(bus251DayKey(6), "saturday");
  for (const weekday of [1, 2, 3, 4, 5]) {
    assert.equal(bus251DayKey(weekday), "weekday");
  }
});

test("uses the morning Hillsdale stop and afternoon Foster City stop", () => {
  assert.equal(bus251CommuteKey(11 * 60 + 59), "morning");
  assert.equal(bus251CommuteKey(12 * 60), "afternoon");
  assert.equal(BUS_251.commutes.morning.boardStopIndex, 0);
  assert.equal(BUS_251.commutes.morning.destinationStopIndex, 2);
  assert.equal(BUS_251.commutes.afternoon.boardStopIndex, 2);
  assert.equal(BUS_251.commutes.afternoon.destinationStopIndex, 4);
});

test("preserves all source rows and valid 24-hour times", () => {
  assert.deepEqual(
    Object.fromEntries(Object.entries(BUS_251.days).map(([key, day]) => [key, day.rows.length])),
    { weekday: 14, saturday: 12, sunday: 12 },
  );

  for (const day of Object.values(BUS_251.days)) {
    for (const row of day.rows) {
      assert.equal(row.length, BUS_251.stops.length);
      row.forEach((time) => assert.match(time, TIME_PATTERN));
    }
  }

  assert.deepEqual(BUS_251.days.weekday.rows[0], [
    "06:40", "06:53", "07:07", "07:26", "07:30",
  ]);
  assert.deepEqual(BUS_251.days.weekday.rows.at(-1), [
    "19:40", "19:56", "20:14", "20:32", "20:36",
  ]);
  assert.deepEqual(BUS_251.days.saturday.rows[3], [
    "10:43", "10:57", "11:13", "11:30", "11:34",
  ]);
  assert.deepEqual(BUS_251.days.sunday.rows[3], [
    "10:43", "10:58", "11:10", "11:26", "11:30",
  ]);
});

test("maps each service day to the supplied source image", async () => {
  const worker = await readFile(new URL("../sw.js", import.meta.url), "utf8");
  const expected = {
    weekday: "./original_images/251_weekday.png",
    saturday: "./original_images/251_sat.png",
    sunday: "./original_images/251_sun.png",
  };

  for (const [dayKey, path] of Object.entries(expected)) {
    assert.equal(BUS_251.days[dayKey].originalImage, path);
    await access(fileURLToPath(new URL(`../${path.slice(2)}`, import.meta.url)));
    assert.ok(worker.includes(`"${path}"`), `${path} must be available offline`);
  }
});

test("finds the next bus using the active boarding stop", () => {
  const rows = BUS_251.days.weekday.rows;
  assert.equal(nextBusRow(rows, 0, 7 * 60 + 39), 1);
  assert.equal(nextBusRow(rows, 0, 7 * 60 + 40), 1);
  assert.equal(nextBusRow(rows, 2, 17 * 60 + 17), 10);
  assert.equal(nextBusRow(rows, 2, 20 * 60 + 15), -1);
});

test("keeps PWA shuttle shortcuts explicit after adding the saved service tab", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("../manifest.webmanifest", import.meta.url), "utf8"),
  );
  assert.deepEqual(
    manifest.shortcuts.map(({ url }) => url),
    ["./?service=shuttle#morning", "./?service=shuttle#afternoon"],
  );
});
