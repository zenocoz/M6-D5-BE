const { Schema, model } = require("mongoose");

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    reviews: [
      {
        comment: { type: String },
        rate: { type: Number },
      },
    ],
    category: String,
    reviews: [],
    availableQuantity: { type: Number, required: true, min: 0 },
  },

  { timestamps: true }
);

ProductSchema.static(
  "decreaseProductQuantity",
  async function (productId, amount) {
    const product = await ProductModel.findByIdAndUpdate(productId, {
      $inc: { availableQuantity: -amount },
    });
    return product;
  }
);

ProductSchema.static(
  "increaseProductQuantiy",
  async function (productId, amount) {
    const product = await ProductModel.findByIdAndUpdate(productId, {
      $inc: { availableQuantity: amount },
    });
    return product;
  }
);

const ProductModel = model("Product", ProductSchema);

module.exports = ProductModel;
