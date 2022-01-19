const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs/promises");

const { BadRequest, Conflict, Unauthorized, NotFound } = require("http-errors");
const { User, joiSchema, joiSubscriptionSchema } = require("../../model/user");
const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");
const gravatar = require("gravatar");
const Jimp = require("jimp");

const router = express.Router();
const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const resize = async (filepath) => {
  const avatar = await Jimp.read(filepath);
  avatar.resize(250, 250).write(filepath);
};

router.post("/signup", async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);

    if (error) {
      throw new BadRequest(error.message);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new Conflict("Email in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({ email, password: hashPassword, avatarURL });
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Unauthorized("Email or password is wrong");
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
    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/logout", authenticate, async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send();
});

router.get("/current", authenticate, async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    user: {
      email,
      subscription,
    },
  });
});

router.patch("/", authenticate, async (req, res, next) => {
  try {
    const { error } = joiSubscriptionSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }

    const { _id, email } = req.user;
    const { subscription } = req.body;

    const user = await User.findByIdAndUpdate(_id, { subscription }, { new: true });

    if (!user) {
      throw new NotFound();
    }

    res.json({
      user: {
        email,
        subscription,
      },
    });
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed")) {
      error.status = 404;
    }
    next(error);
  }
});

router.patch("/avatars", authenticate, upload.single("avatar"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new BadRequest("No files attached");
    }
    const { path: tempUpload, filename } = req.file;
    await resize(tempUpload);

    const [extension] = filename.split(".").reverse();
    const newFileName = `${req.user._id}.${extension}`;
    const fileUpload = path.join(avatarsDir, newFileName);

    await fs.rename(tempUpload, fileUpload);
    const avatarURL = path.join("avatars", newFileName);

    await User.findByIdAndUpdate(req.user._id, { avatarURL }, { new: true });
    res.json({ avatarURL });
  } catch (error) {
    if (error.message.includes("Unsupported MIME type")) {
      error.status = 400;
    }
    if (req.file) {
      await fs.unlink(req.file.path);
    }

    next(error);
  }
});

module.exports = router;
