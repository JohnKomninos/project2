const mongoose = require('mongoose')

const food = new mongoose.Schema({
  name:String,
  calories:Number,
  protein:Number,
  carbohydrates:Number,
  fat:Number,
  fiber:Number,
  sugar:Number,
  servingsize:Number,
  numberofservingsize:Number,
  image:String,
  totalCalories:Number
})

const healthyFood = mongoose.model('HealthyFood', food)

module.exports = healthyFood
