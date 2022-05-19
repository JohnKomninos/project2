const express = require('express');
const router = express.Router();
const Schema = require('../models/UserSchema.js')

///you are brought to this page if you try to create a user name that already exists
router.get('/loginalreadytaken/' , (req,res)=>{
  res.render('loginalreadytaken.ejs')
})

module.exports = router;
