const express = require("express");

const authenticate = require("../../middlewares/authenticate");
const {
  getAll,
  getById,
  add,
  remove,
  updateById,
  updateFavorite,
} = require("../../controllers/contacts");

const router = express.Router();

router.get("/", authenticate, getAll);

router.get("/:contactId", authenticate, getById);

router.post("/", authenticate, add);

router.put("/:contactId", authenticate, updateById);

router.patch("/:contactId/favorite", authenticate, updateFavorite);

router.delete("/:contactId", authenticate, remove);

module.exports = router;
