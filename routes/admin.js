const express = require("express");

const adminController = require("../controller/adminController");

const router = express.Router();

router.post("/setRole", adminController.setRole);

router.get("/findUser", adminController.findUser);

module.exports = router;
