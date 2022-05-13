const mongoose = require('mongoose')

const users = new mongoose.Schema({
name:String,
age:Number,
height:Number
})

const userInfo = mongoose.model('users', users)

module.exports = userInfo
