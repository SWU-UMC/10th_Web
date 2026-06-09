import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

function createStore() {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
    },
  });
  return store;
}

const store = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;