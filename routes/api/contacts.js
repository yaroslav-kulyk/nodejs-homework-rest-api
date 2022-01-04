const express = require("express");
const router = express.Router();
const { NotFound, BadRequest } = require("http-errors");
const { Contact, joiSchema, joiFavoriteSchema } = require("../../model/contact");
const authenticate = require("../../middlewares/authenticate");

router.get("/", authenticate, async (req, res, next) => {
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
});

router.get("/:contactId", authenticate, async (req, res, next) => {
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
});

router.post("/", authenticate, async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);

    if (error) {
      throw new BadRequest("missing fields");
    }

    const { _id } = req.user;
    const newContact = await Contact.create({ ...req.body, owner: _id });
    res.status(201).json(newContact);
  } catch (error) {
    if (error.message.includes("validation failed")) {
      error.status = 400;
    }
    next(error);
  }
});

router.put("/:contactId", authenticate, async (req, res, next) => {
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
});

router.patch("/:contactId/favorite", authenticate, async (req, res, next) => {
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
});

router.delete("/:contactId", authenticate, async (req, res, next) => {
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
});

module.exports = router;
