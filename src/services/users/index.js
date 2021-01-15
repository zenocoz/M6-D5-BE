const express = require("express");
const mongoose = require("mongoose");
const ProductModel = require("../products/schema");

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
    const product = await ProductModel.decreaseProductQuantity(
      req.params.productId,
      req.body.quantity
    );
    if (product) {
      const newProduct = { ...product.toObject(), quantity: req.body.quantity };
      const isProductThere = await UsersModel.findProduct(
        req.params.cartId,
        req.params.productId
      );

      if (isProductThere) {
        await UsersModel.incrementCartQuantity(
          req.params.cartId,
          req.params.productId,
          req.body.quantity
        );
        res.send("quantity incremented");
      } else {
        const cart = await UsersModel.addToCart(req.params.cartId, newProduct);

        if (cart) {
          res.status(201).send("product added to cart");
        } else {
          const err = new Error();
          err.message = `Cart id: ${req.params.cartId} not found!`;
          err.httpStatusCode = 404;
          next(err);
        }
      }
    } else {
      const err = new Error();
      err.message = "product not found";
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.delete("/:cartId/carts/:productId", async (req, res, next) => {
  try {
    const { products } = await UsersModel.findById(req.params.cartId, {
      _id: 0,
      products: {
        $elemMatch: { _id: mongoose.Types.ObjectId(req.params.productId) },
      },
    });

    await ProductModel.increaseProductQuantiy(req.productId, req.body.quantity);

    if (products[0].quantity <= 0) {
      await UsersModel.findByIdAndUpdate(
        req.params.cartId,
        {
          $pull: {
            products: { _id: mongoose.Types.ObjectId(req.params.productId) },
          },
        },
        { runValidators: true, new: true }
      );
      res.status(203).send("deleted");
    } else {
      await UsersModel.decreaseCartQuantity(
        req.params.cartId,
        req.params.productId,
        req.body.quantity
      );
      res.status(203).send("product deleted");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = usersRouter;
