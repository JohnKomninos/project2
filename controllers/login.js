const express = require('express');
const router = express.Router();
const Schema = require('../models/UserSchema.js')



router.get('/', (req,res)=>{
  res.redirect('/login/')
})

router.get('/login/', (req,res)=>{
  res.render('login.ejs')
})

router.post('/login', (req,res)=>{
  Schema.find({}, (err,data)=>{
    for(let i=0;i<data.length;i++){
      if(req.body.username.toLowerCase()=== data[i].username.toLowerCase()){
          res.redirect('/loginalreadytaken')
          return
      }
    }
    Schema.updateMany({status:'Active'},{status:'not active'}, {new:true}, (err,userInfo)=>{
      const body = {
        name:req.body.name,
        username:req.body.username.toLowerCase(),
        status:req.body.status
      }
    Schema.create(body, (err,data)=>{
      res.redirect('/Nutrition/')
  })
  })
})
})

router.get('/loginalreadytaken/' , (req,res)=>{
  res.render('loginalreadytaken.ejs')
})

module.exports = router;
