const { BadRequest } = require("http-errors");
const { joiFavoriteSchema } = require("../../model/contact");
const { updateFavoriteById } = require("../../services/contacts/contactsService");

const updateFavorite = async (req, res, next) => {
  try {
    const { error } = joiFavoriteSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }

    const { _id } = req.user;
    const { contactId } = req.params;
    const { favorite } = req.body;

    const updateFavorite = await updateFavoriteById(_id, contactId, favorite);
    res.json(updateFavorite);
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed")) {
      error.status = 404;
    }
    if (error.message.includes("Cast to Boolean failed")) {
      error.status = 400;
    }
    next(error);
  }
};

module.exports = updateFavorite;
