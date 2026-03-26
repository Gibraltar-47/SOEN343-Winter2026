export interface PaymentStrategy {
  pay(amount: number): string;
}

export class CreditCardPayment implements PaymentStrategy {
  pay(amount: number): string {
    return `Paid $${amount} with Credit Card`;
  }
}

export class DebitCardPayment implements PaymentStrategy {
  pay(amount: number): string {
    return `Paid $${amount} with Debit Card`;
  }
}

export class WalletPayment implements PaymentStrategy {
  pay(amount: number): string {
    return `Paid $${amount} with Wallet`;
  }
}

export class PaymentContext {
  constructor(private strategy: PaymentStrategy) {}

  executePayment(amount: number): string {
    return this.strategy.pay(amount);
  }
}