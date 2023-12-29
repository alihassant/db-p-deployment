const express = require("express");
const { body } = require("express-validator");

const postDataController = require("../controller/post-data");

const router = express.Router();

router.post("/postData", postDataController.postData);

router.get("/getData/:postId", postDataController.getData);

router.post("/updateData/:postId", postDataController.updateData);

router.post("/deletePost", postDataController.deletePost);

router.get("/allPosts", postDataController.allPosts);

module.exports = router;

// http://localhost:8080/getData/658352806036e87046c9d5fa

// json request data format for postman
/* 
{
    "userId": "6588b97e5725a334fb6e8fc0",
    "carName": "xyz",
    "carModel": "abc",
    "carPurchasePrice": "1899",
    "carSellPrice": "2000",
    "remarks": "Sold Car Data Updated!!!"
}
*/
