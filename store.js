import { configureStore } from "@reduxjs/toolkit";
import cartSliceReducer from "./slices/cartSlice";
import { apiSlice } from "./slices/apiSlice";

const store = configureStore({
  reducer: {
    cart: cartSliceReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaulMiddleware) =>
    getDefaulMiddleware().concat(apiSlice.middleware),
});
export default store;
