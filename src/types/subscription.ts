export interface Subscription {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  status: 'active' | 'cancelled' | 'pending';
  icon: string;
}

export interface Transaction {
  id: string;
  subscriptionId: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface SubscriptionState {
  subscriptions: Subscription[];
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}