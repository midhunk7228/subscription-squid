import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SubscriptionState, Subscription, Transaction } from '../types/subscription';
import { apiClient } from '../lib/api-client';

const initialState: SubscriptionState = {
  subscriptions: [],
  transactions: [],
  loading: false,
  error: null,
};

export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchSubscriptions',
  async () => {
    try {
      // Replace with your actual API endpoint
      const response = await apiClient.get('/subscriptions');
      return response.data;
    } catch (error) {
      // The error will be handled by the response interceptor
      throw error;
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'subscriptions/fetchTransactions',
  async () => {
    try {
      // Replace with your actual API endpoint
      const response = await apiClient.get('/transactions');
      return response.data;
    } catch (error) {
      // The error will be handled by the response interceptor
      throw error;
    }
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