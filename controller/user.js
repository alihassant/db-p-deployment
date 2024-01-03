const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const Post = require("../models/postData");
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

// user setting
exports.editUser = async (req, res, next) => {
  const { userId, name, email, oldPassword, newPassword } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorMessageStatus("Validation failed, entered data is incorrect.", 422);
  }
  try {
    const user = await User.findById(userId);

    if (!user) {
      errorMessageStatus("Could not find user.", 404);
    }
    if (user._id.toString() !== userId) {
      errorMessageStatus("Not authorized!", 403);
    }

    const otherUser = await User.findOne({ email });
    if (otherUser) {
      errorMessageStatus("Email address already exists, try again!!!", 403);
    }

    const isEqual = await bcrypt.compare(oldPassword, user.password);
    if (!isEqual) {
      const error = new Error("Old password is wrong, try again!!!");
      error.statusCode = 401;
      throw error;
    }

    const hashedPw = await bcrypt.hash(newPassword, 12);

    user.name = name;
    user.email = email;
    user.password = hashedPw;

    const result = await user.save();
    res.status(200).json({
      message: "User Updated Successfully!!!",
      result,
    });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};

// users posts for their profile
exports.userPosts = async (req, res, next) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      errorMessageStatus("No user ID found. Please try again later!", 500);
    }
    const posts = await Post.find({ creator: userId });

    if (posts.length <= 0) {
      errorMessageStatus("Could not find any post.", 404);
    }

    res.status(200).json({
      message: "User's Posts Found Successfully!!!",
      posts,
    });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};

// getting/showing the databases the user is in
exports.getDatabases = async (req, res, next) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    const dbs = user.databases;
    if (dbs.length === 0) {
      errorMessageStatus("No Database Found!!!", 404);
    }

    res.status(200).json({
      message: "Databases Fetched Successfully!!!",
      dbs,
    });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};
