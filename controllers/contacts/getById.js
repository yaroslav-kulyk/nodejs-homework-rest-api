const { NotFound } = require("http-errors");
const { Contact } = require("../../model/contact");

const getById = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { contactId } = req.params;
    const contact = await Contact.findOne({ owner: _id, _id: contactId }, "-createdAt -updatedAt");

    if (!contact) {
      throw new NotFound();
    }

    res.json(contact);
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed")) {
      error.status = 404;
    }
    next(error);
  }
};

module.exports = getById;
