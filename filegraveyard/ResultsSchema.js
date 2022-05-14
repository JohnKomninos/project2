const mongoose = require('mongoose')

const calorieSchema = new mongoose.Schema({
  calories:Number,
  status:String
})

const calories = mongoose.model('Calories', calorieSchema)

module.exports = calories
