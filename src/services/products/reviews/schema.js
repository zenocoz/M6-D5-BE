const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema(
  {
    type: String,
    required: true,
    type: Number,
    max: 5,
  },
  { timestamps: true }
)

module.exports = mongoose.model("Review", reviewSchema)
