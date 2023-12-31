const { validationResult } = require("express-validator");

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

exports.deleteUser = async (req, res, next) => {
  const { email, userId } = req.body;
  try {
    const checkAdmin = await User.findById(userId);
    if (checkAdmin.extraRole !== "superAdmin") {
      errorMessageStatus(
        "You are not authorized to perform this function.",
        403
      );
    }
    await User.findOneAndDelete({ email });
    res.status(200).json({
      message: "User Deleted Successfully!!!",
    });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};

exports.getDatabases = async (req, res, next) => {
  const { userId } = req.body;
  try {
    const checkAdmin = await User.findById(userId);
    if (checkAdmin.extraRole !== "superAdmin") {
      errorMessageStatus(
        "You are not authorized to perform this function.",
        403
      );
    }
    const databases = await Database.find();

    res.status(200).json({
      message: "All Databases Fetched Successfully!!!",
      databases,
    });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};
