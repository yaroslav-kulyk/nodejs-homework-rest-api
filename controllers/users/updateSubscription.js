const { BadRequest } = require("http-errors");
const { joiSubscriptionSchema } = require("../../model/user");

const { updateSubscription } = require("../../services/users/usersService");

const updateSubscriptionController = async (req, res, next) => {
  try {
    const { error } = joiSubscriptionSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }

    const { _id } = req.user;
    const { subscription } = req.body;

    const result = await updateSubscription(_id, subscription);
    res.json(result);
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed")) {
      error.status = 404;
    }
    next(error);
  }
};

module.exports = updateSubscriptionController;
