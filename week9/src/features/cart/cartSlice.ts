import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import cartItems from '../../constants/cartItems'; 
import { type CartItemType } from '../../constants/cartItems';

interface CartState {
  cartItems: CartItemType[];
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
    // 특정 음반 수량 +1
    increase: (state: CartState, action: PayloadAction<{ id: string }>) => {
      const item = state.cartItems.find((item) => item.id === action.payload.id);
      if (item) {
        item.amount += 1;
      }
    },
    // 특정 음반 수량 -1 (1미만이 되면 자동 제거)
    decrease: (state: CartState, action: PayloadAction<{ id: string }>) => {
      const item = state.cartItems.find((item) => item.id === action.payload.id);
      if (item) {
        item.amount -= 1;
        if (item.amount < 1) {
          state.cartItems = state.cartItems.filter((i) => i.id !== action.payload.id);
        }
      }
    },
    // 아이템 강제 제거
    removeItem: (state: CartState, action: PayloadAction<{ id: string }>) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload.id);
    },
    // 장바구니 전체 삭제
    clearCart: (state: CartState) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    // 총 수량 및 금액 자동 계산
    calculateTotals: (state: CartState) => {
      let totalAmount = 0;
      let totalPrice = 0;
      
      state.cartItems.forEach((item) => {
        totalAmount += item.amount;
        totalPrice += item.amount * Number(item.price);
      });
      
      state.amount = totalAmount;
      state.total = totalPrice;
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;