const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session')
const passport = require('passport')

const app = express()

// passport config
require('./config/passport')(passport);

// DB config
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true})
    .then(()=>console.log('MongoDB connected...'))
    .catch( err => console.log(err))
    

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

//Bodyparser
app.use(express.urlencoded( { extended: false}))

// Express sessions
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// connect flash
app.use(flash())

// Global vars
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

// ROUTES
const index = require("./routes/index")
app.use(index)

const users = require("./routes/users");
// const passport = require('./config/passport');
// const passport = require('./config/passport');
app.use('/users',users)

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`server listening at port ${PORT}`);
})

