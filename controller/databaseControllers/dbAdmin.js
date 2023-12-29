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

exports.createDatabase = async (req, res, next) => {
  const { userId, name } = req.body;
  try {
    // General error handling for validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Database Creation Failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    // Checking if the database already exists with the same name
    const checkAvailability = await Database.findOne({ name });
    if (checkAvailability) {
      const error = new Error(
        "Database already exists with this name, try something new!!!"
      );
      error.statusCode = 403;
      throw error;
    }

    // Creating the database
    const database = new Database({
      name,
      //   users: [
      //     {
      //       userId,
      //       role: "owner", // Assigning the user creating the database as an "owner"
      //     },
      //   ],
    });

    // Saving the new database
    const result = await database.save();

    // finding user
    const user = await User.findById(userId);

    result.users.push({
      userId,
      role: "owner",
      name: user.name,
      email: user.email,
    });

    const updatedDatabase = await result.save();

    // Pushing the database ID to the user model

    user.databases.push(result._id);
    await user.save();

    // Sending the response to the client
    res.status(201).json({
      message: "New Database Created Successfully!!!",
      result: updatedDatabase,
    });
  } catch (err) {
    generalPromiseError(err);
    next(err); // Passing the error to the Express error handling middleware
  }
};

exports.addNewMember = async (req, res, next) => {
  const { userId, dbId, email, role } = req.body;

  try {
    // Find the database by ID
    const database = await Database.findById(dbId);
    if (!database) {
      errorMessageStatus("Database not found.", 404);
    }

    // Find the user performing the action
    const user = await User.findById(userId);
    if (!user) {
      errorMessageStatus("User not found.", 404);
    }

    // Check if the user has authorization (owner, admin, or teamLeader) in the specified database
    const userInDatabase = database.users.find(
      (user) =>
        user.userId.toString() === userId &&
        ["owner", "admin", "teamLeader"].includes(user.role)
    );
    if (!userInDatabase) {
      errorMessageStatus("Not authorized!!!", 403);
    }

    // Find the user to be added by email
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      errorMessageStatus("User to add not found.", 404);
    }

    // Add the new member to the database
    database.users.push({
      userId: userToAdd._id,
      role: role,
      name: userToAdd.name,
      email: userToAdd.email,
    });

    // Update the user model with the database ID
    userToAdd.databases.push(database._id);
    await userToAdd.save();

    // Save the updated database
    const updatedDatabase = await database.save();

    res.status(200).json({
      message: "New member added successfully!",
      database: updatedDatabase,
    });
  } catch (err) {
    next(err);
  }
};

exports.removeUser = async (req, res, next) => {
  const { userId, dbId, removeUserId } = req.body;

  try {
    const db = await Database.findById(dbId); //.populate("users.userId");
    if (!db) {
      errorMessageStatus(
        "Cannot find database, Please try again later!!!",
        404
      );
    }
    const users = db.users;

    // check if owner
    const user = users.find((user) => user.userId == userId);

    if (user.role === "viewOnly") {
      errorMessageStatus("You're not authorized to perform this action.", 403);
    }

    // removing the user
    const otherUser = users.find((user) => user.userId == removeUserId);

    if (otherUser.role === "owner") {
      errorMessageStatus("Cannot Remove the Owner.", 403);
    }

    users.pull(otherUser);
    const result = await db.save();

    const userDb = await User.findById(removeUserId);
    userDb.databases.pull(db._id);
    await userDb.save();

    res.json({
      message: "User Removed Successfully!!!",
      result,
    });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};
