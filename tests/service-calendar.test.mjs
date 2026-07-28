import test from "node:test";
import assert from "node:assert/strict";

import { scheduleClock, serviceDayStatus } from "../service-calendar.js";

const SERVICE = {
  timeZone: "America/Los_Angeles",
  extraClosureDates: [],
};

function pacificNoon(date) {
  return new Date(`${date}T12:00:00-08:00`);
}

test("uses Pacific time even when the UTC calendar has moved to Monday", () => {
  const now = new Date("2026-07-27T01:00:00Z");
  assert.equal(scheduleClock(now, SERVICE.timeZone).date, "2026-07-26");
  assert.equal(serviceDayStatus(now, SERVICE).reason, "weekend");
});

test("weekends are not service days", () => {
  assert.equal(serviceDayStatus(pacificNoon("2026-07-25"), SERVICE).active, false);
  assert.equal(serviceDayStatus(pacificNoon("2026-07-26"), SERVICE).active, false);
  assert.equal(serviceDayStatus(pacificNoon("2026-07-27"), SERVICE).active, true);
});

test("matches OPM observed federal holiday dates for 2026 through 2028", () => {
  const observedDates = [
    "2026-01-01", "2026-01-19", "2026-02-16", "2026-05-25",
    "2026-06-19", "2026-07-03", "2026-09-07", "2026-10-12",
    "2026-11-11", "2026-11-26", "2026-12-25",
    "2027-01-01", "2027-01-18", "2027-02-15", "2027-05-31",
    "2027-06-18", "2027-07-05", "2027-09-06", "2027-10-11",
    "2027-11-11", "2027-11-25", "2027-12-24",
    "2027-12-31", "2028-01-17", "2028-02-21", "2028-05-29",
    "2028-06-19", "2028-07-04", "2028-09-04", "2028-10-09",
    "2028-11-10", "2028-11-23", "2028-12-25",
  ];

  for (const date of observedDates) {
    const status = serviceDayStatus(pacificNoon(date), SERVICE);
    assert.equal(status.active, false, `${date} should not count down`);
    assert.equal(status.reason, "holiday", `${date} should be a federal holiday`);
  }
});

test("handles actual weekend holidays and adjacent service weekdays", () => {
  assert.equal(serviceDayStatus(pacificNoon("2026-07-04"), SERVICE).active, false);
  assert.equal(serviceDayStatus(pacificNoon("2026-07-06"), SERVICE).active, true);
  assert.equal(serviceDayStatus(pacificNoon("2028-01-01"), SERVICE).active, false);
  assert.equal(serviceDayStatus(pacificNoon("2028-01-03"), SERVICE).active, true);
});

test("supports labeled company closure dates", () => {
  const status = serviceDayStatus(pacificNoon("2026-08-14"), {
    ...SERVICE,
    extraClosureDates: [{ date: "2026-08-14", label: "Company holiday" }],
  });

  assert.equal(status.active, false);
  assert.equal(status.reason, "closure");
  assert.equal(status.label, "Company holiday");
});
