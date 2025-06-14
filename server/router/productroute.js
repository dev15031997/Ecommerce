const express=require('express');
const upload=require('../middleware/uploads')
const { authlogin, Admin } = require('../middleware/userAuth');
const { Addproduct,Allproduct,Singleproduct,Editproduct, Deleteproduct , Braintreetokenfunction, Braintreepaymentfunction} = require('../controller/productcontroller');
const route=express.Router();

route.post("/addproduct",upload.single('img'),authlogin,Admin,Addproduct)

route.get("/allproduct",Allproduct)

route.get("/singleproduct/:id",Singleproduct)

route.put("/editproduct/:id",upload.single('img'),authlogin,Admin,Editproduct)

route.delete("/deleteproduct/:id",authlogin,Admin,Deleteproduct)

route.get("/braintree/token",Braintreetokenfunction)

route.post("/braintree/payment",authlogin,Braintreepaymentfunction)


module.exports=route;