import type { Vehicle, VehicleFormData, VehicleType } from "../types/vehicle";
import { getStoredVehicles, saveStoredVehicles } from "../utils/providerVehicleStorage";

function getVehicleEmoji(type: VehicleType): string {
  switch (type) {
    case "Car":
      return "🚗";
    case "Bike":
      return "🚲";
    case "Scooter":
      return "🛴";
    case "Van":
      return "🚐";
    default:
      return "🚗";
  }
}

export function getProviderVehicles(providerName?: string): Vehicle[] {
  const vehicles = getStoredVehicles();

  if (!providerName) {
    return vehicles;
  }

  return vehicles.filter((vehicle) => vehicle.provider === providerName);
}

export function addProviderVehicle(
  form: VehicleFormData,
  providerName: string,
): Vehicle {
  const newVehicle: Vehicle = {
    id: `vehicle-${Date.now()}`,
    name: form.name,
    type: form.type as VehicleType,
    city: form.city,
    region: form.region,
    pricePerHour: Number(form.pricePerHour),
    seats: form.seats ? Number(form.seats) : undefined,
    rangeKm: Number(form.rangeKm),
    transmission: form.transmission || undefined,
    fuel: form.fuel || undefined,
    rating: 4.5,
    image: getVehicleEmoji(form.type as VehicleType),
    provider: providerName,
    features: ["Mobile booking", "GPS", "Flexible cancellation"],
    description:
      form.description ||
      "A provider-managed vehicle available through the mobility platform.",
    policies: [
      "Free cancellation up to 1 hour before pickup",
      "Vehicle must be returned in good condition",
    ],
    available: true,
    distanceKm: 0.8,
  };

  const vehicles = getStoredVehicles();
  saveStoredVehicles([...vehicles, newVehicle]);

  return newVehicle;
}

export function updateProviderVehicle(
  vehicleId: string,
  updates: Partial<Vehicle>,
): Vehicle | null {
  const vehicles = getStoredVehicles();
  const target = vehicles.find((vehicle) => vehicle.id === vehicleId);

  if (!target) {
    return null;
  }

  const updatedVehicle: Vehicle = {
    ...target,
    ...updates,
    image: updates.type ? getVehicleEmoji(updates.type) : target.image,
  };

  const nextVehicles = vehicles.map((vehicle) =>
    vehicle.id === vehicleId ? updatedVehicle : vehicle,
  );

  saveStoredVehicles(nextVehicles);
  return updatedVehicle;
}

export function deleteProviderVehicle(vehicleId: string): boolean {
  const vehicles = getStoredVehicles();
  const nextVehicles = vehicles.filter((vehicle) => vehicle.id !== vehicleId);

  if (nextVehicles.length === vehicles.length) {
    return false;
  }

  saveStoredVehicles(nextVehicles);
  return true;
}