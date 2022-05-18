//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const Schema = require('./models/UserSchema.js')
const FoodSchema = require('./models/foodSchema.js')
const nutrition = require('./models/data.js')
const foods = require('./models/fooddata.js')
const app = express ();
const db = mongoose.connection;
require('dotenv').config()
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3003;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI , ()=>{
    console.log('The connection with mongod is established')
});

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


//___________________
// Routes
//___________________
//localhost:3000

app.get('/', (req,res)=>{
  res.redirect('/login/')
})

app.get('/login/', (req,res)=>{
  res.render('login.ejs')
})

app.post('/login', (req,res)=>{
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

app.get('/loginalreadytaken/' , (req,res)=>{
  res.render('loginalreadytaken.ejs')
})

app.get('/existing/', (req,res)=>{
  res.render('existing.ejs')
})

app.post('/existing/', (req,res)=>{
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

app.get('/error/', (req,res)=>{
  res.render('error.ejs')
})
app.get('/Nutrition/', (req,res)=>{
  res.render('Nutrition.ejs')
})

app.get('/Nutrition/Results/', (req,res)=>{
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

app.get('/Nutrition/:id/new', (req,res)=>{
  Schema.find({status:'Active'}, (err,data)=>{
      res.render('new.ejs', {userInfo:data})
  })
})

app.get('/Nutrition/:id', (req,res)=>{
  Schema.find({status:'Active'}, (err,userData)=>{
    let total = 0
    for(let i = 0; i < userData[0].foodinformation.length;i++){
    total += userData[0].foodinformation[i].totalCalories
    }
      res.render('show.ejs', {userInfo:userData, totals:total})
  })
})

app.get('/Nutrition/:id/edit', (req,res)=>{
    Schema.findById(req.params.id, (err,data)=>{
      res.render('edit.ejs',{edit:data})
    })
})

app.get('/FoodIndex/', (req,res)=>{
  FoodSchema.find({}, (err,data)=>{
    res.render('food.ejs', {food:data})
  })
})

app.get('/FoodIndex/:id', (req,res)=>{
  FoodSchema.findById(req.params.id, (err,data)=>{
    res.render('foodshow.ejs', {foodstats:data})
  })
})

app.get('/Nutrition/:id/:id1',(req,res)=>{
  Schema.find({status:'Active'},(err,data)=>{
  res.render('servingsize.ejs', {userInfo:data, id:req.params.id, index:req.params.id1})
  })
})


app.post('/Nutrition/', (req,res)=>{
  // Schema.updateMany({status:'Active'},{status:'not active'}, {new:true}, (err,userInfo)=>{
  // Schema.create(req.body, (err, userInfo)=>{
  Schema.findOneAndUpdate({status:'Active'},req.body, {new:true}, (err,updateData)=>{
    res.redirect('/Nutrition/Results/')
  })
  })


app.post('/FoodIndex/:id', (req,res)=>{
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

app.put('/Nutrition/:id', (req,res)=>{
  Schema.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err,updateModel)=>{
    res.redirect(`/Nutrition/Results`)
  })
})

app.delete('/Nutrition/:id', (req,res)=>{
  Schema.find({status:'Active'}, (err,id)=>{
  Schema.updateOne({status:'Active'}, {$pull:{foodinformation:{_id:req.params.id}}},(err,data)=>{
    res.redirect(`/Nutrition/${id[0]._id}/`)
  })
})
})

app.post('/Nutrition/:id/', (req,res)=>{
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

app.post('/Nutrition/:id/:id1', (req,res)=>{
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

//
// app.get('/Nutrition/seed/' , (req,res)=>{
//   Schema.create(nutrition, (err,seedData)=>{
//     res.redirect('/')
//   })
// })
  //
  // app.get('/Nutrition/foodseed/', (req,res)=>{
  //   FoodSchema.create(foods, (err,seedData)=>{
  //     res.redirect('/')
  //   })
  // })

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
