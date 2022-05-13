const mongoose = require('mongoose')

const users = new mongoose.Schema({
  Age:{type:String, required:true},
  Sex:{type:String, required:true},
  Weight:{type:Number, required:true},
  Height:{type:Number, required:true},
  ActivityLevel:{type:String, required:true},
  Goal:{type:String, required:true}
})

const userInfo = mongoose.model('users', users)

module.exports = userInfo
