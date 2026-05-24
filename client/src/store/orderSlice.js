import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '../services/api.js';

export const placeOrder = createAsyncThunk('orders/placeOrder', async (orderData, thunkAPI) => {
  try {
    return await request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to place order');
  }
});

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, thunkAPI) => {
  try {
    return await request('/orders');
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch orders');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    currentOrder: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.status = 'idle';
      state.error = null;
    },
    resetOrders: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearCurrentOrder, resetOrders } = orderSlice.actions;
export default orderSlice.reducer;
