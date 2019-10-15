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
  }
};
