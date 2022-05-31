const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true
    },
    dishes: [
      {
        name: {
          type: String,
        },
        qty: {
          type: Number,
        },
        image: {
          type: String,
        },
        coments: {
          type: String,
          default: "N/A"
        },
        price: {
          type: Number,
        },
        dishId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Dish",
        },
      },
    ],
    subtotal: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 30,
    },
    paymentMethod: {
      type: String,
      enum: ["CASH", "CARD"],
      default: "CASH"
    },
    deliveryAdress: {
      type: String,
      default: "",
    },
    deliveryLocation: {
      lat: {
        type: Number,
        required: true,
      },
      long: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
