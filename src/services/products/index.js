const express = require("express")
const q2m = require("query-to-mongo")
const mongoose = require("mongoose")
const ProductModel = require("./schema")
const ReviewModel = require("../reviews/schema")

const productRouter = express.Router()

productRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query)
    const total = await ProductModel.countDocuments(query.criteria)
    const products = await ProductModel.find(
      query.criteria,
      query.options.fields
    )
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort)
    res.status(200).send({ links: query.links("/products", total), products })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

productRouter.get("/:id", async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id)
    if (product) {
      res.status(200).send(product)
    } else {
      const err = new Error()
      err.message = `Product Id: ${req.params.id} not found`
      err.httpStatusCode = 404
      next(err)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

productRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = new ProductModel(req.body)
    const { _id } = await newProduct.save()
    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

productRouter.put("/:id", async (req, res, next) => {
  try {
    const modifiedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    )
    if (modifiedProduct) {
      res.status(200).send(modifiedProduct)
    } else {
      const err = new Error()
      err.message = `Product id: ${req.params.id} not found!`
      err.httpStatusCode = 404
      next(err)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

productRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedProuct = await ProductModel.findByIdAndDelete(req.params.id)
    if (deletedProuct) {
      res.status(203).send("Product deleted succsefully")
    } else {
      const err = new Error()
      err.message = `Product id: ${req.params.id} not found!`
      err.httpStatusCode = 404
      next(err)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

//REVIEWS

productRouter.post("/:id/reviews", async (req, res, next) => {
  try {
    const newReview = new ReviewModel(req.body)
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: { reviews: { ...newReview } },
      },
      { runValidators: true, new: true }
    )

    res.status(201).send(updatedProduct)
  } catch (error) {
    console.log(error)
  }
})

productRouter.get("/:id/reviews", async (req, res, next) => {
  try {
    const { reviews } = await ProductModel.findById(req.params.id, {
      _id: 0,
    })

    res.send(reviews)
  } catch (error) {
    console.log(error)
  }
})

productRouter.get("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const { reviews } = await ProductModel.findById(req.params.id, {
      _id: 0,
      reviews: {
        $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
      },
    })
    if (reviews && reviews.length > 0) {
      res.send(reviews[0])
    } else {
      next()
    }
  } catch (error) {
    console.log(error)
  }
})

productRouter.put("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const { reviews } = await ProductModel.findById(req.params.id, {
      _id: 0,
      reviews: {
        $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
      },
    })

    if (reviews && reviews.length > 0) {
      const reviewToModify = { ...reviews[0].toObject(), ...req.body }
      const modifiedProduct = await ProductModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(req.params.id),
          "reviews._id": mongoose.Types.ObjectId(req.params.reviewId),
        },
        { $set: { "reviews.$": reviewToModify } },
        {
          runValidators: true,
          new: true,
        }
      )
      res.send(modifiedProduct)
    } else {
      next()
    }
  } catch (error) {
    console.log(error)
  }
})
productRouter.delete("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const modifiedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          reviews: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
        },
      },
      {
        new: true,
      }
    )
    res.send(modifiedProduct)
  } catch (error) {
    console.log(error)
  }
})
module.exports = productRouter
