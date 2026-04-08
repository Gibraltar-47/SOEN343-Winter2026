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
  provider: string;
  type: string;
};

export type RentalRecord = ReservationInput & {
  paymentMethod: string;
  total: number;
  status: RentalStatus;
  reservedAt: string;
};

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
    hours: number = 3
  ): RentalRecord {
    this.notify("payment_attempted");

    const total = reservation.pricePerHour * hours;
    const strategy = this.resolveStrategy(paymentMethod);
    const context = new PaymentContext(strategy);

    context.executePayment(total);
    this.notify("payment_successful");

    const rental: RentalRecord = {
      ...reservation,
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