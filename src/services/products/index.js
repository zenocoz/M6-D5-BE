const express = require("express")
const q2m = require("query-to-mongo")
const mongoose = require("mongoose")
const ProductModel = require("./schema")
const ReviewModel = require("./reviews/schema")

const productRouter = express.Router()

productRouter.post("/:id/addReview", async (req, res, next) => {
  try {
    const newReview = new ReviewModel(req.body)
    const updatedProduct = ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: { reviews: { newReview } },
      },
      { runValidators: true, new: true }
    )

    res.status(201).send(updatedProduct)
  } catch (error) {
    console.log(error)
  }
})

module.exports = productRouter
