const DEFAULT_TIME_ZONE = "America/Los_Angeles";

function pad(value) {
  return String(value).padStart(2, "0");
}

function dateKey({ year, month, day }) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function dayOfWeek({ year, month, day }) {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

function shiftDays({ year, month, day }, amount) {
  const shifted = new Date(Date.UTC(year, month - 1, day + amount));
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

function nthWeekday(year, month, weekday, occurrence) {
  const first = { year, month, day: 1 };
  const offset = (weekday - dayOfWeek(first) + 7) % 7;
  return { year, month, day: 1 + offset + (occurrence - 1) * 7 };
}

function lastWeekday(year, month, weekday) {
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const last = { year, month, day: lastDay };
  return shiftDays(last, -((dayOfWeek(last) - weekday + 7) % 7));
}

function observedDate(actual) {
  const weekday = dayOfWeek(actual);
  if (weekday === 6) {
    return shiftDays(actual, -1);
  }
  if (weekday === 0) {
    return shiftDays(actual, 1);
  }
  return actual;
}

function federalHolidaysForYear(year) {
  const holidays = [
    { name: "New Year’s Day", actual: { year, month: 1, day: 1 } },
    {
      name: "Martin Luther King Jr. Day",
      actual: nthWeekday(year, 1, 1, 3),
    },
    {
      name: "Washington’s Birthday",
      actual: nthWeekday(year, 2, 1, 3),
    },
    {
      name: "Memorial Day",
      actual: lastWeekday(year, 5, 1),
    },
    { name: "Independence Day", actual: { year, month: 7, day: 4 } },
    {
      name: "Labor Day",
      actual: nthWeekday(year, 9, 1, 1),
    },
    {
      name: "Columbus Day",
      actual: nthWeekday(year, 10, 1, 2),
    },
    { name: "Veterans Day", actual: { year, month: 11, day: 11 } },
    {
      name: "Thanksgiving Day",
      actual: nthWeekday(year, 11, 4, 4),
    },
    { name: "Christmas Day", actual: { year, month: 12, day: 25 } },
  ];

  if (year >= 2021) {
    holidays.splice(4, 0, {
      name: "Juneteenth",
      actual: { year, month: 6, day: 19 },
    });
  }

  return holidays;
}

function federalHolidayFor(target) {
  const targetKey = dateKey(target);

  // The following year's New Year's Day can be observed on December 31.
  for (const year of [target.year - 1, target.year, target.year + 1]) {
    for (const holiday of federalHolidaysForYear(year)) {
      const actualKey = dateKey(holiday.actual);
      const observed = observedDate(holiday.actual);
      const observedKey = dateKey(observed);

      if (targetKey === actualKey) {
        return { name: holiday.name, observed: false };
      }
      if (targetKey === observedKey && observedKey !== actualKey) {
        return { name: holiday.name, observed: true };
      }
    }
  }

  return null;
}

function matchingClosure(closures, targetKey) {
  return closures.find((closure) => {
    const closureDate = typeof closure === "string" ? closure : closure?.date;
    return closureDate === targetKey;
  });
}

export function scheduleClock(now = new Date(), timeZone = DEFAULT_TIME_ZONE) {
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
    throw new TypeError("scheduleClock requires a valid Date.");
  }

  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value]),
  );

  const clock = {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };

  return {
    ...clock,
    date: dateKey(clock),
    weekday: dayOfWeek(clock),
    minutes: clock.hour * 60 + clock.minute,
    timeZone,
  };
}

export function serviceDayStatus(now = new Date(), service = {}) {
  const clock = scheduleClock(now, service.timeZone || DEFAULT_TIME_ZONE);
  const closure = matchingClosure(service.extraClosureDates || [], clock.date);

  if (closure) {
    return {
      ...clock,
      active: false,
      reason: "closure",
      label: typeof closure === "string" ? "Scheduled closure" : closure.label || "Scheduled closure",
    };
  }

  if (clock.weekday === 0 || clock.weekday === 6) {
    return { ...clock, active: false, reason: "weekend", label: "Weekend" };
  }

  const holiday = federalHolidayFor(clock);
  if (holiday) {
    return {
      ...clock,
      active: false,
      reason: "holiday",
      label: holiday.name,
      observed: holiday.observed,
    };
  }

  return { ...clock, active: true, reason: "weekday", label: "Weekday service" };
}
