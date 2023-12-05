
const { hashpassword, compare } = require('../middleware/helper');
const Usermodel = require('../models/usermodel')

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
        res.status(400).send({ message: 'User Registration Failed' }, error);
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
        res.status(400).send({ message: 'Login Failed' , error});
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

