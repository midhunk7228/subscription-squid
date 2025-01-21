import { Subscription } from '../types/subscription';

interface SubscriptionCardProps {
  subscription: Subscription;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  return (
    <div className="bg-white rounded-lg p-6 card-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{subscription.icon}</span>
          <h3 className="text-lg font-semibold">{subscription.name}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          subscription.status === 'active' ? 'bg-green-100 text-green-800' : 
          subscription.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
          'bg-yellow-100 text-yellow-800'
        }`}>
          {subscription.status}
        </span>
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold">${subscription.price.toFixed(2)}</p>
        <p className="text-sm text-gray-600">Billed {subscription.billingCycle}</p>
        <p className="text-sm text-gray-600">
          Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};