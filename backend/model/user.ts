const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    clientID: {
      type: String,
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    token: {
      type: [],
    },
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);
export {};

module.exports = user;
