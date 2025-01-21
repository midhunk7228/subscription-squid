import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SubscriptionState, Subscription, Transaction } from '../types/subscription';

const initialState: SubscriptionState = {
  subscriptions: [],
  transactions: [],
  loading: false,
  error: null,
};

// Simulated API calls
export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchSubscriptions',
  async () => {
    // Simulated API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: '1',
        name: 'Netflix',
        price: 14.99,
        billingCycle: 'monthly',
        nextBillingDate: '2024-03-15',
        status: 'active',
        icon: '📺',
      },
      {
        id: '2',
        name: 'Spotify',
        price: 9.99,
        billingCycle: 'monthly',
        nextBillingDate: '2024-03-20',
        status: 'active',
        icon: '🎵',
      },
    ] as Subscription[];
  }
);

export const fetchTransactions = createAsyncThunk(
  'subscriptions/fetchTransactions',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: '1',
        subscriptionId: '1',
        amount: 14.99,
        date: '2024-02-15',
        status: 'completed',
      },
      {
        id: '2',
        subscriptionId: '2',
        amount: 9.99,
        date: '2024-02-20',
        status: 'completed',
      },
    ] as Transaction[];
  }
);

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action: PayloadAction<Subscription[]>) => {
        state.loading = false;
        state.subscriptions = action.payload;
        state.error = null;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch subscriptions';
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.loading = false;
        state.transactions = action.payload;
        state.error = null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      });
  },
});

export default subscriptionSlice.reducer;