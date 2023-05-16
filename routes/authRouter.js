const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//Register

router.post("/register", async (req, res, next) => {
  try {
    //generate new Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //Create New User
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      city: req.body.city,
      desc: req.body.desc,
      form: req.body.form,
    });
    //save user and responce
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

//Login

router.post("/login", async (req, res, next) => {
  try {
    //matching email
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");
    //validation password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("wrong password");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
