const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { NotFound, BadRequest } = require("http-errors");
const { Contact, joiSchema } = require("../../model/contact");
const authenticate = require("../../middlewares/authenticate");

router.get("/", authenticate, async (req, res, next) => {
  try {
    const { _id } = req.user;
    const contacts = await Contact.find({ owner: _id }, "-createdAt, -updatedAt");
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findById(contactId);

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

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updateContact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

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

router.patch("/:contactId/favorite", async (req, res, next) => {
  try {
    const { error } = Joi.object({ favorite: Joi.boolean().required() }).validate(req.body);

    if (error && error.message === '"favorite" must be a boolean') {
      throw new BadRequest(error.message);
    }
    if (error) {
      throw new BadRequest("missing field favorite");
    }

    const { contactId } = req.params;
    const { favorite } = req.body;

    const updateContact = await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });

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

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deleteContact = await Contact.findByIdAndRemove(contactId);

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
