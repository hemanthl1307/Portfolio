const express=require("express");
const router=express.Router();
const profileController=require("../controllers/profileController");
const statsController=require("../controllers/statsController");
const messageController=require("../controllers/messageController");

router.get("/profile",profileController.getProfile);
router.get("/stats/github",statsController.github);
router.get("/stats/leetcode",statsController.leetcode);
router.post("/messages",messageController.createMessage);

module.exports=router;
