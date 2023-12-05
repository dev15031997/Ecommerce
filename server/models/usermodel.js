const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    secretanswer: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    address: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})

UserSchema.methods.generateToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token: token });
        await this.save()
        return token;
    } catch (error) {
        console.log('Could not generate Token')
    }
}

const Usermodel = mongoose.model('User', UserSchema);

module.exports = Usermodel;