export type VehicleType = "Car" | "Bike" | "Scooter" | "Van";

export type Vehicle = {
  id: string;
  name: string;
  type: VehicleType;
  city: string;
  region: string;
  pricePerHour: number;
  seats?: number;
  rangeKm: number;
  transmission?: string;
  fuel?: string;
  rating: number;
  image: string;
  provider: string;
  features: string[];
  description: string;
  policies: string[];
  available: boolean;
  distanceKm: number;
};

export type VehicleFormData = {
  type: string;
  name: string;
  city: string;
  region: string;
  pricePerHour: string;
  seats: string;
  rangeKm: string;
  transmission: string;
  fuel: string;
  description: string;
};