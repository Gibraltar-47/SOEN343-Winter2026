import {
  transitRoutes,
  transitStops,
  type TransitRoute,
  type TransitStop,
} from "../data/publicTransport";

export type Departure = {
  routeId: string;
  routeLabel: string;
  destination: string;
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

function buildDeparturesForRoute(route: TransitRoute, now: Date): Departure[] {
  const departures: Departure[] = [];
  const current = new Date(now);

  const serviceStart = new Date(now);
  serviceStart.setHours(route.firstDepartureHour, 0, 0, 0);

  const serviceEnd = new Date(now);
  serviceEnd.setHours(route.lastDepartureHour, 59, 59, 999);

  if (current > serviceEnd) {
    return departures;
  }

  let cursor = new Date(serviceStart);
  while (cursor < current) {
    cursor = new Date(cursor.getTime() + route.headwayMinutes * 60_000);
  }

  for (let i = 0; i < 6 && cursor <= serviceEnd; i += 1) {
    const minutesAway = Math.max(
      0,
      Math.round((cursor.getTime() - current.getTime()) / 60_000),
    );

    departures.push({
      routeId: route.id,
      routeLabel: route.shortName,
      destination: route.destination,
      departureTime: formatTime(cursor),
      minutesAway,
      status: getStatus(minutesAway),
    });

    cursor = new Date(cursor.getTime() + route.headwayMinutes * 60_000);
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
