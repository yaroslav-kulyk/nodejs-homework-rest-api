const express = require("express");

const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");
const {
  signupController,
  verifyController,
  requestVerifyController,
  loginController,
  updateSubscriptionController,
  uploadAvatarController,
  getUser,
  logoutController,
} = require("../../controllers/users");

const router = express.Router();

router.post("/signup", signupController);
router.get("/verify/:verificationToken", verifyController);
router.post("/verify", requestVerifyController);
router.post("/login", loginController);
router.get("/logout", authenticate, logoutController);
router.get("/current", authenticate, getUser);
router.patch("/", authenticate, updateSubscriptionController);
router.patch("/avatars", authenticate, upload.single("avatar"), uploadAvatarController);

module.exports = router;
