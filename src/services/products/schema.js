const { Schema, model } = require("mongoose")

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
  },
  { timestamps: true }
)

const ProductModel = model("Product", ProductSchema)

module.exports = ProductModel
