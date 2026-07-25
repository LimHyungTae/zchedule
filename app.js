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
const installButton = document.querySelector("#install-button");
const installHelp = document.querySelector("#install-help");

let currentView = "morning";
let installPrompt = null;

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
          <span>RIDE</span>
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
        ${isNext ? '<span class="next-badge">NEXT</span>' : ""}
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
  installButton.hidden = false;
  installHelp.textContent = "Use the button below to add Zchedule to your home screen.";
});

installButton.addEventListener("click", async () => {
  if (!installPrompt) {
    return;
  }

  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  installButton.hidden = true;
});

window.addEventListener("appinstalled", () => {
  installPrompt = null;
  installButton.hidden = true;
  installHelp.textContent = "Zchedule was added to your home screen.";
});

if (window.matchMedia("(display-mode: standalone)").matches) {
  document.querySelector(".install-card").hidden = true;
}

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
