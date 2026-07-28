export const SCHEDULE = {
  defaultRoute: "hillsdale",
  service: {
    timeZone: "America/Los_Angeles",
    extraClosureDates: [
      // Add company-specific closures as { date: "YYYY-MM-DD", label: "Company holiday" }.
    ],
  },
  routes: {
    hillsdale: {
      label: "Hillsdale",
      effectiveDate: "2026-01-05",
      originalImages: ["./original_images/hillsdale.png"],
      legends: [
        { tone: "regular", short: "R", label: "Regular" },
        { tone: "bullet", short: "B", label: "Bullet" },
        { tone: "limited", short: "L", label: "Limited" },
      ],
      connectionGroups: [
        { key: "NB", label: "NB", tone: "nb" },
        { key: "SB", label: "SB", tone: "sb" },
      ],
      periods: {
        morning: {
          label: "Morning",
          kicker: "MORNING SCHEDULE",
          connectionLabel: "Train arrivals",
          connectionDescription: "Train arrivals at Hillsdale",
          trips: [
            {
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
            },
            {
              id: "hillsdale-am-0752",
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
              id: "hillsdale-am-0819",
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
              id: "hillsdale-am-0837",
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
              id: "hillsdale-am-0903",
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
              id: "hillsdale-am-0920",
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
              id: "hillsdale-am-0945",
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
              id: "hillsdale-am-1005",
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
              id: "hillsdale-am-1049",
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
              id: "hillsdale-pm-1600",
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
              id: "hillsdale-pm-1625",
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
              id: "hillsdale-pm-1637",
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
              id: "hillsdale-pm-1705",
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
              id: "hillsdale-pm-1717",
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
              id: "hillsdale-pm-1745",
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
              id: "hillsdale-pm-1757",
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
              id: "hillsdale-pm-1830",
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
            },
          ],
        },
      },
    },
    "north-foster-city": {
      label: "North Foster City",
      originalImages: [
        "./original_images/north-foster-city-morning.png",
        "./original_images/north-foster-city-afternoon.png",
      ],
      legends: [
        { tone: "am-only", short: "AM", label: "Morning-only stop" },
        { tone: "pm-only", short: "PM", label: "Afternoon-only stop" },
      ],
      connectionGroups: [],
      periods: {
        morning: {
          label: "Morning",
          kicker: "WEEKDAY · MORNING",
          trips: [
            {
              id: "north-foster-city-am-run-1",
              stops: [
                { name: "Millbrae Intermodal Station (East)", time: "06:32" },
                { name: "E. 3rd Ave & S. Norfolk (SE Corner)", time: "06:41" },
                { name: "300-310 Lakeside", time: "06:45" },
                { name: "324 Lakeside", time: "06:47", note: "AM only" },
                { name: "1149 Chess Drive", time: "06:52" },
                { name: "200 Lincoln Centre", time: "06:55" },
                { name: "E. 3rd Ave. & Lincoln Centre", time: "06:55" },
                { name: "Cul-de-Sac (4000/4001 E. 3rd Ave.)", time: "06:57" },
                {
                  name: "Bridgepointe Circle & Bridgepointe Pkwy",
                  time: "07:03",
                  note: "AM only",
                },
                { name: "Millbrae Intermodal Station (East)", time: "07:21" },
              ],
            },
            {
              id: "north-foster-city-am-run-2",
              stops: [
                { name: "Millbrae Intermodal Station (East)", time: "07:32" },
                { name: "E. 3rd Ave & S. Norfolk (SE Corner)", time: "07:41" },
                { name: "300-310 Lakeside", time: "07:45" },
                { name: "324 Lakeside", time: "07:47", note: "AM only" },
                { name: "1149 Chess Drive", time: "07:52" },
                { name: "200 Lincoln Centre", time: "07:55" },
                { name: "E. 3rd Ave. & Lincoln Centre", time: "07:55" },
                { name: "Cul-de-Sac (4000/4001 E. 3rd Ave.)", time: "07:57" },
                {
                  name: "Bridgepointe Circle & Bridgepointe Pkwy",
                  time: "08:03",
                  note: "AM only",
                },
                { name: "Millbrae Intermodal Station (East)", time: "08:21" },
              ],
            },
            {
              id: "north-foster-city-am-run-3",
              stops: [
                { name: "Millbrae Intermodal Station (East)", time: "08:32" },
                { name: "E. 3rd Ave & S. Norfolk (SE Corner)", time: "08:41" },
                { name: "300-310 Lakeside", time: "08:45" },
                { name: "324 Lakeside", time: "08:47", note: "AM only" },
                { name: "1149 Chess Drive", time: "08:52" },
                { name: "200 Lincoln Centre", time: "08:55" },
                { name: "E. 3rd Ave. & Lincoln Centre", time: "08:55" },
                { name: "Cul-de-Sac (4000/4001 E. 3rd Ave.)", time: "08:57" },
                {
                  name: "Bridgepointe Circle & Bridgepointe Pkwy",
                  time: "09:03",
                  note: "AM only",
                },
                { name: "Millbrae Intermodal Station (East)", time: "09:21" },
              ],
            },
            {
              id: "north-foster-city-am-run-4",
              stops: [
                { name: "Millbrae Intermodal Station (East)", time: "09:21" },
                { name: "E. 3rd Ave & S. Norfolk (SE Corner)", time: "09:30" },
                { name: "300-310 Lakeside", time: "09:34" },
                { name: "324 Lakeside", time: "09:36", note: "AM only" },
                { name: "1149 Chess Drive", time: "09:41" },
                { name: "200 Lincoln Centre", time: "09:44" },
                { name: "E. 3rd Ave. & Lincoln Centre", time: "09:44" },
                { name: "Cul-de-Sac (4000/4001 E. 3rd Ave.)", time: "09:46" },
                {
                  name: "Bridgepointe Circle & Bridgepointe Pkwy",
                  time: "09:52",
                  note: "AM only",
                },
                {
                  name: "Millbrae Intermodal Station (East)",
                  time: null,
                  note: "No return time listed",
                },
              ],
            },
          ],
        },
        afternoon: {
          label: "Afternoon",
          kicker: "WEEKDAY · AFTERNOON",
          trips: [
            {
              id: "north-foster-city-pm-run-1",
              stops: [
                { name: "Millbrae Intermodal Station (East)", time: "15:49" },
                {
                  name: "Bridgepointe Pkwy & Chess Dr",
                  time: "16:07",
                  note: "PM only",
                },
                { name: "1149 Chess Drive", time: "16:11" },
                { name: "200 Lincoln Centre", time: "16:14" },
                { name: "E. 3rd Ave. & Lincoln Centre", time: "16:14" },
                { name: "Cul-de-Sac (4000/4001 E. 3rd Ave.)", time: "16:16" },
                { name: "353 Lakeside", time: "16:21", note: "PM only" },
                { name: "300-310 Lakeside", time: "16:23" },
                { name: "E. 3rd Ave & S. Norfolk (NE Corner)", time: "16:27" },
                { name: "Millbrae Intermodal Station (East)", time: "16:44" },
              ],
            },
            {
              id: "north-foster-city-pm-run-2",
              stops: [
                { name: "Millbrae Intermodal Station (East)", time: "16:49" },
                {
                  name: "Bridgepointe Pkwy & Chess Dr",
                  time: "17:07",
                  note: "PM only",
                },
                { name: "1149 Chess Drive", time: "17:11" },
                { name: "200 Lincoln Centre", time: "17:14" },
                { name: "E. 3rd Ave. & Lincoln Centre", time: "17:14" },
                { name: "Cul-de-Sac (4000/4001 E. 3rd Ave.)", time: "17:16" },
                { name: "353 Lakeside", time: "17:21", note: "PM only" },
                { name: "300-310 Lakeside", time: "17:23" },
                { name: "E. 3rd Ave & S. Norfolk (NE Corner)", time: "17:27" },
                { name: "Millbrae Intermodal Station (East)", time: "17:44" },
              ],
            },
            {
              id: "north-foster-city-pm-run-3",
              stops: [
                { name: "Millbrae Intermodal Station (East)", time: "18:00" },
                {
                  name: "Bridgepointe Pkwy & Chess Dr",
                  time: "18:18",
                  note: "PM only",
                },
                { name: "1149 Chess Drive", time: "18:22" },
                { name: "200 Lincoln Centre", time: "18:25" },
                { name: "E. 3rd Ave. & Lincoln Centre", time: "18:25" },
                { name: "Cul-de-Sac (4000/4001 E. 3rd Ave.)", time: "18:27" },
                { name: "353 Lakeside", time: "18:32", note: "PM only" },
                { name: "300-310 Lakeside", time: "18:34" },
                { name: "E. 3rd Ave & S. Norfolk (NE Corner)", time: "18:38" },
                { name: "Millbrae Intermodal Station (East)", time: "18:55" },
              ],
            },
          ],
        },
      },
    },
    fremont: {
      label: "Fremont",
      originalImages: ["./original_images/fremont.png"],
      legends: [
        { tone: "orange", short: "OR", label: "Orange Line" },
        { tone: "green", short: "GR", label: "Green Line" },
      ],
      connectionGroups: [
        { key: "orange", label: "OR", tone: "orange" },
        { key: "green", label: "GR", tone: "green" },
      ],
      periods: {
        morning: {
          label: "Morning",
          kicker: "MORNING SCHEDULE",
          connectionLabel: "Train arrivals",
          connectionDescription: "Listed BART arrival times",
          trips: [
            {
              id: "fremont-am-0745",
              stops: [
                { name: "BART Station", time: "07:45" },
                { name: "Kato", time: "07:55" },
              ],
              connections: [
                { time: "07:32", group: "orange", direction: "S", line: "orange" },
                { time: "07:28", group: "orange", direction: "N", line: "orange" },
                { time: "07:37", group: "green", direction: "S", line: "green" },
                { time: "07:25", group: "green", direction: "N", line: "green" },
              ],
            },
            {
              id: "fremont-am-0805",
              stops: [
                { name: "BART Station", time: "08:05" },
                { name: "Kato", time: "08:15" },
              ],
              connections: [
                { time: "07:52", group: "orange", direction: "S", line: "orange" },
                { time: "07:48", group: "orange", direction: "N", line: "orange" },
                { time: "07:57", group: "green", direction: "S", line: "green" },
                { time: "07:45", group: "green", direction: "N", line: "green" },
              ],
            },
            {
              id: "fremont-am-0825",
              stops: [
                { name: "BART Station", time: "08:25" },
                { name: "Kato", time: "08:35" },
              ],
              connections: [
                { time: "08:12", group: "orange", direction: "S", line: "orange" },
                { time: "08:08", group: "orange", direction: "N", line: "orange" },
                { time: "08:17", group: "green", direction: "S", line: "green" },
                { time: "08:05", group: "green", direction: "N", line: "green" },
              ],
            },
            {
              id: "fremont-am-0845",
              stops: [
                { name: "BART Station", time: "08:45" },
                { name: "Kato", time: "08:55" },
              ],
              connections: [
                { time: "08:32", group: "orange", direction: "S", line: "orange" },
                { time: "08:28", group: "orange", direction: "N", line: "orange" },
                { time: "08:37", group: "green", direction: "S", line: "green" },
                { time: "08:25", group: "green", direction: "N", line: "green" },
              ],
            },
            {
              id: "fremont-am-0905",
              stops: [
                { name: "BART Station", time: "09:05" },
                { name: "Kato", time: "09:15" },
              ],
              connections: [
                { time: "08:52", group: "orange", direction: "S", line: "orange" },
                { time: "08:48", group: "orange", direction: "N", line: "orange" },
                { time: "08:57", group: "green", direction: "S", line: "green" },
                { time: "08:45", group: "green", direction: "N", line: "green" },
              ],
            },
            {
              id: "fremont-am-0925",
              stops: [
                { name: "BART Station", time: "09:25" },
                { name: "Kato", time: "09:35" },
              ],
              connections: [
                { time: "09:12", group: "orange", direction: "S", line: "orange" },
                { time: "09:08", group: "orange", direction: "N", line: "orange" },
                { time: "09:17", group: "green", direction: "S", line: "green" },
                { time: "09:05", group: "green", direction: "N", line: "green" },
              ],
            },
          ],
        },
        afternoon: {
          label: "Evening",
          kicker: "EVENING SCHEDULE",
          connectionLabel: "Train departures",
          connectionDescription: "Listed BART departure times",
          trips: [
            {
              id: "fremont-pm-1640",
              stops: [
                { name: "Kato", time: "16:40" },
                { name: "BART Station", time: "16:53" },
              ],
              connections: [
                { time: "16:52", group: "orange", direction: "S", line: "orange" },
                { time: "16:48", group: "orange", direction: "N", line: "orange" },
                { time: "16:57", group: "green", direction: "S", line: "green" },
                { time: "17:05", group: "green", direction: "N", line: "green" },
              ],
            },
            {
              id: "fremont-pm-1710",
              stops: [
                { name: "Kato", time: "17:10" },
                { name: "BART Station", time: "17:23" },
              ],
              connections: [
                { time: "17:32", group: "orange", direction: "S", line: "orange" },
                { time: "17:28", group: "orange", direction: "N", line: "orange" },
                { time: "17:17", group: "green", direction: "S", line: "green" },
                { time: "17:25", group: "green", direction: "N", line: "green" },
              ],
            },
            {
              id: "fremont-pm-1740",
              stops: [
                { name: "Kato", time: "17:40" },
                { name: "BART Station", time: "17:53" },
              ],
              connections: [
                { time: "17:52", group: "orange", direction: "S", line: "orange" },
                { time: "17:48", group: "orange", direction: "N", line: "orange" },
                { time: "17:57", group: "green", direction: "S", line: "green" },
                { time: "18:05", group: "green", direction: "N", line: "green" },
              ],
            },
            {
              id: "fremont-pm-1810",
              stops: [
                { name: "Kato", time: "18:10" },
                { name: "BART Station", time: "18:23" },
              ],
              connections: [
                { time: "18:32", group: "orange", direction: "S", line: "orange" },
                { time: "18:29", group: "orange", direction: "N", line: "orange" },
                { time: "18:17", group: "green", direction: "S", line: "green" },
                { time: "18:25", group: "green", direction: "N", line: "green" },
              ],
            },
            {
              id: "fremont-pm-1840",
              stops: [
                { name: "Kato", time: "18:40" },
                { name: "BART Station", time: "18:53" },
              ],
              connections: [
                { time: "18:52", group: "orange", direction: "S", line: "orange" },
                { time: "18:48", group: "orange", direction: "N", line: "orange" },
                { time: "18:57", group: "green", direction: "S", line: "green" },
                { time: "19:05", group: "green", direction: "N", line: "green" },
              ],
            },
            {
              id: "fremont-pm-1910",
              stops: [
                { name: "Kato", time: "19:10" },
                { name: "BART Station", time: "19:23" },
              ],
              connections: [
                { time: "19:32", group: "orange", direction: "S", line: "orange" },
                { time: "19:52", group: "orange", direction: "S", line: "orange" },
                { time: "19:28", group: "orange", direction: "N", line: "orange" },
                { time: "19:25", group: "green", direction: "N", line: "green" },
              ],
            },
          ],
        },
      },
    },
    bart: {
      label: "BART",
      originalImages: ["./original_images/bart.png"],
      legends: [
        { tone: "orange", short: "OR", label: "Orange Line" },
        { tone: "green", short: "GR", label: "Green Line" },
      ],
      connectionGroups: [
        { key: "orange", label: "OR", tone: "orange" },
        { key: "green", label: "GR", tone: "green" },
      ],
      periods: {
        morning: {
          label: "Morning",
          kicker: "MORNING SCHEDULE",
          connectionLabel: "Train arrivals",
          connectionDescription: "Listed BART arrival times",
          trips: [
            {
              id: "bart-am-0710",
              stops: [
                { name: "BART Station", time: "07:10" },
                { name: "Clawiter", time: "07:30" },
              ],
              connections: [
                { time: "06:52", group: "orange", direction: "S", line: "orange" },
                { time: "06:48", group: "orange", direction: "N", line: "orange" },
                { time: "07:08", group: "orange", direction: "N", line: "orange" },
                { time: "06:45", group: "green", direction: "S", line: "green" },
                { time: "07:05", group: "green", direction: "S", line: "green" },
                { time: "06:56", group: "green", direction: "N", line: "green" },
              ],
            },
            {
              id: "bart-am-0745",
              stops: [
                { name: "BART Station", time: "07:45" },
                { name: "Clawiter", time: "08:00" },
              ],
              connections: [
                { time: "07:32", group: "orange", direction: "S", line: "orange" },
                { time: "07:48", group: "orange", direction: "N", line: "orange" },
                { time: "07:45", group: "green", direction: "S", line: "green" },
                { time: "07:36", group: "green", direction: "N", line: "green" },
              ],
            },
            {
              id: "bart-am-0830",
              stops: [
                { name: "BART Station", time: "08:30" },
                { name: "Clawiter", time: "08:50" },
              ],
              connections: [
                { time: "08:12", group: "orange", direction: "S", line: "orange" },
                { time: "08:28", group: "orange", direction: "N", line: "orange" },
                { time: "08:25", group: "green", direction: "S", line: "green" },
                { time: "08:16", group: "green", direction: "N", line: "green" },
              ],
            },
            {
              id: "bart-am-0910",
              stops: [
                { name: "BART Station", time: "09:10" },
                { name: "Clawiter", time: "09:30" },
              ],
              connections: [
                { time: "08:52", group: "orange", direction: "S", line: "orange" },
                { time: "09:08", group: "orange", direction: "N", line: "orange" },
                { time: "09:05", group: "green", direction: "S", line: "green" },
                { time: "08:56", group: "green", direction: "N", line: "green" },
              ],
            },
            {
              id: "bart-am-0950",
              stops: [
                { name: "BART Station", time: "09:50" },
                { name: "Clawiter", time: "10:10" },
              ],
              connections: [
                { time: "09:32", group: "orange", direction: "S", line: "orange" },
                { time: "09:48", group: "orange", direction: "N", line: "orange" },
                { time: "09:45", group: "green", direction: "S", line: "green" },
                { time: "09:36", group: "green", direction: "N", line: "green" },
              ],
            },
          ],
        },
        afternoon: {
          label: "Evening",
          kicker: "EVENING SCHEDULE",
          connectionLabel: "Train departures",
          connectionDescription: "Listed BART departure times",
          trips: [
            {
              id: "bart-pm-1545",
              stops: [
                { name: "Clawiter", time: "15:45" },
                { name: "BART Station", time: "16:05" },
              ],
              connections: [
                { time: "16:52", group: "orange", direction: "S", line: "orange" },
                { time: "16:48", group: "orange", direction: "N", line: "orange" },
                { time: "16:56", group: "green", direction: "S", line: "green" },
                { time: "17:05", group: "green", direction: "N", line: "green" },
              ],
            },
            {
              id: "bart-pm-1630",
              stops: [
                { name: "Clawiter", time: "16:30" },
                { name: "BART Station", time: "16:50" },
              ],
              connections: [
                { time: "17:32", group: "orange", direction: "S", line: "orange" },
                { time: "17:28", group: "orange", direction: "N", line: "orange" },
                { time: "17:16", group: "green", direction: "S", line: "green" },
                { time: "17:25", group: "green", direction: "N", line: "green" },
              ],
            },
            {
              id: "bart-pm-1715",
              stops: [
                { name: "Clawiter", time: "17:15" },
                { name: "BART Station", time: "17:35" },
              ],
              connections: [
                { time: "17:52", group: "orange", direction: "S", line: "orange" },
                { time: "17:48", group: "orange", direction: "N", line: "orange" },
                { time: "17:56", group: "green", direction: "S", line: "green" },
                { time: "18:05", group: "green", direction: "N", line: "green" },
              ],
            },
            {
              id: "bart-pm-1800",
              stops: [
                { name: "Clawiter", time: "18:00" },
                { name: "BART Station", time: "18:20" },
              ],
              connections: [
                { time: "18:32", group: "orange", direction: "S", line: "orange" },
                { time: "18:28", group: "orange", direction: "N", line: "orange" },
                { time: "18:16", group: "green", direction: "S", line: "green" },
                { time: "18:25", group: "green", direction: "N", line: "green" },
              ],
            },
            {
              id: "bart-pm-1845",
              stops: [
                { name: "Clawiter", time: "18:45" },
                { name: "BART Station", time: "19:05" },
              ],
              connections: [
                { time: "18:52", group: "orange", direction: "S", line: "orange" },
                { time: "18:48", group: "orange", direction: "N", line: "orange" },
                { time: "18:56", group: "green", direction: "S", line: "green" },
                { time: "19:05", group: "green", direction: "N", line: "green" },
              ],
            },
          ],
        },
      },
    },
  },
};
