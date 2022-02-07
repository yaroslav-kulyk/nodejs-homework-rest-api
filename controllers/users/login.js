const { BadRequest } = require("http-errors");
const { joiSchema } = require("../../model/user");
const { login } = require("../../services/users/usersService");

const loginController = async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }

    const { email, password } = req.body;
    const token = await login(email, password);

    res.json(token);
  } catch (error) {
    next(error);
  }
};

module.exports = loginController;
