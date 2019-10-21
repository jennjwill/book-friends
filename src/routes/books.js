const express = require("express");
const router = express.Router();

const bookController = require("../controllers/bookController");

router.get("/books", bookController.index);

router.get("/books/new", bookController.new);

router.post("/books/create", bookController.create);

// router.get("/books/dashboard", bookController.dashboard);

router.get("/books/:id", bookController.show);

router.post("/books/:id/destroy", bookController.destroy);

router.get("/books/:id/edit", bookController.edit);

router.post("/books/:id/update", bookController.update);

module.exports = router;
