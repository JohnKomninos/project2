const express = require('express');
const router = express.Router();
const Schema = require('../models/UserSchema.js')


router.get('/loginalreadytaken/' , (req,res)=>{
  res.render('loginalreadytaken.ejs')
})

module.exports = router;
