const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please enter user name']
    },
    email: {
        type: String,
        required: ['true', 'please provide email'],
        unique: true,
        validate: [validator.isEmail, 'please send valid email address']
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'employer'],
            message: 'please select correct role'
        },
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'please enter password'],
        minlength: [8, 'password must be at least 8 characters long'],
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

// ecrypting the password before save
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10)
})

// return json web token 
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_TIME
    })
}

const myDb = mongoose.connection.useDb(process.env.DB_ONE)
module.exports = myDb.model('User', userSchema)