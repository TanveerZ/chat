const express = require('express')
const app = express()
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const expressValidator = require('express-validator');
//var session = require('express-session');
var db = require('./config/db');
var fs = require('fs');
var url = require('url');
var bodyparser = require('body-parser');
var userRoute = require('./app/modules/users/userRoute');
const PORT = process.env.PORT || 8080;
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
require('./socket')(io)
global.socketConnection = io;

//middleware for cors (cross origin requests)
app.use(cors()); 

var session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

app.use(passport.initialize());
app.use(passport.session());

require('./middlewares/passport')(passport);
app.use(bodyparser.json({limit: "50mb"}));
app.use(bodyparser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

/**
 * Data sentization and disallow url in iframes
 *  */   
 app.use(expressValidator());
 app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // res.setHeader('X-Frame-Options', 'sameorigin');
     for (var item in req.body) {
         try {
             if(typeof req.body[item] == 'string'){
                 req.sanitize(item).escape();
             }else{
                 req.sanitize(item);
             }
                   
         } catch (error) {
             //console.log(error);
         }
       
     }
     next();
 });

 app.set('view engine', 'ejs');

//routes
app.use('/api/v1/user',userRoute);

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
app.use(function (err, req, res, next) {
  //console.log("In error section");
  var status = 500;
  if (err.name == 'ValidationError') {
      status = 400;
  } else if (err.name == 'CastError') {
      status = 404;
  }
  //console.log(err);
  console.log("error",err);
  res.status(status).json({ error: err })
})


server.listen(PORT, () => {
  console.log(`server has been started at port ${PORT}`)
})
module.exports.app = express;