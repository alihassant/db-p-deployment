const express = require("express");

const dbUserController = require("../controller/databaseControllers/dbUser");
const dbAdminController = require("../controller/databaseControllers/dbAdmin");

const router = express.Router();

router.post("/createDatabase", dbAdminController.createDatabase);

router.post("/addNewMember", dbAdminController.addNewMember);

router.get("/getUsers", dbUserController.getUsers);

router.post("/removeUser", dbAdminController.removeUser);

router.get("/getPosts", dbUserController.getPosts);

// router.post("/editUser", userController.editUser);

module.exports = router;
