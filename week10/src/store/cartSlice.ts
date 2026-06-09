import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CartState } from "../types/cart";
import cartItems from "../constants/cartItems";

const initialState: CartState = {
  cartItems: cartItems,
  amount: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // 수량 증가
    increase: (state, action: PayloadAction<{ id: string }>) => {
      const item = state.cartItems.find((item) => item.id === action.payload.id);
      if (item) {
        item.amount += 1;
      }
    },
    // 수량 감소
    decrease: (state, action: PayloadAction<{ id: string }>) => {
      const item = state.cartItems.find((item) => item.id === action.payload.id);
      if (item) {
        item.amount -= 1;
      }
    },
    // 아이템 삭제
    removeItem: (state, action: PayloadAction<{ id: string }>) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload.id);
    },
    // 장바구니 비우기
    clearCart: (state) => {
      state.cartItems = [];
    },
    // 총 수량 및 총 금액 계산
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total;
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;