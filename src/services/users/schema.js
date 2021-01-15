const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  ownerId: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  products: [
    {
      _id: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  total: Number,
});

UserSchema.static("findProduct", async function (id, productId) {
  const isProductThere = await UserModel.findOne({
    _id: id,
    "products._id": productId,
  });
  return isProductThere;
});

UserSchema.static(
  "incrementCartQuantity",
  async function (id, productId, quantity) {
    await UserModel.findOneAndUpdate(
      {
        _id: id,
        "products._id": productId,
      },
      {
        $inc: { "products.$.quantity": quantity },
      }
    );
  }
);

UserSchema.static(
  "decreaseCartQuantity",
  async function (id, productId, quantity) {
    await UserModel.findOneAndUpdate(
      {
        _id: id,
        "products._id": productId,
      },
      {
        $inc: { "products.$.quantity": -quantity },
      }
    );
  }
);

UserSchema.static("addToCart", async function (id, product) {
  const productToAdd = await UserModel.findByIdAndUpdate(id, {
    $addToSet: {
      products: product,
    },
  });
  return productToAdd;
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
