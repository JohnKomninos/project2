const mongoose = require('mongoose')

const food = new mongoose.Schema({
  name:String,
})

const healthyFood = mongoose.model('HealthyFood', food)

module.exports = healthyFood
