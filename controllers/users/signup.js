const { BadRequest } = require("http-errors");

const { joiSchema } = require("../../model/user");
const { register } = require("../../services/users/usersService");

const signupController = async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }

    const { email, password } = req.body;
    const newUser = await register(email, password);

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

module.exports = signupController;
