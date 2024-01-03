const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  getChat,
  getChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chat");
const router = express.Router();

router.route("/").post(protect, getChat).get(protect, getChats);
router.route("/group").post(protect, createGroup);
router.route("/rename").put(protect, renameGroup);
router.route("/groupRemove").put(protect, removeFromGroup);
router.route("/groupAdd").put(protect, addToGroup);
module.exports = router;
