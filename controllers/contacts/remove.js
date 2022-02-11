const { deleteContactById } = require("../../services/contacts/contactsService");

const remove = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { contactId } = req.params;

    await deleteContactById(_id, contactId);
    res.json({ message: "contact deleted" });
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed")) {
      error.status = 404;
    }
    next(error);
  }
};

module.exports = remove;
