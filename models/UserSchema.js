const mongoose = require('mongoose')

const users = new mongoose.Schema({
  Age:String,
  Sex:String,
  Weight:Number,
  Height:Number,
  ActivityLevel:String,
  Goal:String,
  status:String,
  calories:Number,
  foodinformation:[{
    name:String,
    calories:Number,
    protein:Number,
    carbohydrates:Number,
    fat:Number,
    fiber:Number,
    sugar:Number}]
})

const userInfo = mongoose.model('users', users)

module.exports = userInfo
