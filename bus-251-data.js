export const BUS_251 = {
  label: "251 Bus",
  routeLabel: "Hillsdale · Foster City Loop",
  timeZone: "America/Los_Angeles",
  stops: [
    {
      id: "hillsdale-departure",
      short: "Hillsdale · Bay 7",
      card: "Hillsdale",
      name: "W Hillsdale Blvd & Edison St · Bay 7",
    },
    {
      id: "bridgepointe",
      short: "Bridgepointe & Chess",
      card: "Bridgepointe",
      name: "Bridgepointe Pkwy & Chess Dr",
    },
    {
      id: "foster-city",
      short: "Foster City Blvd",
      card: "Foster City",
      name: "E Hillsdale Blvd & Foster City Blvd",
    },
    {
      id: "hillsdale-center",
      short: "Hillsdale Center",
      card: "Hillsdale Center",
      name: "El Camino Real & 31st Ave · Hillsdale Shopping Center",
    },
    {
      id: "hillsdale-return",
      short: "Hillsdale · Bay 7",
      card: "Hillsdale",
      name: "W Hillsdale Blvd & Edison St · Bay 7",
    },
  ],
  commutes: {
    morning: {
      label: "To Foster City",
      meta: "AM",
      kicker: "MORNING · FROM HILLSDALE",
      boardStopIndex: 0,
      destinationStopIndex: 2,
    },
    afternoon: {
      label: "To Hillsdale",
      meta: "PM",
      kicker: "RETURN · FROM FOSTER CITY BLVD",
      boardStopIndex: 2,
      destinationStopIndex: 4,
    },
  },
  days: {
    weekday: {
      label: "Weekday",
      originalImage: "./original_images/251_weekday.png",
      rows: [
        ["06:40", "06:53", "07:07", "07:26", "07:30"],
        ["07:40", "07:53", "08:07", "08:26", "08:30"],
        ["08:40", "08:53", "09:07", "09:26", "09:30"],
        ["09:40", "09:53", "10:07", "10:26", "10:30"],
        ["10:40", "10:56", "11:14", "11:34", "11:39"],
        ["11:40", "11:56", "12:14", "12:34", "12:39"],
        ["12:40", "12:56", "13:14", "13:34", "13:39"],
        ["13:40", "13:56", "14:14", "14:34", "14:39"],
        ["14:40", "14:58", "15:18", "15:38", "15:43"],
        ["15:40", "15:58", "16:18", "16:38", "16:43"],
        ["16:40", "16:58", "17:18", "17:38", "17:43"],
        ["17:40", "17:58", "18:18", "18:38", "18:43"],
        ["18:40", "18:58", "19:18", "19:38", "19:43"],
        ["19:40", "19:56", "20:14", "20:32", "20:36"],
      ],
    },
    saturday: {
      label: "Saturday",
      originalImage: "./original_images/251_sat.png",
      rows: [
        ["07:40", "07:54", "08:10", "08:27", "08:31"],
        ["08:40", "08:54", "09:10", "09:27", "09:31"],
        ["09:40", "09:54", "10:10", "10:27", "10:31"],
        ["10:43", "10:57", "11:13", "11:30", "11:34"],
        ["11:40", "11:54", "12:10", "12:27", "12:31"],
        ["12:40", "12:54", "13:10", "13:27", "13:31"],
        ["13:43", "13:57", "14:13", "14:30", "14:34"],
        ["14:40", "14:54", "15:10", "15:27", "15:31"],
        ["15:40", "15:54", "16:10", "16:27", "16:31"],
        ["16:43", "16:57", "17:13", "17:30", "17:34"],
        ["17:40", "17:54", "18:10", "18:27", "18:31"],
        ["18:40", "18:54", "19:10", "19:27", "19:31"],
      ],
    },
    sunday: {
      label: "Sunday",
      originalImage: "./original_images/251_sun.png",
      rows: [
        ["07:40", "07:55", "08:07", "08:23", "08:27"],
        ["08:40", "08:55", "09:07", "09:23", "09:27"],
        ["09:40", "09:55", "10:07", "10:23", "10:27"],
        ["10:43", "10:58", "11:10", "11:26", "11:30"],
        ["11:40", "11:55", "12:07", "12:23", "12:27"],
        ["12:40", "12:55", "13:07", "13:23", "13:27"],
        ["13:43", "13:58", "14:10", "14:26", "14:30"],
        ["14:40", "14:55", "15:07", "15:23", "15:27"],
        ["15:40", "15:55", "16:07", "16:23", "16:27"],
        ["16:43", "16:58", "17:10", "17:26", "17:30"],
        ["17:40", "17:55", "18:07", "18:23", "18:27"],
        ["18:40", "18:55", "19:07", "19:23", "19:27"],
      ],
    },
  },
};

export function bus251DayKey(weekday) {
  if (weekday === 6) {
    return "saturday";
  }
  if (weekday === 0) {
    return "sunday";
  }
  return "weekday";
}

export function bus251CommuteKey(minutes) {
  return minutes < 12 * 60 ? "morning" : "afternoon";
}

export function nextBusRow(rows, stopIndex, nowMinutes) {
  return rows.findIndex((row) => {
    const [hours, minutes] = row[stopIndex].split(":").map(Number);
    return hours * 60 + minutes >= nowMinutes;
  });
}
