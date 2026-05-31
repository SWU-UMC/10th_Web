import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import cartItems from '../../constants/cartItems';

interface CartItem {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
}

interface CartState {
  cartItems: CartItem[];
  amount: number;
  total: number;
}

const initialState: CartState = {
  cartItems: cartItems,
  amount: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 특정 아이템 제거
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
    },
    // 전체 삭제
    clearCart: (state) => {
      state.cartItems = [];
    },
    // 수량 증가
    increase: (state, action: PayloadAction<string>) => {
      const cartItem = state.cartItems.find((item) => item.id === action.payload);
      if (cartItem) {
        cartItem.amount += 1;
      }
    },
    // 수량 감소 (1 미만 시 제거)
    decrease: (state, action: PayloadAction<string>) => {
      const cartItem = state.cartItems.find((item) => item.id === action.payload);
      if (cartItem) {
        if (cartItem.amount === 1) {
          state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
        } else {
          cartItem.amount -= 1;
        }
      }
    },
    // 전체 합계 계산
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * Number(item.price);
      });
      state.amount = amount;
      state.total = total;
    },
  },
});

export const { clearCart, removeItem, increase, decrease, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;