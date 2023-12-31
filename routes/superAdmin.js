const express = require("express");

const superAdminController = require("../controller/superAdmin");

const router = express.Router();

router.post("/deleteUser", superAdminController.deleteUser);

router.get("/getDatabases", superAdminController.getDatabases);

module.exports = router;
