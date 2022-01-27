const { NotFound } = require("http-errors");
const { Contact } = require("../../model/contact");

const updateById = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { contactId } = req.params;
    const updateContact = await Contact.findOneAndUpdate({ owner: _id, _id: contactId }, req.body, {
      new: true,
      fields: "-createdAt -updatedAt",
    });

    if (!updateContact) {
      throw new NotFound();
    }

    res.json(updateContact);
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed")) {
      error.status = 404;
    }
    if (error.message.includes("validation failed")) {
      error.status = 400;
    }

    next(error);
  }
};

module.exports = updateById;
