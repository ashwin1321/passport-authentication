const res = require("express/lib/response");

const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { genSalt } = require("bcrypt");
const passport = require("passport");



// ======= Login Page =======
router.get("/login", (req, res) => {
  res.render("login");
});

// ======= register Page =======
router.get("/register", (req, res) => {
  res.render("register");
});

// ======= Register handle =======
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // check required fields
  if (!name || !email || !password2 || !password) {
    errors.push({ msg: "please fill in all fields" });
  }

  // check password match
  if (password !== password2) {
    errors.push({ msg: "Password not matched..." });
  }

  // check password length
  if (password.length < 6) {
    errors.push({ msg: "password too short, must be atleast 6 characterss" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                console.log(newUser);
                res.redirect("/users/login");
                
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
})


// ======= Login =======
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
  
});

router.get('/logout',(req,res)=>{
  // req.logout()
  req.flash('success_msg', "You are logged out")
  res.redirect('/users/login')
})

module.exports = router;

