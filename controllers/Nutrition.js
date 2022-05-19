const express = require('express');
const router = express.Router();
const Schema = require('../models/UserSchema.js')
const FoodSchema = require('../models/foodSchema.js')
const nutrition = require('../models/data.js')
const foods = require('../models/fooddata.js')

////the root redirects to my index page
router.get('/', (req,res)=>{
  res.redirect('/NutritionIndex/')
})

///the index pags is rendered
router.get('/NutritionIndex/', (req,res)=>{
  res.render('NutritionIndex.ejs')
})

////if you enter a name that already exists, you get sent to the login already taken page. if the name doesnt exist in my database, the new user schema is created.
router.post('/NutritionIndex/', (req,res)=>{
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

///after the login in screen, you are brough to the first form to fill out.
router.get('/Nutrition/', (req,res)=>{
  res.render('Nutrition.ejs')
})

///based on the submitted req.body from the /nutrition/ form, a calculation is run to determine recommended calories.
router.get('/Nutrition/Results/', (req,res)=>{
  Schema.find({status:'Active'}, (err,results)=>{
    let formula = 0
    if(results[0].ActivityLevel==="None"){
      results[0].ActivityLevel=1
    } else if(results[0].ActivityLevel==="Light"){
      results[0].ActivityLevel=1.2
    } else if(results[0].ActivityLevel==="Moderate"){
      results[0].ActivityLevel=1.4
    } else{
      results[0].ActivityLevel=1.6
    }
    if(results[0].Goal==="loseWeight"){
      results[0].Goal=0.8
    } else if(results[0].Goal==="maintainWeight"){
      results[0].Goal=1
    } else {
      results[0].Goal=1.2
    }
    if(results[0].Sex==="male"){
      formula = Math.round(((66.47+(13.75 * results[0].Weight) + (5.003 * results[0].Height) - (6.755 * results[0].Age))*results[0].ActivityLevel)*results[0].Goal)
    } else{
      formula = Math.round(((655.1+(9.563* results[0].Weight) + (1.85 * results[0].Height) - (4.676 * results[0].Age))*results[0].ActivityLevel)*results[0].Goal)
    }

    Schema.findOneAndUpdate({status:'Active'} , {calories:formula}, {new:true}, (err,data)=>{
    res.render('results.ejs', {result:results, final:formula})
    })
  })
})

//this brings you to the new page which has a form for creating a new food
router.get('/Nutrition/:id/new', (req,res)=>{
  Schema.find({status:'Active'}, (err,data)=>{
      res.render('new.ejs', {userInfo:data})
  })
})

////this is the person show page for the user. Their is also a calculation in here, totaling their calories accross all chosen and created items.
router.get('/Nutrition/:id', (req,res)=>{
  Schema.find({status:'Active'}, (err,userData)=>{
    let total = 0
    for(let i = 0; i < userData[0].foodinformation.length;i++){
    total += userData[0].foodinformation[i].totalCalories
    }
      res.render('show.ejs', {userInfo:userData, totals:total})
  })
})

///This is the page with the form that lets you edit any of your previous inputted personal information.
router.get('/Nutrition/:id/edit', (req,res)=>{
    Schema.findById(req.params.id, (err,data)=>{
      res.render('edit.ejs',{edit:data})
    })
})

//this page shows you the details on your chosen and created foods as well as lets you set serving sizes.
router.get('/Nutrition/:id/:id1',(req,res)=>{
  Schema.find({status:'Active'},(err,data)=>{
  res.render('servingsize.ejs', {userInfo:data, id:req.params.id, index:req.params.id1})
  })
})

//This form takes your personal information and adds it to the user schema
router.post('/Nutrition/', (req,res)=>{
  // Schema.updateMany({status:'Active'},{status:'not active'}, {new:true}, (err,userInfo)=>{
  // Schema.create(req.body, (err, userInfo)=>{
  Schema.findOneAndUpdate({status:'Active'},req.body, {new:true}, (err,updateData)=>{
    res.redirect('/Nutrition/Results/')
  })
  })

//This form takes your update personal information and updates the schema
  router.put('/Nutrition/:id', (req,res)=>{
    Schema.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err,updateModel)=>{
      res.redirect(`/Nutrition/Results`)
    })
  })

//This form lets you delete any chosen or created food items
  router.delete('/Nutrition/:id', (req,res)=>{
    Schema.find({status:'Active'}, (err,id)=>{
    Schema.updateOne({status:'Active'}, {$pull:{foodinformation:{_id:req.params.id}}},(err,data)=>{
      res.redirect(`/Nutrition/${id[0]._id}/`)
    })
  })
  })

//this form lets you delete your entire account
  router.delete('/Nutrition/:id/:id1', (req,res)=>{
    Schema.findByIdAndRemove(req.params.id1, (err,data)=>{
      console.log(req.params.id)
      res.redirect('/NutritionIndex/')
    })
  })

//this form pushes the new food information into the schema. if the name is a repeat, the item will not go into the schema.
  router.post('/Nutrition/:id/', (req,res)=>{
    Schema.find({status:'Active'}, (err,id)=>{
      for(let i=0; i<id[0].foodinformation.length;i++){
        if(id[0].foodinformation[i].name===req.body.name){
          res.redirect(`/Nutrition/${id[0]._id}/`)
          return
        }
      }

      Schema.findOneAndUpdate({status:'Active'},{$push:{foodinformation:req.body}}, {new:true}, (err,updateData)=>{
        let newCalories=req.body.calories
        // console.log(newCalories)
        Schema.findOneAndUpdate({status:'Active', "foodinformation.name":req.body.name}, {$set:{'foodinformation.$.totalCalories':req.body.calories}}, (err,data)=>{
      res.redirect(`/Nutrition/${id[0]._id}/`)
      })
    })
  })
  })

//This lets you set the number of servings. a calculation is also run to updated the total calories based on the number of servings.
  router.post('/Nutrition/:id/:id1', (req,res)=>{
    Schema.find({status:'Active'}, (err,data1)=>{
    let food = data1[0].foodinformation[req.params.id1].name
    Schema.findOneAndUpdate({status:'Active', "foodinformation.name":food},{$set:{'foodinformation.$.numberofservingsize':req.body.numberofservingsize}} , (err,data)=>{
      let updatedServingSize = data1[0].foodinformation[req.params.id1].calories * req.body.numberofservingsize
      Schema.findOneAndUpdate({status:'Active', "foodinformation.name":food},{$set:{'foodinformation.$.totalCalories':updatedServingSize}}, (err,data2)=>{
    res.redirect(`/Nutrition/${data1[0]._id}/`)
  })
  })
  })
  })

module.exports = router;
