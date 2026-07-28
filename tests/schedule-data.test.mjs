import test from "node:test";
import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { SCHEDULE } from "../schedule-data.js";

const EXPECTED_ROUTES = ["hillsdale", "north-foster-city", "fremont", "bart"];
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

function routeTrips(route) {
  return Object.values(route.periods).flatMap((period) => period.trips);
}

function findTrip(routeKey, periodKey, tripId) {
  return SCHEDULE.routes[routeKey].periods[periodKey].trips.find(
    ({ id }) => id === tripId,
  );
}

test("defines the four route choices and defaults to Hillsdale", () => {
  assert.equal(SCHEDULE.defaultRoute, "hillsdale");
  assert.deepEqual(Object.keys(SCHEDULE.routes), EXPECTED_ROUTES);
  assert.deepEqual(
    Object.values(SCHEDULE.routes).map(({ label }) => label),
    ["Hillsdale", "North Foster City", "Fremont", "BART"],
  );
});

test("maps every route to its source image under original_images", async () => {
  const expectedImages = {
    hillsdale: ["./original_images/hillsdale.png"],
    "north-foster-city": [
      "./original_images/north-foster-city-morning.png",
      "./original_images/north-foster-city-afternoon.png",
    ],
    fremont: ["./original_images/fremont.png"],
    bart: ["./original_images/bart.png"],
  };

  for (const [routeKey, paths] of Object.entries(expectedImages)) {
    assert.deepEqual(SCHEDULE.routes[routeKey].originalImages, paths);
    for (const path of paths) {
      assert.match(path, /^\.\/original_images\//);
      await access(fileURLToPath(new URL(`../${path.slice(2)}`, import.meta.url)));
    }
  }
});

test("keeps the source effective date only on Hillsdale", () => {
  assert.equal(SCHEDULE.routes.hillsdale.effectiveDate, "2026-01-05");
  assert.equal(Object.hasOwn(SCHEDULE, "effectiveDate"), false);

  for (const routeKey of EXPECTED_ROUTES.slice(1)) {
    assert.equal(Object.hasOwn(SCHEDULE.routes[routeKey], "effectiveDate"), false);
  }
});

test("preserves the source trip counts for every route and period", () => {
  const expectedCounts = {
    hillsdale: { morning: 9, afternoon: 9 },
    "north-foster-city": { morning: 4, afternoon: 3 },
    fremont: { morning: 6, afternoon: 6 },
    bart: { morning: 5, afternoon: 5 },
  };

  for (const [routeKey, periods] of Object.entries(expectedCounts)) {
    for (const [periodKey, count] of Object.entries(periods)) {
      assert.equal(
        SCHEDULE.routes[routeKey].periods[periodKey].trips.length,
        count,
        `${routeKey} ${periodKey}`,
      );
    }
  }
});

test("provides consistently shaped legends and connection groups", () => {
  for (const route of Object.values(SCHEDULE.routes)) {
    assert.ok(Array.isArray(route.legends));
    assert.ok(Array.isArray(route.connectionGroups));

    for (const legend of route.legends) {
      assert.deepEqual(Object.keys(legend).sort(), ["label", "short", "tone"]);
    }
    for (const group of route.connectionGroups) {
      assert.deepEqual(Object.keys(group).sort(), ["key", "label", "tone"]);
    }
  }

  assert.deepEqual(
    SCHEDULE.routes.fremont.connectionGroups.map(({ key }) => key),
    ["orange", "green"],
  );
  assert.deepEqual(
    SCHEDULE.routes.bart.legends.map(({ short }) => short),
    ["OR", "GR"],
  );
});

test("uses valid 24-hour times and globally unique route-prefixed trip IDs", () => {
  const ids = new Set();
  const missingStopTimes = [];

  for (const [routeKey, route] of Object.entries(SCHEDULE.routes)) {
    for (const trip of routeTrips(route)) {
      assert.equal(ids.has(trip.id), false, `duplicate trip id: ${trip.id}`);
      assert.ok(trip.id.startsWith(`${routeKey}-`), trip.id);
      ids.add(trip.id);

      for (const stop of trip.stops) {
        if (stop.time === null) {
          missingStopTimes.push({ routeKey, tripId: trip.id, stop });
        } else {
          assert.match(stop.time, TIME_PATTERN, `${trip.id}: ${stop.time}`);
        }
      }

      for (const connection of trip.connections ?? []) {
        assert.match(connection.time, TIME_PATTERN, `${trip.id}: ${connection.time}`);
      }
    }
  }

  assert.equal(ids.size, 47);
  assert.deepEqual(
    missingStopTimes.map(({ routeKey, tripId, stop }) => ({
      routeKey,
      tripId,
      name: stop.name,
      note: stop.note,
    })),
    [
      {
        routeKey: "north-foster-city",
        tripId: "north-foster-city-am-run-4",
        name: "Millbrae Intermodal Station (East)",
        note: "No return time listed",
      },
    ],
  );
});

test("preserves Hillsdale's original first and last runs", () => {
  const hillsdale = SCHEDULE.routes.hillsdale;
  assert.deepEqual(hillsdale.periods.morning.trips[0], {
    id: "hillsdale-am-0730",
    stops: [
      { name: "Hillsdale", time: "07:30" },
      { name: "Chess", time: "07:38" },
      { name: "Lincoln", time: "07:43" },
      { name: "Bayside", time: "07:46" },
    ],
    connections: [
      { time: "07:25", direction: "NB", train: "405", service: "regular" },
      { time: "07:15", direction: "SB", train: "404", service: "limited" },
      { time: "07:27", direction: "SB", train: "108", service: "regular" },
    ],
  });
  assert.deepEqual(hillsdale.periods.afternoon.trips.at(-1), {
    id: "hillsdale-pm-1907",
    stops: [
      { name: "Chess", time: "19:07" },
      { name: "Lincoln", time: "19:10" },
      { name: "Bayside", time: "19:15" },
      { name: "Caltrain", time: "19:30" },
    ],
    connections: [
      { time: "19:42", direction: "NB", train: "157", service: "regular" },
      { time: "19:57", direction: "SB", train: "158", service: "regular" },
    ],
  });
});

test("preserves North Foster City's source-only notes and OCR-sensitive time", () => {
  const run2 = findTrip(
    "north-foster-city",
    "morning",
    "north-foster-city-am-run-2",
  );
  const run4 = findTrip(
    "north-foster-city",
    "morning",
    "north-foster-city-am-run-4",
  );

  assert.equal(
    run2.stops.find(({ name }) => name === "E. 3rd Ave. & Lincoln Centre").time,
    "07:55",
  );
  assert.deepEqual(run4.stops.at(-1), {
    name: "Millbrae Intermodal Station (East)",
    time: null,
    note: "No return time listed",
  });

  for (const trip of routeTrips(SCHEDULE.routes["north-foster-city"])) {
    assert.equal(Object.hasOwn(trip, "connections"), false);
  }
});

test("preserves Fremont's irregular evening connection entries verbatim", () => {
  const run1810 = findTrip("fremont", "afternoon", "fremont-pm-1810");
  assert.ok(
    run1810.connections.some(
      ({ time, group, direction }) =>
        time === "18:29" && group === "orange" && direction === "N",
    ),
  );

  const finalRun = findTrip("fremont", "afternoon", "fremont-pm-1910");
  assert.deepEqual(finalRun.connections, [
    { time: "19:32", group: "orange", direction: "S", line: "orange" },
    { time: "19:52", group: "orange", direction: "S", line: "orange" },
    { time: "19:28", group: "orange", direction: "N", line: "orange" },
    { time: "19:25", group: "green", direction: "N", line: "green" },
  ]);
  assert.equal(
    finalRun.connections.some(({ group, direction }) => group === "green" && direction === "S"),
    false,
  );
});

test("preserves BART times even when the source does not imply a viable transfer", () => {
  const morning = findTrip("bart", "morning", "bart-am-0745");
  assert.ok(
    morning.connections.some(
      ({ time, group, direction }) =>
        time === "07:48" && group === "orange" && direction === "N",
    ),
  );

  const evening = findTrip("bart", "afternoon", "bart-pm-1800");
  assert.deepEqual(evening.stops.at(-1), { name: "BART Station", time: "18:20" });
  assert.ok(
    evening.connections.some(
      ({ time, group, direction }) =>
        time === "18:16" && group === "green" && direction === "S",
    ),
  );

  const finalRun = findTrip("bart", "afternoon", "bart-pm-1845");
  assert.deepEqual(
    finalRun.connections.map(({ time }) => time),
    ["18:52", "18:48", "18:56", "19:05"],
  );
});
