import type { Vehicle } from "../types/vehicle";

const STORAGE_KEY = "providerVehicles";

export function getStoredVehicles(): Vehicle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Vehicle[];
  } catch {
    return [];
  }
}

export function saveStoredVehicles(vehicles: Vehicle[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
}