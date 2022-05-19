const express = require('express');
const router = express.Router();
const Schema = require('../models/UserSchema.js')
const FoodSchema = require('../models/foodSchema.js')
const nutrition = require('../models/data.js')
const foods = require('../models/fooddata.js')

router.get('/FoodIndex/', (req,res)=>{
  FoodSchema.find({}, (err,data)=>{
    res.render('food.ejs', {food:data})
  })
})

router.get('/FoodIndex/:id', (req,res)=>{
  FoodSchema.findById(req.params.id, (err,data)=>{
    res.render('foodshow.ejs', {foodstats:data})
  })
})

router.post('/FoodIndex/:id', (req,res)=>{
  Schema.find({status:'Active'}, (err,userId)=>{
  FoodSchema.findById(req.params.id, (err,data)=>{
  for(let i = 0;i<userId[0].foodinformation.length;i++){
    if(userId[0].foodinformation[i].name===data.name){
      res.redirect(`/Nutrition/${userId[0]._id}/`)
      return
    }
  }
  Schema.findOneAndUpdate({status:'Active'},{$push:{foodinformation:data}}, {new:true}, (err,updateData)=>{
    res.redirect(`/Nutrition/${userId[0]._id}/`)
  })
  })
})
})

module.exports = router;
