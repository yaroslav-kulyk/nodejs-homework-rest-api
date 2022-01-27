const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { BadRequest } = require("http-errors");

const { User } = require("../../model/user");

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const resize = async (filepath) => {
  const avatar = await Jimp.read(filepath);
  avatar.resize(250, 250).write(filepath);
};

const uploadAvatar = async (req, res, next) => {
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
};

module.exports = uploadAvatar;
