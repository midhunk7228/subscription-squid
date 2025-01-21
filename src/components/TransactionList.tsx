import { Transaction } from '../types/subscription';

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 bg-white rounded-lg card-shadow">
            <div>
              <p className="font-medium">${transaction.amount.toFixed(2)}</p>
              <p className="text-sm text-gray-600">
                {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
              transaction.status === 'failed' ? 'bg-red-100 text-red-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
              {transaction.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};