const User = require("../models/User");
const router = require("express").Router();

//updateUser
router.put("/:id", async (req, res, next) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      console.log(user);
      res.status(200).json("User details updated successfully");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("you can update only your account");
  }
  next();
});
//deleteUser

router.delete("/:id", async (req, res, next) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);

      res.status(200).json("User Deleted Successfully");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("you can delete only your account");
  }
  next();
});

//get an user

router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    console.log(error);
  }
  next();
});

//follow an user

router.put("/:id/follow", async (req, res, next) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!user.follwers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });

        res.status(200).json(" User has been followed");
      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(err);
    }
  }
  next();
});

//unfollow an user

router.put("/:id/unfollow", async (req, res, next) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (user.follwers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });

        res.status(200).json(" User has been unfollowed");
      } else {
        res.status(403).json("You don't follow this user");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(err);
    }
  }
  next();
});

module.exports = router;
