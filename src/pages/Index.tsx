import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchSubscriptions, fetchTransactions } from '../store/subscriptionSlice';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { TransactionList } from '../components/TransactionList';

const Index = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { subscriptions, transactions, loading, error } = useSelector(
    (state: RootState) => state.subscriptions
  );

  useEffect(() => {
    dispatch(fetchSubscriptions());
    dispatch(fetchTransactions());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Subscriptions</h1>
          <p className="text-gray-600">Manage your subscriptions and payments in one place</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((subscription) => (
            <SubscriptionCard key={subscription.id} subscription={subscription} />
          ))}
        </div>

        <div className="mt-12">
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default Index;