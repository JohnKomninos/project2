const mongoose = require('mongoose')

const user = new mongoose.Schema({
  username:{type:String, required:true, unique:true}
})

const userInfo = mongoose.model('UserInfo', user)

module.exports = userInfo
