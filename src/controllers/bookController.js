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
          res.redirect(500, "/books/new"); //45-54 would get replaced with a response; res gets *returned* to react, promise is resolved
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
  // show(req, res, next) {
  //   bookQueries.getBook(req.params.id, (err, result) => {
  //     book = result["book"];
  //     user = result["user"];
  //     if (err || book == null) {
  //       res.redirect(404, "/");
  //     } else {
  //       res.render("books/show", { book, user });
  //     }
  //   });
  // },

  //try SHOW from wikis in blocipedia
  show(req, res, next) {
    bookQueries.getBook(req.params.id, (err, result) => {
      book = result["book"];
      user = result["user"];
      if (err || book == null) {
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user, book);
        if (authorized) {
          res.render("books/show", { book, user });
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect(`/books`);
        }
      }
    });
  },

  destroy(req, res, next) {
    bookQueries.deleteBook(req, (err, book) => {
      if (err) {
        res.redirect(err, `/books/${req.params.id}`);
      } else {
        const authorized = new Authorizer(req.user, book).destroy();
        if (authorized) {
          req.flash("notice", "Book has been deleted from list.");
          res.redirect(303, "/books");
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect(`/books/${req.params.id}`);
        }
      }
    });
  },

  // edit(req, res, next) {
  //   bookQueries.getBook(req.params.id, (err, book) => {
  //     if (err || book == null) {
  //       res.redirect(404, "/");
  //     } else {
  //       console.log("Book:", book);
  //       const authorized = new Authorizer(req.user, book).edit();
  //       if (authorized) {
  //         res.render("books/edit", { book });
  //       } else {
  //         req.flash("notice", "You are not authorized to do that.");
  //         res.redirect(`/books/${req.params.id}`);
  //       }
  //     }
  //   });
  // },

  //try EDIT from wikis in blocipedia
  edit(req, res, next) {
    bookQueries.getBook(req.params.id, (err, result) => {
      let book = result["book"];
      let user = result["user"];

      if (err || book == null) {
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user, book).edit();
        if (authorized) {
          console.log("INSIDE EDIT fxn. Thru Authorizer");
          res.render("books/edit", { book, user });
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
        console.log("thru update USER is:", req.user.id);
        res.redirect(`/books/${req.params.id}`);
      }
    });
  }

  //try UPDATE from blocipedia
  // update(req, res, next) {
  //   bookQueries.updateBook(req.params.id, req.body, (err, book) => {
  //     if (err || book == null) {
  //       res.redirect(404, `/books/${req.params.id}/edit`);
  //     } else {
  //       res.redirect(`/books/${book.id}`);
  //     }
  //   });
  // }
};
