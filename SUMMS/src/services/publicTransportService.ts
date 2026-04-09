import {
  transitRoutes,
  transitStops,
  type TransitRoute,
  type TransitServiceWindow,
  type TransitStop,
} from "../data/publicTransport";

export type Departure = {
  routeId: string;
  routeLabel: string;
  destination: string;
  direction: string;
  category: TransitRoute["category"];
  departureTime: string;
  minutesAway: number;
  status: "Due" | "On Time" | "Scheduled";
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatus(minutesAway: number): Departure["status"] {
  if (minutesAway <= 1) {
    return "Due";
  }

  if (minutesAway <= 5) {
    return "On Time";
  }

  return "Scheduled";
}

function toMinutesOfDay(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesOfDayFromDate(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

function isWithinWindow(
  currentMinutes: number,
  window: TransitServiceWindow,
): boolean {
  const start = toMinutesOfDay(window.start);
  const end = toMinutesOfDay(window.end);

  if (start <= end) {
    return currentMinutes >= start && currentMinutes <= end;
  }

  return currentMinutes >= start || currentMinutes <= end;
}

function isScheduledMinute(date: Date, window: TransitServiceWindow): boolean {
  const start = toMinutesOfDay(window.start);
  let current = minutesOfDayFromDate(date);

  if (current < start) {
    current += 24 * 60;
  }

  return (current - start) % window.headwayMinutes === 0;
}

function getWindowForDate(
  date: Date,
  route: TransitRoute,
): TransitServiceWindow | undefined {
  const currentMinutes = minutesOfDayFromDate(date);
  return route.serviceWindows.find((window) => isWithinWindow(currentMinutes, window));
}

function buildDeparturesForRoute(route: TransitRoute, now: Date): Departure[] {
  const departures: Departure[] = [];
  const current = new Date(now);
  const cursor = new Date(now);
  cursor.setSeconds(0, 0);

  const maxLookAheadMinutes = 12 * 60;
  let scanned = 0;
  while (departures.length < 6 && scanned <= maxLookAheadMinutes) {
    const activeWindow = getWindowForDate(cursor, route);
    if (activeWindow && isScheduledMinute(cursor, activeWindow)) {
      const minutesAway = Math.max(
        0,
        Math.round((cursor.getTime() - current.getTime()) / 60_000),
      );

      departures.push({
        routeId: route.id,
        routeLabel: route.shortName,
        destination: route.destination,
        direction: route.directionOutbound,
        category: route.category,
        departureTime: formatTime(cursor),
        minutesAway,
        status: getStatus(minutesAway),
      });
    }

    cursor.setMinutes(cursor.getMinutes() + 1);
    scanned += 1;
  }

  return departures;
}

export function getTransitStops(): TransitStop[] {
  return transitStops;
}

export function getTransitRoutes(): TransitRoute[] {
  return transitRoutes;
}

export function getNextDepartures(
  stopId: string,
  routeId: string | "all" = "all",
  now: Date = new Date(),
  limit: number = 8,
): Departure[] {
  const stop = transitStops.find((candidate) => candidate.id === stopId);

  if (!stop) {
    return [];
  }

  const availableRoutes = transitRoutes.filter(
    (route) =>
      stop.routeIds.includes(route.id) && (routeId === "all" || route.id === routeId),
  );

  return availableRoutes
    .flatMap((route) => buildDeparturesForRoute(route, now))
    .sort((left, right) => left.minutesAway - right.minutesAway)
    .slice(0, limit);
}
