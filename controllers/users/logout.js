const { logout } = require("../../services/users/usersService");

const logoutController = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await logout(_id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = logoutController;
