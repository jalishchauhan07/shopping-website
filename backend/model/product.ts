const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const product = mongoose.model("product", productSchema);
module.exports = product;
