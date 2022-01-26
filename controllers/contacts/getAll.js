const { Contact } = require("../../model/contact");

const getAll = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (req.query?.favorite) {
      const { favorite } = req.query;
      const filteredContacts = await Contact.find(
        { owner: _id, favorite },
        "-createdAt -updatedAt"
      );
      res.json(filteredContacts);
      return;
    }

    const contacts = await Contact.find({ owner: _id }, "-createdAt -updatedAt", {
      skip,
      limit: +limit,
    });
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

module.exports = getAll;
