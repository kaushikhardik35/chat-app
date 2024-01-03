const express = require("express");
const { allMessages, sendMessage } = require("../controllers/message");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;
