const { validationResult } = require("express-validator");

const Post = require("../../models/postData");
const User = require("../../models/user");
const Database = require("../../models/database");

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

exports.getUsers = async (req, res, next) => {
  const { dbId } = req.body;

  try {
    const db = await Database.findById(dbId).populate("users.userId");
    if (!db) {
      errorMessageStatus(
        "Cannot find database, Please try again later!!!",
        404
      );
    }
    const dbUsers = db.users;

    res.status(200).json({
      message: "Users Fetched!!!",
      dbUsers,
    });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};

exports.getPosts = async (req, res, next) => {
  const { dbId } = req.params;
  try {
    const db = await Database.findById(dbId).populate("posts");

    const posts = db.posts;

    res.status(200).json({
      message: "Posts Fetched Successfully!!!",
      posts,
    });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};

