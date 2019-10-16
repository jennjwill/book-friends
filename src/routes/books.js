const express = require("express");
const router = express.Router();

const bookController = require("../controllers/bookController");

router.get("/books", bookController.index);

router.get("/books/new", bookController.new);

router.post("/books/create", bookController.create);

router.get("/books/:id", bookController.show);

module.exports = router;
