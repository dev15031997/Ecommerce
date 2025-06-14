const mongoose = require("mongoose");
require("dotenv").config();

const OrderSchema = new mongoose.Schema({
  products: [
    {
      type: mongoose.ObjectId,
      ref: "Product"
    }
  ],
  payment: {
    
  },
  buyer: {
    type: mongoose.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    default: "Not processed",
    enum:["Not processed","Processing","Shipped","Delivered","Cancelled"]
  },
},{timestamps:true});

const Ordermodel = mongoose.model("Order", OrderSchema);

module.exports = Ordermodel;
