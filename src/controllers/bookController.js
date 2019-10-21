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

  //changed this to be more like index so the whole book list shows, plus edit, delete, and add new book buttons
  new(req, res, next) {
    bookQueries.getAllBooks((err, books) => {
      if (err) {
        res.redirect(500, "static/index");
      } else {
        res.render("books/new", { books });
      }
    });
  },

  create(req, res, next) {
    let newBook = {
      title: req.body.title,
      author: req.body.author
    };
    bookQueries.addBook(newBook, (err, book) => {
      console.log("BOOK ID is=", +req.body.id);

      if (err) {
        res.redirect(500, "/books/new");
      } else {
        res.redirect(303, `/books/${book.id}`);
      }
    });
  },

  // seeDashboard(req, res, next) {
  //   res.render("books/update");
  // },

  show(req, res, next) {
    bookQueries.getBook(req.params.id, (err, book) => {
      if (err || book == null) {
        res.redirect(404, "/");
      } else {
        res.render("books/show", { book });
      }
    });
  },

  destroy(req, res, next) {
    bookQueries.deleteBook(req.params.id, (err, book) => {
      if (err) {
        res.redirect(500, `books/${book.id}`);
      } else {
        res.redirect(303, "/books");
      }
    });
  },

  edit(req, res, next) {
    bookQueries.getBook(req.params.id, (err, book) => {
      if (err || book == null) {
        res.redirect(404, "/");
      } else {
        res.render("books/edit", { book });
      }
    });
  },

  update(req, res, next) {
    bookQueries.updateBook(req.params.id, req.body, (err, book) => {
      if (err || book == null) {
        res.redirect(404, `/books/${req.params.id}/edit`);
      } else {
        res.redirect(`/books/${book.id}`);
      }
    });
  }
};
