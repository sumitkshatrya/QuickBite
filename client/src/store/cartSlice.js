import { createSlice } from '@reduxjs/toolkit';

const loadCartState = () => {
  try {
    const stored = localStorage.getItem('quickbiteCart');
    return stored
      ? JSON.parse(stored)
      : {
          items: [],
          coupon: null,
          discount: 0,
        };
  } catch {
    localStorage.removeItem('quickbiteCart');
    return {
      items: [],
      coupon: null,
      discount: 0,
    };
  }
};

const persistCartState = (state) => {
  localStorage.setItem(
    'quickbiteCart',
    JSON.stringify({
      items: state.items,
      coupon: state.coupon,
      discount: state.discount,
    })
  );
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCartState(),
  reducers: {
    addItem: (state, action) => {
      const existing = state.items.find((item) => item._id === action.payload._id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      persistCartState(state);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      persistCartState(state);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find((current) => current._id === action.payload._id);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((current) => current._id !== action.payload._id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
      persistCartState(state);
    },
    applyCoupon: (state, action) => {
      const code = action.payload.trim().toUpperCase();
      if (code === 'QUICK10') {
        state.coupon = code;
        state.discount = 0.1;
      } else if (code === 'SAVE20') {
        state.coupon = code;
        state.discount = 0.2;
      } else {
        state.coupon = null;
        state.discount = 0;
      }
      persistCartState(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      state.discount = 0;
      persistCartState(state);
    },
  },
});

export const { addItem, removeItem, updateQuantity, applyCoupon, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
