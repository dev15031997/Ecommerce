const express=require('express');
const { register,login, forgotpassword } = require('../controller/usercontroller');
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


module.exports=router;