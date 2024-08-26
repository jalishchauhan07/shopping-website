const router = require("express").Router();
const category = require("../model/category");
const product = require("../model/product");

router.get("/getCategory", async (req: any, res: any) => {
  try {
    const categoryInfo = await category.find();
    return res.status(200).send({ categorys: categoryInfo });
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/getProduct", async (req: any, res: any) => {
  try {
    const { email, productName, category } = req.params;
    const query: any = { email: email };
    if (productName) {
      ``;
      query["productName"] = productName;
    }
    if (category) {
      query["category"] = category;
    }

    const productInfo = await product.find(query);
    if (!productInfo.length) {
      return res.status(404).send({ products: "" });
    }
    return res.status(200).send({ products: productInfo });
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/addProduct", async (req: any, res: any) => {
  try {
    const { productName, description, price, images, category } = req.body;
    if (!productName || !description || !price || !images || !category) {
      const missingFields = [];

      if (!productName) {
        missingFields.push("Product Name is required");
      }
      if (!description) {
        missingFields.push("Product Description is required");
      }
      if (!price) {
        missingFields.push("Product Price is required");
      }
      if (!images) {
        missingFields.push("Product Image is required");
      }
      if (!category) {
        missingFields.push("Product Category is required");
      }
      return res.status(400).send({
        message: missingFields.join("\n"),
      });
    }
    const productInfo = await product({
      productName,
      description,
      price,
      images,
      category,
    }).save();
    if (!productInfo) {
      return res.status(400).send({ message: "Something went wrong" });
    }
    return res.status(200).send({ message: "Successfully saved data" });
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/updateProduct", async (req: any, res: any) => {
  try {
    const { productId, productName, description, price, images, category } =
      req.body;
    const updateQuery: any = {};
    if (!productId) {
      return res.status(400).send({
        message: "Product ID is required",
      });
    }
    const productInfo = await product.findOne({ _id: productId });
    if (productName) {
      updateQuery["productName"] = productName;
    }

    if (description) {
      updateQuery["description"] = category;
    }
    if (price) {
      updateQuery["price"] = price;
    }

    if (!productInfo) {
      return res.status(404).send({ message: "Product is not found " });
    }
    const updateProductInfo = await product.updateOne(
      {
        _id: productId,
      },
      {
        $set: updateQuery,
      }
    );

    if (!updateProductInfo.modifiedCount) {
      return res.status(400).send({ message: "Something went wrong" });
    }
    return res
      .status(200)
      .send({ message: "Successfully update product information" });
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.delete("/deleteProduct", async (req: any, res: any) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      const missingFields = [];
      if (!productId) missingFields.push("Product ID is required");
      return res.status(400).send({
        message: missingFields.join("\n"),
      });
    }
    const deleteProduct = await product.deleteOne({
      _id: productId,
    });
    if (!deleteProduct.deleteCount) {
      return res.status(400).send({ message: "Product is not deleted" });
    }
    return res.status(200).send({
      message: `No of ${deleteProduct.deleteCount} product is deleted `,
    });
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

export {};
module.exports = router;
