const Productmodel = require("../models/productmodel");
const Ordermodel = require("../models/Ordermodel");
const braintree = require("braintree");
require("dotenv").config();

// Payment Gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
});

exports.Addproduct = async (req, res) => {
  try {
    const { name, description, category, price, quantity, shipping } = req.body;
    const img = req.file.filename;

    if (!name || !description || !category || !price || !quantity || !img) {
      return res.status(400).send("Please fill all the fields");
    }

    const newProduct = new Productmodel({
      name,
      description,
      category,
      price,
      quantity,
      shipping,
      img,
    });

    const saveproduct = await newProduct.save();

    res
      .status(200)
      .send({ message: "Successfully created Product", saveproduct });
  } catch (error) {
    res.status(404).send({ message: "Error in creating Product", error });
  }
};

exports.Allproduct = async (req, res) => {
  try {
    const products = await Productmodel.find({}).sort({ createdAt: -1 });
    res
      .status(200)
      .send({ message: "All Products retrieved successfully", products });
  } catch (error) {
    res.status(404).send({ message: "Error in Getting Products", error });
  }
};

exports.Singleproduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Productmodel.findOne({ _id: id });
    res
      .status(200)
      .send({ message: "Product retrieved successfully", product });
  } catch (error) {
    res.status(404).send({ message: "Error in Getting Product", error });
  }
};

exports.Editproduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, quantity, img } = req.body;
    const file = req.file ? req.file.filename : img;
    const updateProduct = await Productmodel.findByIdAndUpdate(
      { _id: id },
      { name, description, category, price, quantity, img: file }
    );
    res
      .status(200)
      .send({ message: "Product updated successfully", updateProduct });
  } catch (error) {
    res.status(404).send({ message: "Error in updating Product", error });
  }
};

exports.Deleteproduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await Productmodel.findByIdAndDelete({ _id: id });
    res
      .status(200)
      .send({ message: "Product Deleted successfully", deleteProduct });
  } catch (error) {
    res.status(404).send({ message: "Error in Deleting Product", error });
  }
};

// Braintree
exports.Braintreetokenfunction = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    res.status(404).send(error);
  }
};

// Payment processing
exports.Braintreepaymentfunction = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });

    let newtransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (err, result) {
        if (result) {
          const order = new Ordermodel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error)
  }
};
