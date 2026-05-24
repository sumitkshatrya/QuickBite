import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '../services/api.js';

export const fetchRestaurants = createAsyncThunk('restaurants/fetchRestaurants', async () => {
  return request('/restaurants');
});

export const fetchPopularFoods = createAsyncThunk('restaurants/fetchPopularFoods', async () => {
  return request('/foods?sort=rating_desc&limit=6');
});

export const fetchFoodDetails = createAsyncThunk('restaurants/fetchFoodDetails', async (id) => {
  return request(`/foods/${id}`);
});

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState: {
    list: [],
    status: 'idle',
    popularFoods: [],
    popularFoodsStatus: 'idle',
    selectedFood: null,
    foodStatus: 'idle',
    error: null,
  },
  reducers: {
    clearSelectedFood: (state) => {
      state.selectedFood = null;
      state.foodStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchPopularFoods.pending, (state) => {
        state.popularFoodsStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchPopularFoods.fulfilled, (state, action) => {
        state.popularFoodsStatus = 'succeeded';
        state.popularFoods = action.payload;
      })
      .addCase(fetchPopularFoods.rejected, (state, action) => {
        state.popularFoodsStatus = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchFoodDetails.pending, (state) => {
        state.foodStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchFoodDetails.fulfilled, (state, action) => {
        state.foodStatus = 'succeeded';
        state.selectedFood = action.payload;
      })
      .addCase(fetchFoodDetails.rejected, (state, action) => {
        state.foodStatus = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearSelectedFood } = restaurantSlice.actions;
export default restaurantSlice.reducer;
