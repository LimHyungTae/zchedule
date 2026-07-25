import { SCHEDULE } from "./schedule-data.js";

const SERVICE_STYLES = {
  regular: { short: "R", label: "Regular" },
  bullet: { short: "B", label: "Bullet" },
  limited: { short: "L", label: "Limited" },
};

const tabs = [...document.querySelectorAll(".period-tab")];
const panel = document.querySelector("#schedule-panel");
const periodTitle = document.querySelector("#period-title");
const periodKicker = document.querySelector("#period-kicker");
const tripCount = document.querySelector("#trip-count");
const tripList = document.querySelector("#trip-list");
const effectiveDate = document.querySelector("#effective-date");
const nextRide = document.querySelector("#next-ride");
const nextTime = document.querySelector("#next-time");
const nextCountdown = document.querySelector("#next-countdown");
const nextRoute = document.querySelector("#next-route");
const fullViewButton = document.querySelector("#full-view-button");
const fullScheduleDialog = document.querySelector("#full-schedule-dialog");
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

function viewFromLocation() {
  const hashView = window.location.hash.slice(1).toLowerCase();
  if (hashView in SCHEDULE.periods) {
    return hashView;
  }
  return new Date().getHours() < 12 ? "morning" : "afternoon";
}

function minutesFromMidnight(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function timeParts(value) {
  const [hoursText, minutes] = value.split(":");
  const hours = Number(hoursText);
  return {
    clock: `${hours % 12 || 12}:${minutes}`,
    period: hours < 12 ? "AM" : "PM",
  };
}

function displayTime(value, includePeriod = true) {
  const { clock, period } = timeParts(value);
  return includePeriod ? `${clock} ${period}` : clock;
}

function nextTripFor(period) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return period.trips.find((trip) => minutesFromMidnight(trip.stops[0].time) >= nowMinutes) ?? null;
}

function countdownFor(time) {
  const now = new Date();
  const difference = minutesFromMidnight(time) - (now.getHours() * 60 + now.getMinutes());
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
  const first = minutesFromMidnight(trip.stops[0].time);
  const last = minutesFromMidnight(trip.stops.at(-1).time);
  return last - first;
}

function connectionChip(connection) {
  const service = SERVICE_STYLES[connection.service];
  const accessibleLabel = `${displayTime(connection.time)} ${connection.direction} ${connection.train} ${service.label}`;
  return `
    <span class="train-chip train-chip--${connection.service}" aria-label="${accessibleLabel}">
      <time datetime="${connection.time}">${displayTime(connection.time, false)}</time>
      <span class="train-chip__number">${connection.train}</span>
      <i aria-hidden="true">${service.short}</i>
    </span>
  `;
}

function connectionRow(direction, connections) {
  const matchingConnections = connections.filter((connection) => connection.direction === direction);
  if (!matchingConnections.length) {
    return "";
  }

  return `
    <div class="connection-row">
      <span class="direction-badge direction-badge--${direction.toLowerCase()}">${direction}</span>
      <div class="connection-chips">${matchingConnections.map(connectionChip).join("")}</div>
    </div>
  `;
}

function stopTimeline(stops) {
  return `
    <div class="route-timeline" aria-label="${stops
      .map((stop) => `${stop.name} ${displayTime(stop.time)}`)
      .join(", ")}">
      ${stops
        .map(
          (stop, index) => `
            <div class="route-stop ${index === 0 ? "route-stop--origin" : ""} ${
              index === stops.length - 1 ? "route-stop--destination" : ""
            }">
              <span class="route-stop__marker" aria-hidden="true"></span>
              <span class="route-stop__name">${stop.name}</span>
              <time datetime="${stop.time}">${displayTime(stop.time, false)}</time>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function tripCard(trip, index, period, nextTrip) {
  const origin = trip.stops[0];
  const destination = trip.stops.at(-1);
  const departure = timeParts(origin.time);
  const arrival = timeParts(destination.time);
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
          <span>${tripDuration(trip)} min</span>
          <svg viewBox="0 0 64 16"><path d="M1 8h60m-7-6 7 6-7 6" /></svg>
        </div>
        <div class="trip-card__arrival">
          <p>Arrive ${destination.name}</p>
          <time datetime="${destination.time}">${arrival.clock}<small>${arrival.period}</small></time>
        </div>
      </header>

      ${stopTimeline(trip.stops)}

      <section class="connections" aria-label="${period.connectionDescription}">
        <div class="connections__heading">
          <span>${period.connectionLabel}</span>
          <span>${trip.connections.length} connections</span>
        </div>
        ${connectionRow("NB", trip.connections)}
        ${connectionRow("SB", trip.connections)}
      </section>
    </article>
  `;
}

function renderNext(period, nextTrip) {
  if (!nextTrip) {
    nextRide.dataset.state = "finished";
    nextTime.textContent = "—";
    nextCountdown.textContent = currentView === "morning" ? "Morning service ended" : "Service ended today";
    nextRoute.textContent = "Browse every scheduled run below.";
    return;
  }

  const origin = nextTrip.stops[0];
  const destination = nextTrip.stops.at(-1);
  nextRide.dataset.state = "active";
  nextTime.textContent = displayTime(origin.time);
  nextCountdown.textContent = countdownFor(origin.time);
  nextRoute.textContent = `${origin.name} → ${destination.name}`;
}

function renderPeriod(view) {
  const period = SCHEDULE.periods[view];
  const nextTrip = nextTripFor(period);

  periodTitle.textContent = period.label;
  periodKicker.textContent = period.kicker;
  tripCount.textContent = `${period.trips.length} rides`;
  tripList.innerHTML = period.trips.map((trip, index) => tripCard(trip, index, period, nextTrip)).join("");
  renderNext(period, nextTrip);
}

function applyView(view, { syncHash = true, focusTab = false } = {}) {
  if (!(view in SCHEDULE.periods)) {
    return;
  }

  currentView = view;
  tabs.forEach((tab) => {
    const selected = tab.dataset.view === view;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focusTab) {
      tab.focus();
    }
  });

  panel.setAttribute("aria-labelledby", `${view}-tab`);
  renderPeriod(view);

  if (syncHash && window.location.hash !== `#${view}`) {
    window.history.replaceState(null, "", `#${view}`);
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    applyView(tab.dataset.view);
  });

  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + tabs.length) % tabs.length;
    applyView(tabs[nextIndex].dataset.view, { focusTab: true });
  });
});

window.addEventListener("hashchange", () => {
  const hashView = window.location.hash.slice(1).toLowerCase();
  if (hashView in SCHEDULE.periods) {
    applyView(hashView, { syncHash: false });
  }
});

fullViewButton.addEventListener("click", () => {
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

effectiveDate.textContent = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
})
  .format(new Date(`${SCHEDULE.effectiveDate}T00:00:00`))
  .toUpperCase();

applyView(viewFromLocation());
window.setInterval(() => renderPeriod(currentView), 60_000);
