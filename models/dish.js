const mongoose = require("mongoose");

const dishSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    loc: {
      type: {
        type: String,
        enum: ["Point"],
        //required: true,
      },
      coordinates: {
        type: [Number],
        //required: true,
      },
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

dishSchema.index({ "loc" : "2dsphere" }) 
const Dish = mongoose.model("Dish", dishSchema);
module.exports = Dish;