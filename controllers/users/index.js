const signupController = require("./signup");
const verifyController = require("./verify");
const requestVerifyController = require("./requestVerify");
const loginController = require("./login");
const updateSubscriptionController = require("./updateSubscription");
const uploadAvatarController = require("./uploadAvatar");
const getUser = require("./getUser");
const logoutController = require("./logout");

module.exports = {
  signupController,
  verifyController,
  requestVerifyController,
  loginController,
  updateSubscriptionController,
  uploadAvatarController,
  getUser,
  logoutController,
};
