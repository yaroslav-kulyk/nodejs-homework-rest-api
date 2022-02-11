const { updateContactById } = require("../../services/contacts/contactsService");

const updateById = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { contactId } = req.params;

    const updateContact = await updateContactById(_id, contactId, req.body);
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
