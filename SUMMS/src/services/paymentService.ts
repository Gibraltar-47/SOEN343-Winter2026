import {
  CreditCardPayment,
  DebitCardPayment,
  WalletPayment,
  PaymentContext,
} from "../patterns/paymentStrategy";
import { Observer, Subject } from "../patterns/observer";
import { paymentAnalyticsObserver } from "./analyticsService";
import { RentalStatus } from "../patterns/rentalState";

export type ReservationInput = {
  vehicleId: string;
  vehicleName: string;
  city: string;
  region: string;
  pricePerHour: number;
  providerId: string;
  providerName: string;
  type: string;
};

export type RentalRecord = ReservationInput & {
  id: string;
  userId: string;
  userName: string;
  paymentMethod: string;
  total: number;
  status: RentalStatus;
  reservedAt: string;
};

const RENTALS_KEY = "rentals";

function getStoredRentals(): RentalRecord[] {
  return JSON.parse(localStorage.getItem(RENTALS_KEY) || "[]");
}

function saveStoredRentals(rentals: RentalRecord[]) {
  localStorage.setItem(RENTALS_KEY, JSON.stringify(rentals));
}

class PaymentService implements Subject {
  private observers: Observer[] = [paymentAnalyticsObserver];

  attach(observer: Observer): void {
    this.observers.push(observer);
  }

  detach(observer: Observer): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(event: string, payload?: any): void {
    this.observers.forEach((observer) => observer.update(event, payload));
  }

  private resolveStrategy(method: string) {
    switch (method) {
      case "Credit Card":
        return new CreditCardPayment();
      case "Debit Card":
        return new DebitCardPayment();
      case "Wallet":
      default:
        return new WalletPayment();
    }
  }

  processReservationPayment(
    reservation: ReservationInput,
    paymentMethod: string,
    userId: string,
    userName: string,
    hours: number = 3
  ): RentalRecord {
    this.notify("payment_attempted");

    const total = reservation.pricePerHour * hours;
    const strategy = this.resolveStrategy(paymentMethod);
    const context = new PaymentContext(strategy);

    context.executePayment(total);
    this.notify("payment_successful");

    const rental: RentalRecord = {
      id: `rental-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...reservation,
      userId,
      userName,
      paymentMethod,
      total,
      status: "reserved",
      reservedAt: new Date().toISOString(),
    };

    localStorage.setItem("currentRental", JSON.stringify(rental));
    return rental;
  }
}

export const paymentService = new PaymentService();