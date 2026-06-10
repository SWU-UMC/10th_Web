import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import modalReducer from './features/modal/modalSlice'; // 💡 모달 리듀서 임포트

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    modal: modalReducer, // 💡 등록 완료!
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;