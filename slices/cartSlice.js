import { createSlice } from "@reduxjs/toolkit";

// Safe function to get cart items from localStorage
const getCartItemsFromStorage = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const items = localStorage.getItem("cartItems");
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  }
  return [];
};

const saveToLocalStorage = (cartItems) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }
};

const initialState = {
  cartItems: getCartItemsFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existItem = state.cartItems.find(
        (item) => item._id === newItem._id
      );
      if (existItem) {
        // update quantity if item already exists
        state.cartItems = state.cartItems.map((item) =>
          item._id === existItem._id ? newItem : item
        );
      } else {
        // Add new Item
        state.cartItems.push(newItem);
      }
      // Save to localStorage after state update
      saveToLocalStorage(state.cartItems);
    },
    setQty: (state, action) => {
      console.log(action.payload);
      const { _id, qty } = action.payload;
      const item = state.cartItems.find((item) => item._id === _id);

      if (item) {
        item.qty = qty;
      }
      saveToLocalStorage(state.cartItems);
    },
    removeFromCart: (state, action) => {
      console.log(action.payload);
      const { _id } = action.payload;
      const newItem = state.cartItems.filter((item) => item._id !== _id);
      state.cartItems = newItem;

      saveToLocalStorage(state.cartItems);
    },
    clearCart: (state) => {
      state.cartItems = [];

      localStorage.removeItem("cartItems"); // cleaner than saving "[]"
    },
  },
});

export const { addToCart, setQty, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
