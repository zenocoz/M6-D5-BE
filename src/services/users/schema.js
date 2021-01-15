const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  ownerId: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  total: Number,
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
