const { BadRequest } = require("http-errors");
const { joiSchema } = require("../../model/contact");
const { addContact } = require("../../services/contacts/contactsService");

const add = async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);

    if (error) {
      throw new BadRequest("missing fields");
    }

    const { _id } = req.user;
    const newContact = await addContact(_id, req.body);

    res.status(201).json(newContact);
  } catch (error) {
    if (error.message.includes("validation failed")) {
      error.status = 400;
    }
    next(error);
  }
};

module.exports = add;
