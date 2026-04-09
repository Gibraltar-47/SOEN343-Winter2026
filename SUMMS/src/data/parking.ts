export type ParkingLot = {
  id: string;
  name: string;
  area: string;
  address: string;
  totalSpots: number;
  availableSpots: number;
  pricePerHour: number;
  lat: number;
  lng: number;
};

export type ParkingReservation = {
  id: string;
  userId: string;
  userName: string;
  lotId: string;
  lotName: string;
  city: string;
  area: string;
  address: string;
  reservedAt: string;
  pricePerHour: number;
};

export const parkingDataSource = {
  provider: "Montreal Parking (prototype dataset)",
  note: "Prototype parking data used to simulate live availability, pricing, and reservations.",
};

export const parkingLots: ParkingLot[] = [
  {
    id: "mtl-001",
    name: "Downtown - Peel Street",
    area: "Downtown",
    address: "1200 Peel St, Montreal, QC",
    totalSpots: 48,
    availableSpots: 14,
    pricePerHour: 4.5,
    lat: 45.4988,
    lng: -73.5743,
  },
  {
    id: "mtl-002",
    name: "Old Montreal - Notre-Dame",
    area: "Old Montreal",
    address: "350 Rue Notre-Dame O, Montreal, QC",
    totalSpots: 60,
    availableSpots: 19,
    pricePerHour: 5.0,
    lat: 45.5049,
    lng: -73.5562,
  },
  {
    id: "mtl-003",
    name: "Plateau - Saint-Laurent",
    area: "Le Plateau",
    address: "1015 Boul. Saint-Laurent, Montreal, QC",
    totalSpots: 32,
    availableSpots: 7,
    pricePerHour: 3.75,
    lat: 45.5145,
    lng: -73.5774,
  },
  {
    id: "mtl-004",
    name: "McGill Area - University",
    area: "Downtown",
    address: "3550 Rue University, Montreal, QC",
    totalSpots: 40,
    availableSpots: 11,
    pricePerHour: 4.25,
    lat: 45.5038,
    lng: -73.5772,
  },
  {
    id: "mtl-005",
    name: "Laval - Montmorency",
    area: "Laval",
    address: "1400 Boul. de l'Avenir, Laval, QC",
    totalSpots: 55,
    availableSpots: 22,
    pricePerHour: 3.25,
    lat: 45.5581,
    lng: -73.7245,
  },
  {
    id: "mtl-006",
    name: "Côte-des-Neiges - Queen Mary",
    area: "Côte-des-Neiges",
    address: "5150 Chem. Queen Mary, Montreal, QC",
    totalSpots: 36,
    availableSpots: 9,
    pricePerHour: 3.5,
    lat: 45.4886,
    lng: -73.6297,
  },
];

export function simulateParkingUpdates(lots: ParkingLot[]): ParkingLot[] {
  return lots.map((lot) => {
    const variation = Math.floor(Math.random() * 5) - 2;
    const nextAvailable = Math.max(
      0,
      Math.min(lot.totalSpots, lot.availableSpots + variation)
    );

    return {
      ...lot,
      availableSpots: nextAvailable,
    };
  });
}