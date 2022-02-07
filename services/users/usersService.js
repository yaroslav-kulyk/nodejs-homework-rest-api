const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");
const { BadRequest, Unauthorized, NotFound, Conflict } = require("http-errors");

const { User } = require("../../model/user");
const sendEmail = require("../../helpers/sendEmail");

const { SECRET_KEY, SITE_NAME } = process.env;

const register = async (email, password) => {
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict("Email in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const verificationToken = nanoid();
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    email,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const data = {
    to: email,
    subject: "Подтвердите email",
    html: `<a target="_blank" href="${SITE_NAME}/users/verify/${verificationToken}">Подтвердить email</a>`,
  };

  await sendEmail(data);
  return {
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthorized("Email or password is wrong");
  }
  if (!user.verify) {
    throw new Unauthorized("Email is not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw new Unauthorized("Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  await User.findByIdAndUpdate(user._id, { token });
  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
};

const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { token: null });
};

const verify = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw new NotFound("User not found");
  }
  await User.findByIdAndUpdate(user._id, { verificationToken: null, verify: true });
};

const requestVerify = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFound("User not found");
  }
  if (user.verify) {
    throw new BadRequest("Verification has already been passed");
  }

  const { verificationToken } = user;
  const data = {
    to: email,
    subject: "Подтвердите email",
    html: `<a target="_blank" href="${SITE_NAME}/users/verify/${verificationToken}">Подтвердить email</a>`,
  };

  await sendEmail(data);
};

const updateSubscription = async (userId, subscription) => {
  const user = await User.findByIdAndUpdate(userId, { subscription }, { new: true });

  if (!user) {
    throw new NotFound();
  }

  return {
    user: {
      email: user.email,
      subscription,
    },
  };
};

const uploadAvatar = async (userId, avatarURL) => {
  await User.findByIdAndUpdate(userId, { avatarURL });
};

module.exports = {
  register,
  login,
  logout,
  verify,
  requestVerify,
  updateSubscription,
  uploadAvatar,
};
