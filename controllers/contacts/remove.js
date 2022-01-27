const { NotFound } = require("http-errors");
const { Contact } = require("../../model/contact");

const remove = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { contactId } = req.params;
    const deleteContact = await Contact.findOneAndRemove({ owner: _id, _id: contactId });

    if (!deleteContact) {
      throw new NotFound();
    }

    res.json({ message: "contact deleted" });
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed")) {
      error.status = 404;
    }
    next(error);
  }
};

module.exports = remove;
