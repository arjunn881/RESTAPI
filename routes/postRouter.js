const Post = require("../models/Post");
const User = require("../models/User");

const router = require("express").Router();

//create a post

router.post("/", async (req, res, next) => {
  const newPost = new Post(req.body);

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }

  next();
});

//Update a post

router.put("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("post has been updated successfully");
    } else {
      res.status(403).json("you can update your post");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
  next();
});

//delete a post

router.delete("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("post has been deleted successfully");
    } else {
      res.status(403).json("you can delete your post");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
  next();
});

// like/ dislike a post

router.put("/:id/like", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been unliked");
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }

  next();
});

// get a post

router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
  next();
});

//Get timeline of posts

router.get("/timeline/add", async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (error) {
    res.status(500).json(error);
  }

  next();
});

module.exports = router;
