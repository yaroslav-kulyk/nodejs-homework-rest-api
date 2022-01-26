const express = require("express");

const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");
const {
  signup,
  verify,
  requestVerify,
  login,
  updateSubscription,
  uploadAvatar,
  getUser,
  logout,
} = require("../../controllers/users");

const router = express.Router();

router.post("/signup", signup);

router.get("/verify/:verificationToken", verify);

router.post("/verify", requestVerify);

router.post("/login", login);

router.get("/logout", authenticate, logout);

router.get("/current", authenticate, getUser);

router.patch("/", authenticate, updateSubscription);

router.patch("/avatars", authenticate, upload.single("avatar"), uploadAvatar);

module.exports = router;
