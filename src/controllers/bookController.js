const bookQueries = require("../db/queries.books.js");
const Authorizer = require("../policies/book");

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
    const authorized = new Authorizer(req.user).new();
    if (authorized) {
      bookQueries.getAllBooks((err, books) => {
        if (err) {
          res.redirect(500, "static/index");
        } else {
          res.render("books/new", { books });
        }
      });
    } else {
      req.flash(
        "notice",
        "You can see book lists if you are signed-in to your account."
      );
      res.redirect("static/index");
    }
  },

  create(req, res, next) {
    const authorized = new Authorizer(req.user).create();

    if (authorized) {
      let newBook = {
        title: req.body.title,
        author: req.body.author,
        userId: req.user.id
      };
      bookQueries.addBook(newBook, (err, book) => {
        if (err) {
          res.redirect(500, "/books/new");
        } else {
          res.redirect(303, `/books/${book.id}`);
        }
      });
    } else {
      req.flash("notice", "Please sign in to add books to your list.");
      res.redirect("static/index");
    }
  },

  // seeDashboard(req, res, next) {
  //   res.render("books/update");
  // },

  //show changes (w "result") may be affecting show to edit flow
  show(req, res, next) {
    bookQueries.getBook(req.params.id, (err, result) => {
      book = result["book"];
      let user = result["user"];
      if (err || book == null) {
        res.redirect(404, "/");
      } else {
        res.render("books/show", { book, user });
      }
    });
  },

  destroy(req, res, next) {
    bookQueries.deleteBook(req, (err, book) => {
      if (err) {
        res.redirect(err, `/books/${req.params.id}`);
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
        console.log("Book:", book);
        const authorized = new Authorizer(req.user, book).edit();
        if (authorized) {
          res.render("books/edit", { book });
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect(`/books/${req.params.id}`);
        }
      }
    });
  },

  update(req, res, next) {
    bookQueries.updateBook(req, req.body, (err, book) => {
      if (err || book == null) {
        res.redirect(401, `/books/${req.params.id}/edit`);
      } else {
        res.redirect(`/books/${req.params.id}`);
      }
    });
  }
};
