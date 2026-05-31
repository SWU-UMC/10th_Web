import { create } from 'zustand';
import cartItems, { type CartItemType } from '../constants/cartItems';

interface CartState {
  // 상태 변수
  cartItems: CartItemType[];
  amount: number;
  total: number;
  isModalOpen: boolean;

  // 액션 함수
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
  openModal: () => void;
  closeModal: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  // 1. 초기값 선언
  cartItems: cartItems,
  amount: 0,
  total: 0,
  isModalOpen: false,

  // 2. 액션 함수 구현 
  increase: (id) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      ),
    })),

  decrease: (id) =>
    set((state) => {
      const updatedItems = state.cartItems
        .map((item) => (item.id === id ? { ...item, amount: item.amount - 1 } : item))
        .filter((item) => item.amount >= 1); // 1보다 작아지면 자동 제거 조치
      return { cartItems: updatedItems };
    }),

  removeItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),

  clearCart: () =>
    set({
      cartItems: [],
      amount: 0,
      total: 0,
    }),

  calculateTotals: () =>
    set((state) => {
      let totalAmount = 0;
      let totalPrice = 0;
      state.cartItems.forEach((item) => {
        totalAmount += item.amount;
        totalPrice += item.amount * Number(item.price);
      });
      return { amount: totalAmount, total: totalPrice };
    }),

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));