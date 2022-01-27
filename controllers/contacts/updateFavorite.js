const { NotFound, BadRequest } = require("http-errors");
const { Contact, joiFavoriteSchema } = require("../../model/contact");

const updateFavorite = async (req, res, next) => {
  try {
    const { error } = joiFavoriteSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }

    const { _id } = req.user;
    const { contactId } = req.params;
    const { favorite } = req.body;

    const updateContact = await Contact.findOneAndUpdate(
      { owner: _id, _id: contactId },
      { favorite },
      {
        new: true,
        fields: "-createdAt -updatedAt",
      }
    );

    if (!updateContact) {
      throw new NotFound();
    }

    res.json(updateContact);
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
