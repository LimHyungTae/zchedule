export const SCHEDULE = {
  effectiveDate: "2026-01-05",
  service: {
    timeZone: "America/Los_Angeles",
    extraClosureDates: [
      // Add company-specific closures as { date: "YYYY-MM-DD", label: "Company holiday" }.
    ],
  },
  periods: {
    morning: {
      label: "Morning",
      kicker: "MORNING SCHEDULE",
      connectionLabel: "Train arrivals",
      connectionDescription: "Train arrivals at Hillsdale",
      trips: [
        {
          id: "am-0730",
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
        },
        {
          id: "am-0752",
          stops: [
            { name: "Hillsdale", time: "07:52" },
            { name: "Chess", time: "08:00" },
            { name: "Lincoln", time: "08:05" },
            { name: "Bayside", time: "08:08" },
          ],
          connections: [
            { time: "07:42", direction: "NB", train: "109", service: "regular" },
            { time: "07:46", direction: "SB", train: "506", service: "bullet" },
          ],
        },
        {
          id: "am-0819",
          stops: [
            { name: "Hillsdale", time: "08:19" },
            { name: "Chess", time: "08:27" },
            { name: "Lincoln", time: "08:32" },
            { name: "Bayside", time: "08:35" },
          ],
          connections: [
            { time: "07:56", direction: "NB", train: "507", service: "bullet" },
            { time: "08:12", direction: "NB", train: "111", service: "regular" },
            { time: "07:57", direction: "SB", train: "110", service: "regular" },
            { time: "08:15", direction: "SB", train: "408", service: "limited" },
          ],
        },
        {
          id: "am-0837",
          stops: [
            { name: "Hillsdale", time: "08:37" },
            { name: "Chess", time: "08:45" },
            { name: "Lincoln", time: "08:50" },
            { name: "Bayside", time: "08:53" },
          ],
          connections: [
            { time: "08:25", direction: "NB", train: "409", service: "limited" },
            { time: "08:27", direction: "SB", train: "112", service: "regular" },
          ],
        },
        {
          id: "am-0903",
          stops: [
            { name: "Hillsdale", time: "09:03" },
            { name: "Chess", time: "09:11" },
            { name: "Lincoln", time: "09:16" },
            { name: "Bayside", time: "09:19" },
          ],
          connections: [
            { time: "08:56", direction: "NB", train: "511", service: "bullet" },
            { time: "08:46", direction: "SB", train: "510", service: "bullet" },
            { time: "08:57", direction: "SB", train: "114", service: "regular" },
          ],
        },
        {
          id: "am-0920",
          stops: [
            { name: "Hillsdale", time: "09:20" },
            { name: "Chess", time: "09:28" },
            { name: "Lincoln", time: "09:33" },
            { name: "Bayside", time: "09:36" },
          ],
          connections: [
            { time: "09:12", direction: "NB", train: "115", service: "regular" },
            { time: "09:15", direction: "SB", train: "412", service: "limited" },
          ],
        },
        {
          id: "am-0945",
          stops: [
            { name: "Hillsdale", time: "09:45" },
            { name: "Chess", time: "09:53" },
            { name: "Lincoln", time: "09:58" },
            { name: "Bayside", time: "10:01" },
          ],
          connections: [
            { time: "09:25", direction: "NB", train: "413", service: "limited" },
            { time: "09:27", direction: "SB", train: "116", service: "regular" },
          ],
        },
        {
          id: "am-1005",
          stops: [
            { name: "Hillsdale", time: "10:05" },
            { name: "Chess", time: "10:13" },
            { name: "Lincoln", time: "10:18" },
            { name: "Bayside", time: "10:21" },
          ],
          connections: [
            { time: "09:42", direction: "NB", train: "117", service: "regular" },
            { time: "09:57", direction: "SB", train: "118", service: "regular" },
          ],
        },
        {
          id: "am-1049",
          stops: [
            { name: "Hillsdale", time: "10:49" },
            { name: "Chess", time: "10:57" },
            { name: "Lincoln", time: "11:02" },
            { name: "Bayside", time: "11:05" },
          ],
          connections: [
            { time: "10:12", direction: "NB", train: "119", service: "regular" },
            { time: "10:42", direction: "NB", train: "121", service: "regular" },
            { time: "10:27", direction: "SB", train: "120", service: "regular" },
          ],
        },
      ],
    },
    afternoon: {
      label: "Afternoon",
      kicker: "AFTERNOON SCHEDULE",
      connectionLabel: "Train departures",
      connectionDescription: "Train departures from Caltrain",
      trips: [
        {
          id: "pm-1600",
          stops: [
            { name: "Chess", time: "16:00" },
            { name: "Lincoln", time: "16:03" },
            { name: "Bayside", time: "16:08" },
            { name: "Caltrain", time: "16:20" },
          ],
          connections: [
            { time: "16:25", direction: "NB", train: "417", service: "limited" },
            { time: "16:42", direction: "NB", train: "145", service: "regular" },
            { time: "16:56", direction: "NB", train: "519", service: "bullet" },
            { time: "16:27", direction: "SB", train: "144", service: "regular" },
            { time: "16:46", direction: "SB", train: "518", service: "bullet" },
            { time: "16:57", direction: "SB", train: "146", service: "regular" },
          ],
        },
        {
          id: "pm-1625",
          stops: [
            { name: "Chess", time: "16:25" },
            { name: "Lincoln", time: "16:28" },
            { name: "Bayside", time: "16:33" },
            { name: "Caltrain", time: "16:48" },
          ],
          connections: [
            { time: "16:56", direction: "NB", train: "519", service: "bullet" },
            { time: "16:57", direction: "SB", train: "146", service: "regular" },
          ],
        },
        {
          id: "pm-1637",
          stops: [
            { name: "Chess", time: "16:37" },
            { name: "Lincoln", time: "16:40" },
            { name: "Bayside", time: "16:45" },
            { name: "Caltrain", time: "17:00" },
          ],
          connections: [
            { time: "17:12", direction: "NB", train: "147", service: "regular" },
            { time: "17:25", direction: "NB", train: "421", service: "limited" },
            { time: "17:15", direction: "SB", train: "420", service: "regular" },
            { time: "17:27", direction: "SB", train: "148", service: "regular" },
          ],
        },
        {
          id: "pm-1705",
          stops: [
            { name: "Chess", time: "17:05" },
            { name: "Lincoln", time: "17:08" },
            { name: "Bayside", time: "17:13" },
            { name: "Caltrain", time: "17:28" },
          ],
          connections: [
            { time: "17:25", direction: "NB", train: "421", service: "limited" },
            { time: "17:42", direction: "NB", train: "149", service: "regular" },
            { time: "17:46", direction: "SB", train: "522", service: "bullet" },
          ],
        },
        {
          id: "pm-1717",
          stops: [
            { name: "Chess", time: "17:17" },
            { name: "Lincoln", time: "17:20" },
            { name: "Bayside", time: "17:25" },
            { name: "Caltrain", time: "17:40" },
          ],
          connections: [
            { time: "17:42", direction: "NB", train: "149", service: "regular" },
            { time: "17:56", direction: "NB", train: "523", service: "bullet" },
            { time: "18:12", direction: "NB", train: "151", service: "regular" },
            { time: "18:25", direction: "NB", train: "425", service: "limited" },
            { time: "17:46", direction: "SB", train: "522", service: "bullet" },
          ],
        },
        {
          id: "pm-1745",
          stops: [
            { name: "Chess", time: "17:45" },
            { name: "Lincoln", time: "17:48" },
            { name: "Bayside", time: "17:53" },
            { name: "Caltrain", time: "18:08" },
          ],
          connections: [
            { time: "18:12", direction: "NB", train: "151", service: "regular" },
            { time: "18:25", direction: "NB", train: "425", service: "limited" },
            { time: "18:15", direction: "SB", train: "424", service: "limited" },
            { time: "18:27", direction: "SB", train: "152", service: "regular" },
          ],
        },
        {
          id: "pm-1757",
          stops: [
            { name: "Chess", time: "17:57" },
            { name: "Lincoln", time: "18:00" },
            { name: "Bayside", time: "18:05" },
            { name: "Caltrain", time: "18:20" },
          ],
          connections: [
            { time: "18:25", direction: "NB", train: "425", service: "limited" },
            { time: "18:42", direction: "NB", train: "153", service: "regular" },
            { time: "18:56", direction: "NB", train: "527", service: "bullet" },
            { time: "18:27", direction: "SB", train: "152", service: "regular" },
            { time: "18:46", direction: "SB", train: "526", service: "bullet" },
          ],
        },
        {
          id: "pm-1830",
          stops: [
            { name: "Chess", time: "18:30" },
            { name: "Lincoln", time: "18:33" },
            { name: "Bayside", time: "18:38" },
            { name: "Caltrain", time: "18:52" },
          ],
          connections: [
            { time: "18:56", direction: "NB", train: "527", service: "bullet" },
            { time: "19:12", direction: "NB", train: "155", service: "regular" },
            { time: "19:25", direction: "NB", train: "429", service: "limited" },
            { time: "18:57", direction: "SB", train: "154", service: "regular" },
          ],
        },
        {
          id: "pm-1907",
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
        },
      ],
    },
  },
};
