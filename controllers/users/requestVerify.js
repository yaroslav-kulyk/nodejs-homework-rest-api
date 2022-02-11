const { BadRequest } = require("http-errors");
const { requestVerify } = require("../../services/users/usersService");

const requestVerifyController = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new BadRequest("missing required field email");
    }

    await requestVerify(email);

    res.json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

module.exports = requestVerifyController;
