
const { hashpassword, compare } = require('../middleware/helper');
const Usermodel = require('../models/usermodel')
const Ordermodel=require("../models/Ordermodel")

// Register
exports.register = async (req, res) => {
    try {
        const { name, email, phone, password, secretanswer, address } = req.body;

        if (!name || !email || !phone || !password || !secretanswer || !address) {
            return res.status(400).send('Please fill all the Fields')
        }

        const userExist = await Usermodel.findOne({ email })
        if (userExist) {
            return res.status(200).send('User already Exist,Please Login to continue')
        }

        const hash = await hashpassword(password)
        const newuser = new Usermodel({ name, email, phone, password: hash, secretanswer, address })

        const usersave = await newuser.save();
        res.status(200).send({ message: 'User Registration Successful', usersave });

    }
    catch (error) {
        res.status(400).send({ message: 'User Registration Failed', error: error.message });
    }
}

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send('Please fill all the Fields')
        }

        const user = await Usermodel.findOne({ email })
        if (!user) {
            return res.status(400).send('User not Found')
        }

        const match = await compare(password, user.password)
        if (!match) {
            return res.status(400).send({ message: 'Invalid credentials' })
        }

        const token = await user.generateToken();
        res.status(200).send({ message: 'Login successfull',token ,user})

    }
    catch (error) {
        res.status(400).send({ message: 'Login Failed', error: error.message });
    }
}

// Account Reset
exports.forgotpassword = async (req, res) => {
    try {
        const { email,secretanswer, newpassword } = req.body;

        if (!email || !newpassword || !secretanswer) {
            return res.status(400).send('Please fill all the Fields')
        }

        const user = await Usermodel.findOne({ email ,secretanswer})
        if (!user) {
            return res.status(400).send('User not Found')
        }

        const hash = await hashpassword(newpassword)
        const updatePassword=await Usermodel.findByIdAndUpdate(user._id,{password:hash},{new:true})
        
        res.status(200).send({ message: 'Account reset Successfully'})

    }
    catch (error) {
        res.status(400).send({ message: 'Account Reset Failed' , error});
    }
}

// User Edit
exports.edituser= async (req, res) => {
    try {
        const { name,email,phone, address } = req.body;

        if (!name || !email || !phone || !address) {
            return res.status(400).send('Please fill all the Fields')
        }

        const updateUser=await Usermodel.findByIdAndUpdate(req.user._id,{name,email,phone,address},{new:true})
        res.status(200).send({ message: 'User updated Successfully',updateUser})


    } catch (error) {
        res.status(400).send({ message: 'User Update Failed' , error});
    }
}

// Get orders
exports.getorder=async(req,res)=>{
    try {
        const orders=await Ordermodel.find({buyer:req.user._id}).populate("product").populate("buyer","name")
        res.status(200).send(orders);
    } catch (error) {
        res.status(400).send(error);
    }
}


// Get all orders
exports.getAllOrders=async(req,res)=>{
    try {
        const orders=await Ordermodel.find({}).populate("product").populate("buyer","name").sort({createdAt:-1})
        res.status(200).send(orders);
    } catch (error) {
        res.status(400).send(error);
    }
}

// order status
exports.orderStatus=async (req,res)=>{
    try
    {
            const {id}=req.params;
            const {status}=req.body;
            const orders=await Ordermodel.findByIdAndUpdate(id,{status},{new:true});
            res.status(200).send(orders)
    }
    catch(error)
    {
        res.status(400).send(error);

    }
}
