const express=require('express');
const { register,login, forgotpassword ,edituser, getorder,getAllOrders,orderStatus} = require('../controller/usercontroller');
const { authlogin, Admin } = require('../middleware/userAuth');
const router=express.Router();

router.get('/',(req,res)=>{
    res.send('Home')
})

router.post("/register",register)

router.post("/login",login)

router.post("/forgotpassword",forgotpassword)

router.get("/loginverify",authlogin,(req,res)=>{
    res.send({ok:'User verified'})
})

router.get("/adminverify",authlogin,Admin,(req,res)=>{
    res.send({ok:'Admin verified'})
})

router.put("/edit",authlogin,edituser)

router.get("/userorders",authlogin,getorder)

router.get("/allorders",authlogin,Admin,getAllOrders)

// status update
router.put("/orderstatus/:id",authlogin,Admin,orderStatus)

module.exports=router;