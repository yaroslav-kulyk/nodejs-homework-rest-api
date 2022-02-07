const { getContactById } = require("../../services/contacts/contactsService");

const getById = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { contactId } = req.params;

    const contact = await getContactById(_id, contactId);
    res.json(contact);
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed")) {
      error.status = 404;
    }
    next(error);
  }
};

module.exports = getById;
