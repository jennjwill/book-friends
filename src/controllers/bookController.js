const bookQueries = require("../db/queries.books.js");

module.exports = {
  index(req, res, next) {
    bookQueries.getAllBooks((err, books) => {
      if (err) {
        res.redirect(500, "static/index");
      } else {
        res.render("books/index", { books });
      }
    });
  },

  new(req, res, next) {
    res.render("books/new");
  },

  create(req, res, next) {
    let newBook = {
      title: req.body.title,
      author: req.body.author
    };
    bookQueries.addBookToList(newBook, (err, book) => {
      if (err) {
        res.redirect(500, "books/new");
      } else {
        res.redirect(303, `books/${book.id}`);
      }
    });
  },

  show(req, res, next) {
    bookQueries.getBook(req.params.id, (err, book) => {
      if (err || book == null) {
        res.redirect(404, "/");
      } else {
        res.render("books/show", { book });
      }
    });
  }
};
