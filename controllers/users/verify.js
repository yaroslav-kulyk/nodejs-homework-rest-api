const { verify } = require("../../services/users/usersService");

const verifyController = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    await verify(verificationToken);

    res.json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = verifyController;
