export type TransitRoute = {
  id: string;
  shortName: string;
  destination: string;
  headwayMinutes: number;
  firstDepartureHour: number;
  lastDepartureHour: number;
};

export type TransitStop = {
  id: string;
  name: string;
  area: string;
  routeIds: string[];
};

export const transitRoutes: TransitRoute[] = [
  {
    id: "747",
    shortName: "747",
    destination: "Airport Express",
    headwayMinutes: 15,
    firstDepartureHour: 5,
    lastDepartureHour: 23,
  },
  {
    id: "24",
    shortName: "24",
    destination: "Sherbrooke",
    headwayMinutes: 10,
    firstDepartureHour: 6,
    lastDepartureHour: 23,
  },
  {
    id: "80",
    shortName: "80",
    destination: "Du Parc",
    headwayMinutes: 12,
    firstDepartureHour: 6,
    lastDepartureHour: 22,
  },
  {
    id: "55",
    shortName: "55",
    destination: "Saint-Laurent",
    headwayMinutes: 8,
    firstDepartureHour: 5,
    lastDepartureHour: 23,
  },
];

export const transitStops: TransitStop[] = [
  {
    id: "stop-berri-uqam",
    name: "Berri-UQAM",
    area: "Ville-Marie",
    routeIds: ["747", "24", "55"],
  },
  {
    id: "stop-mcgill",
    name: "McGill",
    area: "Downtown",
    routeIds: ["24", "80"],
  },
  {
    id: "stop-jean-talon",
    name: "Jean-Talon",
    area: "Villeray",
    routeIds: ["55", "80"],
  },
  {
    id: "stop-laval-terminal",
    name: "Laval Terminal",
    area: "Laval",
    routeIds: ["747", "24"],
  },
];
