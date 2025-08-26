import mongoose, { Schema, models, model } from "mongoose";

const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        drinkSize: { type: String },
        selectedSides: [{ type: String }],
        specialInst: { type: String },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Items",
        },
      },
    ],
    orderForDeliver: {
      type: Boolean,
      default: false,
      required: true,
    },
    orderForPickup: {
      type: Boolean,
      default: false,
      required: true,
    },
    deliveryAddress: {
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    pickUpTime: {
      type: String,
    },
    orderStatus: {
      type: String,
      enum: ["Confirmed", "Not Confirmed", "Ready For Pickup", "Served"],
      default: "Not Confirmed",
    },
  },
  {
    timestamps: true,
  }
);

const Order = models?.Order || model("Order", OrderSchema);

export default Order;
