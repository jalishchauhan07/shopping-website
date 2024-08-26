const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");

require("dotenv").config({ path: "./.env" });

const db = require("./db");
const auth = require("./auth/auth");
const product_ = require("./product/product");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.secretKey,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

db.then(() => {
  app.use("/auth", auth);
  app.use("/product", product_);

  app.listen(process.env.port, () => {
    console.log(`Server is listening on ${process.env.port}`);
  });
}).catch((err: any) => {
  console.error(err);
});
