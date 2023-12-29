const express = require("express");

const superAdminController = require("../controller/superAdmin");

const router = express.Router();

router.post("/deleteUser", superAdminController.deleteUser);

module.exports = router;
