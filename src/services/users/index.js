const express = require("express");
const mongoose = require("mongoose");
const { use } = require("../products");

const UsersModel = require("./schema");

const usersRouter = express.Router();

// usersRouter.post("/", async (req, res, next) => {
//   try {
//     const newUsers = new UsersModel(req.body);
//     const { _id } = await newUsers.save();
//     res.status(201).send(_id);
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });

usersRouter.get("/:cartId", async (req, res, next) => {
  try {
    const cart = await UsersModel.findById(
      req.params.cartId
    ).populate("products", { reviews: 0 });
    if (cart) {
      res.status(200).send(cart);
    } else {
      const err = new Error();
      err.message = `Cart id: ${req.params.cartId} not found!`;
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post("/:cartId/carts/:productId", async (req, res, next) => {
  try {
    const cart = await UsersModel.findByIdAndUpdate(
      req.params.cartId,
      {
        $addToSet: {
          products: mongoose.Types.ObjectId(req.params.productId),
        },
      },
      { runValidators: true, new: true }
    );
    if (cart) {
      res.status(201).send(cart);
    } else {
      const err = new Error();
      err.message = `Cart id: ${req.params.cartId} not found!`;
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error), next(error);
  }
});

module.exports = usersRouter;
