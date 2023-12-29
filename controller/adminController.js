const { validationResult } = require("express-validator");

const User = require("../models/user");

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

exports.setRole = async (req, res, next) => {
  const { email, role } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorMessageStatus("Validation failed, entered data is incorrect.", 422);
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      errorMessageStatus("Could not find user.", 404);
    }
    const userOldRole = user.extraRole;
    user.extraRole = role;

    const result = await user.save();
    res.status(200).json({
      message: "Role updated!",
      result,
    });
    console.log(
      `Role Updated for Name: ${result.name}, Email: ${result.email}`
    );
    console.log(`Role Changed from ${userOldRole} to ${result.extraRole}`);
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};

exports.findUser = async (req, res, next) => {
  const { email, userId } = req.body;
  try {
    const checkAdmin = await User.findById(userId);
    if (checkAdmin.extraRole !== "superAdmin") {
      errorMessageStatus(
        "You are not authorized to perform this function.",
        403
      );
    }
    const user = await User.findOne({ email });
    res.status(200).json({
      message: "User Found Successfully!!!",
      user,
    });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};

// exports.setRole = async (req, res, next) => {
//   const { email } = req.body;
//   const userId = "658352806036e87046c9d5fa";
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       errorMessageStatus("Could not find user.", 404);
//     }
//     res.status(200).json({
//       message: "Role updated!",
//       user,
//     });
//   } catch (err) {
//     generalPromiseError(err);
//     next(err);
//   }
// };
