export type TransitRoute = {
  id: string;
  shortName: string;
  destination: string;
  directionOutbound: string;
  directionInbound: string;
  category: "day" | "night" | "express" | "airport";
  serviceWindows: TransitServiceWindow[];
};

export type TransitServiceWindow = {
  start: string;
  end: string;
  headwayMinutes: number;
};

export type TransitStop = {
  id: string;
  name: string;
  area: string;
  stopCode: string;
  routeIds: string[];
};

export const transitDataSource = {
  provider: "STM (prototype planned schedules)",
  referencePage: "https://www.stm.info/en/info/networks/bus",
  note: "Routes and names reflect STM network listings. Departure times are planned intervals for prototype use.",
};

export const transitRoutes: TransitRoute[] = [
  {
    id: "11",
    shortName: "11",
    destination: "Parc-du-Mont-Royal / Ridgewood",
    directionOutbound: "West",
    directionInbound: "East",
    category: "day",
    serviceWindows: [
      { start: "05:30", end: "09:00", headwayMinutes: 10 },
      { start: "09:00", end: "15:30", headwayMinutes: 14 },
      { start: "15:30", end: "19:00", headwayMinutes: 10 },
      { start: "19:00", end: "23:30", headwayMinutes: 16 },
    ],
  },
  {
    id: "24",
    shortName: "24",
    destination: "Sherbrooke",
    directionOutbound: "West",
    directionInbound: "East",
    category: "day",
    serviceWindows: [
      { start: "05:00", end: "09:30", headwayMinutes: 8 },
      { start: "09:30", end: "15:30", headwayMinutes: 12 },
      { start: "15:30", end: "19:00", headwayMinutes: 8 },
      { start: "19:00", end: "00:30", headwayMinutes: 14 },
    ],
  },
  {
    id: "55",
    shortName: "55",
    destination: "Boulevard Saint-Laurent",
    directionOutbound: "South",
    directionInbound: "North",
    category: "day",
    serviceWindows: [
      { start: "05:00", end: "09:00", headwayMinutes: 6 },
      { start: "09:00", end: "15:30", headwayMinutes: 10 },
      { start: "15:30", end: "19:00", headwayMinutes: 6 },
      { start: "19:00", end: "01:00", headwayMinutes: 12 },
    ],
  },
  {
    id: "80",
    shortName: "80",
    destination: "Avenue du Parc",
    directionOutbound: "South",
    directionInbound: "North",
    category: "day",
    serviceWindows: [
      { start: "05:15", end: "09:00", headwayMinutes: 8 },
      { start: "09:00", end: "15:30", headwayMinutes: 12 },
      { start: "15:30", end: "19:00", headwayMinutes: 8 },
      { start: "19:00", end: "00:30", headwayMinutes: 14 },
    ],
  },
  {
    id: "165",
    shortName: "165",
    destination: "Cote-des-Neiges",
    directionOutbound: "South",
    directionInbound: "North",
    category: "day",
    serviceWindows: [
      { start: "05:00", end: "09:00", headwayMinutes: 7 },
      { start: "09:00", end: "15:30", headwayMinutes: 10 },
      { start: "15:30", end: "19:00", headwayMinutes: 7 },
      { start: "19:00", end: "00:00", headwayMinutes: 13 },
    ],
  },
  {
    id: "361",
    shortName: "361",
    destination: "Saint-Denis",
    directionOutbound: "South",
    directionInbound: "North",
    category: "night",
    serviceWindows: [{ start: "00:00", end: "05:00", headwayMinutes: 30 }],
  },
  {
    id: "365",
    shortName: "365",
    destination: "Avenue du Parc",
    directionOutbound: "South",
    directionInbound: "North",
    category: "night",
    serviceWindows: [{ start: "00:00", end: "05:00", headwayMinutes: 30 }],
  },
  {
    id: "410",
    shortName: "410",
    destination: "Express Notre-Dame",
    directionOutbound: "East",
    directionInbound: "West",
    category: "express",
    serviceWindows: [
      { start: "06:00", end: "09:30", headwayMinutes: 12 },
      { start: "15:30", end: "19:00", headwayMinutes: 12 },
    ],
  },
  {
    id: "468",
    shortName: "468",
    destination: "Express Pierrefonds / Gouin",
    directionOutbound: "East",
    directionInbound: "West",
    category: "express",
    serviceWindows: [
      { start: "06:00", end: "09:30", headwayMinutes: 15 },
      { start: "15:30", end: "19:00", headwayMinutes: 15 },
    ],
  },
  {
    id: "747",
    shortName: "747",
    destination: "YUL Aeroport / Centre-Ville",
    directionOutbound: "West to YUL",
    directionInbound: "East to Downtown",
    category: "airport",
    serviceWindows: [
      { start: "00:00", end: "05:00", headwayMinutes: 30 },
      { start: "05:00", end: "23:59", headwayMinutes: 15 },
    ],
  },
];

export const transitStops: TransitStop[] = [
  {
    id: "stop-berri-uqam",
    name: "Berri-UQAM",
    area: "Ville-Marie",
    stopCode: "50014",
    routeIds: ["24", "55", "361", "747"],
  },
  {
    id: "stop-mcgill",
    name: "McGill",
    area: "Downtown",
    stopCode: "50477",
    routeIds: ["24", "55", "80", "410", "747"],
  },
  {
    id: "stop-cote-des-neiges",
    name: "Cote-des-Neiges / Queen-Mary",
    area: "Cote-des-Neiges",
    stopCode: "52435",
    routeIds: ["11", "165", "365"],
  },
  {
    id: "stop-jean-talon",
    name: "Jean-Talon / Saint-Hubert",
    area: "Villeray",
    stopCode: "52881",
    routeIds: ["55", "80", "361"],
  },
  {
    id: "stop-parc-mont-royal",
    name: "Avenue du Parc / Mont-Royal",
    area: "Le Plateau",
    stopCode: "51462",
    routeIds: ["11", "80", "365"],
  },
  {
    id: "stop-lachine",
    name: "Lachine / Notre-Dame",
    area: "Lachine",
    stopCode: "53310",
    routeIds: ["410", "468", "747"],
  },
];
