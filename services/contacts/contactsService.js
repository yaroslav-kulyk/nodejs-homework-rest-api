const { NotFound } = require("http-errors");
const { Contact } = require("../../model/contact");

const getContacts = async (userId) => {
  const contacts = await Contact.find({ owner: userId }, "-createdAt -updatedAt");
  return contacts;
};

const getContactById = async (userId, contactId) => {
  const contact = await Contact.findOne({ owner: userId, _id: contactId }, "-createdAt -updatedAt");

  if (!contact) {
    throw new NotFound();
  }
  return contact;
};

const addContact = async (userId, contact) => {
  const newContact = await Contact.create({ ...contact, owner: userId });
  return newContact;
};

const deleteContactById = async (userId, contactId) => {
  const deleteContact = await Contact.findOneAndRemove({ owner: userId, _id: contactId });

  if (!deleteContact) {
    throw new NotFound();
  }
};

const updateContactById = async (userId, contactId, payload) => {
  const updateContact = await Contact.findOneAndUpdate({ owner: userId, _id: contactId }, payload, {
    new: true,
    fields: "-createdAt -updatedAt",
  });

  if (!updateContact) {
    throw new NotFound();
  }
  return updateContact;
};

const updateFavoriteById = async (userId, contactId, favorite) => {
  const updateContact = await Contact.findOneAndUpdate(
    { owner: userId, _id: contactId },
    { favorite },
    {
      new: true,
      fields: "-createdAt -updatedAt",
    }
  );

  if (!updateContact) {
    throw new NotFound();
  }
  return updateContact;
};

module.exports = {
  getContacts,
  getContactById,
  addContact,
  deleteContactById,
  updateContactById,
  updateFavoriteById,
};
