const { BadRequest, NotFound } = require("http-errors");
const { User, joiSubscriptionSchema } = require("../../model/user");

const updateSubscription = async (req, res, next) => {
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
};

module.exports = updateSubscription;
