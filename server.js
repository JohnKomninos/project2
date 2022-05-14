//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const Schema = require('./models/UserSchema.js')
const CalorieSchema = require('./models/ResultsSchema.js')
const UserInfo = require('./models/userinfo.js')
const nutrition = require('./models/data.js')
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

app.get('/Nutrition/', (req,res)=>{
  res.render('index.ejs')
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
    const storedData={
      calories:formula,
      status:"Active"
    }
    CalorieSchema.updateMany({status:'Active'},{status:'not active'}, {new:true}, (err,userInfo)=>{
    CalorieSchema.create(storedData, (err,data)=>{
    res.render('results.ejs', {result:results, final:formula})
    })
    })
  })
})

app.post('/Nutrition/', (req,res)=>{
  Schema.updateMany({status:'Active'},{status:'not active'}, {new:true}, (err,userInfo)=>{
  Schema.create(req.body, (err, userInfo)=>{
    res.redirect('/Nutrition/Results/')
  })
  })
})

app.get('/Nutrition/seed/' , (req,res)=>{
  Schema.create(nutrition, (err,seedData)=>{
    res.redirect('/')
  })
})

app.get('/login/', (req,res)=>{
  res.render('login.ejs')
})

app.post('/login', (req,res)=>{
  UserInfo.find({}, (err,data)=>{
    for(let i=0;i<data.length;i++){
      if(req.body.username.toLowerCase()=== data[i].username.toLowerCase()){
          res.redirect('/loginalreadytaken')
          return
      }
    }
    UserInfo.create(req.body, (err,data)=>{
      res.redirect('/logincomplete/')
  })
  })
})

app.get('/logincomplete/', (req,res)=>{
  UserInfo.find({}, (err,data)=>{
      let activeUser=data[data.length-1].username
      res.render('logincomplete.ejs', {finalUser:activeUser})
  })
})

app.get('/loginalreadytaken/' , (req,res)=>{
  res.render('loginalreadytaken.ejs')
})


//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
