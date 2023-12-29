const { validationResult } = require("express-validator");

const Post = require("../models/postData");
const User = require("../models/user");
const Database = require("../models/database");

const generalPromiseError = (err) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
};

const errorMessageStatus = (errorMessage, errorStatusCode) => {
  const error = new Error(errorMessage);
  error.statusCode = errorStatusCode;
  throw error;
};

// creating a post
exports.postData = async (req, res, next) => {
  const {
    carName,
    carModel,
    carPurchasePrice,
    carSellPrice,
    remarks,
    userId,
    dbId,
  } = req.body;
  //   console.log(carName, carModel, carPurchasePrice, carSellPrice, remarks);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Post Creation Failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    let creator;
    const post = new Post({
      carName,
      carModel,
      carPurchasePrice,
      carSellPrice,
      remarks,
      dbId,
      creator: userId,
    });
    await post.save();

    const db = await Database.findById(dbId);
    db.posts.push(post);
    await db.save();

    const user = await User.findById(userId);
    creator = user;
    user.entries.push(post);
    await user.save();
    res.status(201).json({
      message: "Entry created successfully!",
      post,
      creator: { _id: creator._id, name: creator.name },
    });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};

// finding 1 post
exports.getData = async (req, res, next) => {
  const { postId } = req.params;
  // for testing
  // const postId = "6585bd07522fcf798512705f"; //req.body; "6584c0b0740553af89c80303";

  try {
    const post = await Post.findById(postId).populate("creator");
    const profit = +post.carSellPrice - +post.carPurchasePrice;
    if (!post) {
      errorMessageStatus("Could not find post.", 404);
    }
    res.status(200).json({
      message: "Post fetched!",
      post,
      profit,
    });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};

// updating an existing post
exports.updateData = async (req, res, next) => {
  const { postId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorMessageStatus("Validation failed, entered data is incorrect.", 422);
  }
  const { userId, carName, carModel, carPurchasePrice, carSellPrice, remarks } =
    req.body;
  try {
    const post = await Post.findById(postId).populate("creator");
    if (!post) {
      errorMessageStatus("Could not find post.", 404);
    }
    if (post.creator._id.toString() !== userId) {
      errorMessageStatus("Not authorized!", 403);
    }

    post.carName = carName;
    post.carModel = carModel;
    post.carPurchasePrice = carPurchasePrice;
    post.carSellPrice = carSellPrice;
    post.remarks = remarks;

    const result = await post.save();
    res.status(200).json({
      message: "Entry Updated!!!",
      result,
    });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};

// deleting an existing post
exports.deletePost = async (req, res, next) => {
  const { postId, userId } = req.body;
  try {
    const post = await Post.findById(postId).populate("creator");
    if (!post) {
      errorMessageStatus("Could not find post.", 404);
    }
    if (post.creator._id.toString() !== userId) {
      errorMessageStatus("Not authorized!", 403);
    }
    await Post.findByIdAndDelete(postId);

    const user = await User.findById(userId);

    user.entries.pull(post);

    await user.save();

    res.status(201).json({
      message: "Post Deleted successfully!",
    });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};

// finding all posts
// incomplete api, will update it when i'll work on individual databases
exports.allPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    // add more logic here when necessary
    res.status(200).json({
      message: "Fetched All Posts Successfully!!!",
      posts,
    });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};
