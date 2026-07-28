import { SCHEDULE } from "./schedule-data.js?v=7";
import { scheduleClock, serviceDayStatus } from "./service-calendar.js?v=7";

const CONNECTION_STYLES = {
  regular: { short: "R", label: "Regular" },
  bullet: { short: "B", label: "Bullet" },
  limited: { short: "L", label: "Limited" },
  orange: { short: "OR", label: "Orange Line" },
  green: { short: "GR", label: "Green Line" },
};

const tabs = [...document.querySelectorAll(".period-tab")];
const routeButtons = [...document.querySelectorAll(".route-option")];
const panel = document.querySelector("#schedule-panel");
const periodTitle = document.querySelector("#period-title");
const periodKicker = document.querySelector("#period-kicker");
const morningTabLabel = document.querySelector("#morning-tab-label");
const afternoonTabLabel = document.querySelector("#afternoon-tab-label");
const tripCount = document.querySelector("#trip-count");
const tripList = document.querySelector("#trip-list");
const routeContext = document.querySelector("#route-context");
const legend = document.querySelector("#legend");
const nextRide = document.querySelector("#next-ride");
const nextLabel = document.querySelector("#next-label");
const nextTime = document.querySelector("#next-time");
const nextCountdown = document.querySelector("#next-countdown");
const nextRoute = document.querySelector("#next-route");
const fullViewButton = document.querySelector("#full-view-button");
const fullScheduleDialog = document.querySelector("#full-schedule-dialog");
const originalDialogTitle = document.querySelector("#dialog-title");
const originalImage = document.querySelector("#original-image");
const installCard = document.querySelector(".install-card");
const installTitle = document.querySelector("#install-title");
const installPlatformLabel = document.querySelector("#install-platform");
const installButton = document.querySelector("#install-button");
const installHelp = document.querySelector("#install-help");
const installDialog = document.querySelector("#install-dialog");
const installDialogKicker = document.querySelector("#install-dialog-kicker");
const installDialogTitle = document.querySelector("#install-dialog-title");
const installDialogCopy = document.querySelector("#install-dialog-copy");
const installDialogSteps = document.querySelector("#install-dialog-steps");
const installDialogTip = document.querySelector("#install-dialog-tip");

let currentRouteKey = SCHEDULE.defaultRoute;
let currentView = "morning";
let installPrompt = null;

const standaloneMedia = window.matchMedia("(display-mode: standalone)");

function installationPlatform() {
  const userAgent = navigator.userAgent || "";
  const isAppleMobile = /iPad|iPhone|iPod/i.test(userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isAppleMobile) {
    return "ios";
  }
  if (/Android/i.test(userAgent)) {
    return "android";
  }
  return "other";
}

const devicePlatform = installationPlatform();

const INSTALL_GUIDES = {
  ios: {
    platform: "IPHONE & IPAD",
    cardTitle: "Install on iPhone or iPad",
    cardHelp: "Tap below for the quick Add to Home Screen steps.",
    button: "Install on iPhone / iPad",
    dialogTitle: "Add Zchedule to your Home Screen",
    dialogCopy: "iOS requires one quick confirmation from your browser’s Share menu.",
    steps: [
      ["Tap Share", "Use the square-with-up-arrow button in your browser toolbar."],
      ["Choose Add to Home Screen", "Scroll the Share menu if the option is not immediately visible."],
      ["Tap Add", "Keep “Open as Web App” turned on if that option appears."],
    ],
    tip: "If Add to Home Screen is missing, open this page in Safari and try again.",
  },
  android: {
    platform: "ANDROID",
    cardTitle: "Install Zchedule",
    cardHelp: "Tap once for the Android install prompt and one-tap access.",
    button: "Install on Android",
    dialogTitle: "Install Zchedule on Android",
    dialogCopy: "The native prompt is not available right now, but your browser menu works too.",
    steps: [
      ["Open the browser menu", "Use the menu button in your browser toolbar."],
      ["Choose Install app", "Some browsers label this “Add to Home screen.”"],
      ["Confirm Install", "Launch Zchedule from the new Z icon on your Home Screen."],
    ],
    tip: "Chrome provides the smoothest Android installation experience.",
  },
  other: {
    platform: "THIS DEVICE",
    cardTitle: "Keep Zchedule one tap away",
    cardHelp: "Use your browser’s app or home-screen option for faster access.",
    button: "Install app",
    dialogTitle: "Install Zchedule",
    dialogCopy: "Installation options vary by browser. This is the usual route.",
    steps: [
      ["Open the browser menu", "Look for the menu or Share button in your toolbar."],
      ["Choose Install app", "You may see “Add to Home Screen” or “Add to Dock” instead."],
      ["Confirm", "Open Zchedule from its new app icon."],
    ],
    tip: "If no install option appears, open this page in Chrome, Edge, or Safari.",
  },
};

function isStandalone() {
  return standaloneMedia.matches || navigator.standalone === true;
}

function syncInstallUI() {
  if (isStandalone()) {
    installCard.hidden = true;
    return;
  }

  const guide = INSTALL_GUIDES[devicePlatform];
  installCard.hidden = false;
  installCard.dataset.platform = devicePlatform;
  installPlatformLabel.textContent = guide.platform;
  installTitle.textContent = guide.cardTitle;
  installHelp.textContent = installPrompt
    ? "Ready to install. Tap below to open the native prompt."
    : guide.cardHelp;
  installButton.textContent = guide.button;
  installButton.disabled = false;
  installButton.hidden = false;
}

function showInstallGuide() {
  const guide = INSTALL_GUIDES[devicePlatform];
  installDialogKicker.textContent = guide.platform;
  installDialogTitle.textContent = guide.dialogTitle;
  installDialogCopy.textContent = guide.dialogCopy;
  installDialogTip.textContent = guide.tip;
  installDialogSteps.replaceChildren(
    ...guide.steps.map(([title, copy], index) => {
      const item = document.createElement("li");
      const number = document.createElement("span");
      const content = document.createElement("span");
      const heading = document.createElement("strong");
      const detail = document.createElement("span");

      number.className = "install-step__number";
      number.textContent = String(index + 1).padStart(2, "0");
      content.className = "install-step__content";
      heading.textContent = title;
      detail.textContent = copy;
      content.append(heading, detail);
      item.append(number, content);
      return item;
    }),
  );
  installDialog.showModal();
  installDialogTitle.focus({ preventScroll: true });
}

function routeFromLocation({ useSavedRoute = true } = {}) {
  const requestedRoute = new URLSearchParams(window.location.search).get("route");
  if (requestedRoute && requestedRoute in SCHEDULE.routes) {
    return requestedRoute;
  }
  if (requestedRoute) {
    return SCHEDULE.defaultRoute;
  }

  if (useSavedRoute) {
    try {
      const savedRoute = window.localStorage.getItem("zchedule-route");
      if (savedRoute && savedRoute in SCHEDULE.routes) {
        return savedRoute;
      }
    } catch {
      // Storage can be unavailable in private browsing; the default route still works.
    }
  }

  return SCHEDULE.defaultRoute;
}

function viewFromLocation(routeKey) {
  const route = SCHEDULE.routes[routeKey];
  const hashView = window.location.hash.slice(1).toLowerCase().split("/").at(-1);
  if (hashView in route.periods) {
    return hashView;
  }
  const clock = scheduleClock(new Date(), SCHEDULE.service.timeZone);
  return clock.hour < 12 ? "morning" : "afternoon";
}

function syncLocation(routeKey, view) {
  const url = new URL(window.location.href);
  url.searchParams.set("route", routeKey);
  url.hash = view;
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function originalImageFor(route, view) {
  if (!Array.isArray(route.originalImages)) {
    return route.originalImages[view];
  }
  if (route.originalImages.length === 1) {
    return route.originalImages[0];
  }
  return route.originalImages[view === "morning" ? 0 : 1];
}

function minutesFromMidnight(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function timeParts(value) {
  if (!value) {
    return { clock: "—", period: "" };
  }
  const [hoursText, minutes] = value.split(":");
  const hours = Number(hoursText);
  return {
    clock: `${hours % 12 || 12}:${minutes}`,
    period: hours < 12 ? "AM" : "PM",
  };
}

function displayTime(value, includePeriod = true) {
  if (!value) {
    return "—";
  }
  const { clock, period } = timeParts(value);
  return includePeriod ? `${clock} ${period}` : clock;
}

function nextTripFor(period, nowMinutes) {
  return period.trips.find((trip) => minutesFromMidnight(trip.stops[0].time) >= nowMinutes) ?? null;
}

function countdownFor(time, nowMinutes) {
  const difference = minutesFromMidnight(time) - nowMinutes;
  if (difference <= 1) {
    return "Leaving soon";
  }
  if (difference < 60) {
    return `In ${difference} min`;
  }

  const hours = Math.floor(difference / 60);
  const minutes = difference % 60;
  return minutes ? `In ${hours} hr ${minutes} min` : `In ${hours} hr`;
}

function tripDuration(trip) {
  const firstStop = trip.stops[0];
  const lastStop = trip.stops.at(-1);
  if (!firstStop.time || !lastStop.time) {
    return null;
  }
  const first = minutesFromMidnight(firstStop.time);
  const last = minutesFromMidnight(lastStop.time);
  return last - first;
}

function connectionChip(connection) {
  const tone = connection.service || connection.line || "regular";
  const style = CONNECTION_STYLES[tone] || CONNECTION_STYLES.regular;
  const badge = connection.train ? style.short : connection.direction;
  const accessibleLabel = [
    displayTime(connection.time),
    style.label,
    connection.direction,
    connection.train ? `train ${connection.train}` : "",
  ].filter(Boolean).join(" ");
  return `
    <span class="train-chip train-chip--${tone} ${connection.train ? "" : "train-chip--compact"}" aria-label="${accessibleLabel}">
      <time datetime="${connection.time}">${displayTime(connection.time, false)}</time>
      ${connection.train ? `<span class="train-chip__number">${connection.train}</span>` : ""}
      <i aria-hidden="true">${badge}</i>
    </span>
  `;
}

function connectionRow(group, connections) {
  const matchingConnections = connections.filter(
    (connection) => (connection.group || connection.direction) === group.key,
  );
  if (!matchingConnections.length) {
    return "";
  }

  return `
    <div class="connection-row">
      <span class="direction-badge direction-badge--${group.tone}">${group.label}</span>
      <div class="connection-chips">${matchingConnections.map(connectionChip).join("")}</div>
    </div>
  `;
}

function stopTimeline(stops) {
  const accessibleRoute = stops
    .map((stop) => `${stop.name} ${stop.time ? displayTime(stop.time) : stop.note || "time not listed"}`)
    .join(", ");

  if (stops.length > 4) {
    return `
      <details class="route-details">
        <summary>
          <span>${stops.length} stops</span>
          <strong>View full route</strong>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 9 5 5 5-5" /></svg>
        </summary>
        <ol class="route-stop-list" aria-label="${accessibleRoute}">
          ${stops
            .map(
              (stop, index) => `
                <li class="${index === 0 ? "route-stop-list__origin" : ""} ${
                  index === stops.length - 1 ? "route-stop-list__destination" : ""
                }">
                  <span class="route-stop-list__index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
                  <span class="route-stop-list__name">
                    ${stop.name}
                    ${stop.note ? `<small>${stop.note}</small>` : ""}
                  </span>
                  ${
                    stop.time
                      ? `<time datetime="${stop.time}">${displayTime(stop.time)}</time>`
                      : `<span class="route-stop-list__missing">—</span>`
                  }
                </li>
              `,
            )
            .join("")}
        </ol>
      </details>
    `;
  }

  return `
    <div class="route-timeline" style="--stop-count: ${stops.length}" aria-label="${accessibleRoute}">
      ${stops
        .map(
          (stop, index) => `
            <div class="route-stop ${index === 0 ? "route-stop--origin" : ""} ${
              index === stops.length - 1 ? "route-stop--destination" : ""
            }">
              <span class="route-stop__marker" aria-hidden="true"></span>
              <span class="route-stop__name">${stop.name}</span>
              ${
                stop.time
                  ? `<time datetime="${stop.time}">${displayTime(stop.time, false)}</time>`
                  : `<span class="route-stop__missing">—</span>`
              }
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function connectionSection(period, route, connections) {
  if (!connections.length) {
    return "";
  }

  return `
    <section class="connections" aria-label="${period.connectionDescription}">
      <div class="connections__heading">
        <span>${period.connectionLabel}</span>
        <span>${connections.length} connections</span>
      </div>
      ${route.connectionGroups.map((group) => connectionRow(group, connections)).join("")}
    </section>
  `;
}

function tripCard(trip, index, period, route, nextTrip) {
  const origin = trip.stops[0];
  const destination = trip.stops.at(-1);
  const departure = timeParts(origin.time);
  const arrival = timeParts(destination.time);
  const duration = tripDuration(trip);
  const isNext = nextTrip?.id === trip.id;

  return `
    <article class="trip-card ${isNext ? "trip-card--next" : ""}" role="listitem" id="${trip.id}">
      <header class="trip-card__top">
        <div class="ride-index">
          <span>${isNext ? "NEXT" : "RIDE"}</span>
          <strong>${String(index + 1).padStart(2, "0")}</strong>
        </div>
        <div class="trip-card__departure">
          <p>Depart ${origin.name}</p>
          <time datetime="${origin.time}">${departure.clock}<small>${departure.period}</small></time>
        </div>
        <div class="trip-card__arrow" aria-hidden="true">
          <span>${duration === null ? "No ETA" : `${duration} min`}</span>
          <svg viewBox="0 0 64 16"><path d="M1 8h60m-7-6 7 6-7 6" /></svg>
        </div>
        <div class="trip-card__arrival">
          <p>Arrive ${destination.name}</p>
          ${
            destination.time
              ? `<time datetime="${destination.time}">${arrival.clock}<small>${arrival.period}</small></time>`
              : `<span class="trip-card__missing-time" title="${destination.note || "Time not listed"}">—</span>`
          }
        </div>
      </header>

      ${stopTimeline(trip.stops)}

      ${connectionSection(period, route, trip.connections || [])}
    </article>
  `;
}

function renderNext(period, nextTrip, status) {
  if (!status.active) {
    const holidaySuffix = status.observed ? " (observed)" : "";
    const detail = status.reason === "weekend"
      ? "Weekend · Weekday schedule only."
      : `${status.label}${holidaySuffix} · Weekday schedule only.`;

    nextRide.dataset.state = "inactive";
    nextLabel.textContent = "SERVICE STATUS";
    nextTime.removeAttribute("datetime");
    nextTime.textContent = "—";
    nextCountdown.textContent = "No service today";
    nextRoute.textContent = detail;
    return;
  }

  if (!nextTrip) {
    nextRide.dataset.state = "finished";
    nextLabel.textContent = "SERVICE STATUS";
    nextTime.removeAttribute("datetime");
    nextTime.textContent = "—";
    nextCountdown.textContent = currentView === "morning" ? "Morning service ended" : "Service ended today";
    nextRoute.textContent = "Browse every scheduled run below.";
    return;
  }

  const origin = nextTrip.stops[0];
  const destination = nextTrip.stops.at(-1);
  nextRide.dataset.state = "active";
  nextLabel.textContent = "UP NEXT · SCHEDULED TIME";
  nextTime.dateTime = origin.time;
  nextTime.textContent = displayTime(origin.time);
  nextCountdown.textContent = countdownFor(origin.time, status.minutes);
  nextRoute.textContent = `${origin.name} → ${destination.name}`;
}

function renderLegend(route) {
  const items = route.legends || [];
  legend.hidden = items.length === 0;
  legend.innerHTML = items
    .map(
      (item) => `
        <span><i class="service-badge service-badge--${item.tone}">${item.short}</i>${item.label}</span>
      `,
    )
    .join("");
}

function formatEffectiveDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
    .format(new Date(`${value}T00:00:00`))
    .toUpperCase();
}

function renderPeriod(routeKey, view) {
  const route = SCHEDULE.routes[routeKey];
  const period = route.periods[view];
  const status = serviceDayStatus(new Date(), SCHEDULE.service);
  const nextTrip = status.active ? nextTripFor(period, status.minutes) : null;
  const expandedTrips = [...tripList.querySelectorAll(".route-details[open]")]
    .map((details) => details.closest(".trip-card")?.id)
    .filter(Boolean);

  panel.dataset.route = routeKey;
  periodTitle.textContent = route.label;
  periodKicker.textContent = period.kicker;
  tripCount.textContent = `${period.trips.length} rides`;
  routeContext.textContent = `${route.label.toUpperCase()} · ${
    route.effectiveDate ? formatEffectiveDate(route.effectiveDate) : "WEEKDAY SERVICE"
  }`;
  renderLegend(route);
  tripList.innerHTML = period.trips
    .map((trip, index) => tripCard(trip, index, period, route, nextTrip))
    .join("");
  expandedTrips.forEach((tripId) => {
    document.getElementById(tripId)?.querySelector(".route-details")?.setAttribute("open", "");
  });
  renderNext(period, nextTrip, status);
}

function refreshLiveState() {
  const period = SCHEDULE.routes[currentRouteKey].periods[currentView];
  const status = serviceDayStatus(new Date(), SCHEDULE.service);
  const nextTrip = status.active ? nextTripFor(period, status.minutes) : null;

  tripList.querySelectorAll(".trip-card").forEach((card) => {
    const isNext = card.id === nextTrip?.id;
    card.classList.toggle("trip-card--next", isNext);
    const rideLabel = card.querySelector(".ride-index span");
    if (rideLabel) {
      rideLabel.textContent = isNext ? "NEXT" : "RIDE";
    }
  });

  renderNext(period, nextTrip, status);
}

function applySelection(routeKey, view, { syncUrl = true, focusTab = false } = {}) {
  if (!(routeKey in SCHEDULE.routes)) {
    return;
  }

  const route = SCHEDULE.routes[routeKey];
  if (!(view in route.periods)) {
    view = viewFromLocation(routeKey);
  }

  currentRouteKey = routeKey;
  currentView = view;
  routeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.route === routeKey));
  });

  morningTabLabel.textContent = route.periods.morning.label;
  afternoonTabLabel.textContent = route.periods.afternoon.label;
  tabs.forEach((tab) => {
    const selected = tab.dataset.view === view;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focusTab) {
      tab.focus();
    }
  });

  panel.setAttribute("aria-labelledby", `${view}-tab`);
  renderPeriod(routeKey, view);

  try {
    window.localStorage.setItem("zchedule-route", routeKey);
  } catch {
    // The route remains available for this visit if storage is unavailable.
  }

  if (syncUrl) {
    syncLocation(routeKey, view);
  }
}

routeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applySelection(button.dataset.route, currentView);
  });
});

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    applySelection(currentRouteKey, tab.dataset.view);
  });

  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + tabs.length) % tabs.length;
    applySelection(currentRouteKey, tabs[nextIndex].dataset.view, { focusTab: true });
  });
});

function applyLocationState() {
  const routeKey = routeFromLocation({ useSavedRoute: false });
  applySelection(routeKey, viewFromLocation(routeKey), { syncUrl: false });
}

window.addEventListener("hashchange", applyLocationState);
window.addEventListener("popstate", applyLocationState);

fullViewButton.addEventListener("click", () => {
  const route = SCHEDULE.routes[currentRouteKey];
  const period = route.periods[currentView];
  originalDialogTitle.textContent = `${route.label} · ${period.label} original`;
  originalImage.src = originalImageFor(route, currentView);
  originalImage.alt = `${route.label} ${period.label} original timetable`;
  fullScheduleDialog.showModal();
});

fullScheduleDialog.addEventListener("click", (event) => {
  if (event.target === fullScheduleDialog) {
    fullScheduleDialog.close();
  }
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  syncInstallUI();
});

installButton.addEventListener("click", async () => {
  if (isStandalone()) {
    installCard.hidden = true;
    return;
  }

  if (!installPrompt) {
    showInstallGuide();
    return;
  }

  const promptEvent = installPrompt;
  installPrompt = null;
  installButton.disabled = true;
  installButton.textContent = "Opening install…";

  try {
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") {
      installHelp.textContent = "Finishing installation…";
      installButton.hidden = true;
      return;
    }

    installHelp.textContent = "You can install anytime from your browser menu.";
    installButton.textContent = "Show install steps";
  } catch {
    syncInstallUI();
    showInstallGuide();
  } finally {
    installButton.disabled = false;
  }
});

window.addEventListener("appinstalled", () => {
  installPrompt = null;
  installCard.hidden = true;
});

installDialog.addEventListener("click", (event) => {
  if (event.target === installDialog) {
    installDialog.close();
  }
});

standaloneMedia.addEventListener?.("change", syncInstallUI);
window.addEventListener("pageshow", syncInstallUI);
syncInstallUI();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" }).catch(() => {
      // The page remains usable online when service worker registration is unavailable.
    });
  });
}

const initialRoute = routeFromLocation();
applySelection(initialRoute, viewFromLocation(initialRoute));
window.setInterval(refreshLiveState, 60_000);
