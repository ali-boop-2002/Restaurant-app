import mongoose, { model, models, Schema } from "mongoose";
const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  hasSides: {
    type: Boolean,
    default: false,
  },
  hasSize: {
    type: Boolean,
    default: false,
  },
  sides: {
    type: [String],
    enum: ["raita", "salad", "naan", "white sauce"],
    default: [],
    validate: {
      validator: function (v) {
        // If hasSides is true, sides must not be empty
        if (this.hasSides && (!v || v.length === 0)) {
          return false;
        }
        // If hasSides is false, sides must be empty
        if (!this.hasSides && v && v.length > 0) {
          return false;
        }
        return true;
      },
      message: "Invalid sides based on hasSides value",
    },
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: [String],
  },
  size: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },

  isFeatured: {
    type: Boolean,
  },
  category: {
    type: String,
    required: true,
    enum: ["main", "apetizers", "drink"],
  },
  veg: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Items = models?.Items || mongoose.model("Items", ItemSchema);

export default Items;
