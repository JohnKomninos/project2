const express = require('express');
const router = express.Router();
const Schema = require('../models/UserSchema.js')

////This page allows you to search for an existing account///
router.get('/existing/', (req,res)=>{
  res.render('existing.ejs')
})

////The username enetered is checked against my data base. If the name is found, you are brought to your show page
router.post('/existing/', (req,res)=>{
  Schema.find({}, (err,data)=>{
    for(let i=0; i<data.length;i++){
      if(req.body.username.toLowerCase()=== data[i].username.toLowerCase()){
        Schema.updateMany({status:'Active'}, {status:'not active'}, {new:true}, (err,userInfo)=>{
          Schema.findOneAndUpdate({username:req.body.username.toLowerCase()}, {status:'Active'}, {new:true}, (err,active)=>{
            res.redirect(`/Nutrition/${active._id}/`)
            return
          })
        })
      }
    }
  })
})
module.exports = router;
