const express = require("express");

const userController = require("../controller/user");

const router = express.Router();

router.put("/editUser", userController.editUser);

router.get("/userPosts", userController.userPosts);

router.get("/getUserDatabases", userController.getDatabases);

// router.post("/editUser", userController.editUser);

module.exports = router;
