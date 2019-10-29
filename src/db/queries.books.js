const Book = require("./models").Book;
const Authorizer = require("../policies/application");

module.exports = {
  getAllBooks(callback) {
    return Book.findAll()
      .then(books => {
        callback(null, books);
      })
      .catch(err => {
        callback(err);
      });
  },

  getBook(id, callback) {
    return Book.findByPk(id)
      .then(book => {
        callback(null, book);
      })
      .catch(err => {
        callback(err);
      });
  },

  addBook(newBook, callback) {
    return Book.create({
      title: newBook.title,
      author: newBook.author
    })
      .then(book => {
        callback(null, book);
      })
      .catch(err => {
        callback(err);
      });
  },

  deleteBook(req, callback) {
    return Book.findByPk(req.params.id)
      .then(book => {
        const authorized = new Authorizer(req.user, book).destroy();

        if (authorized) {
          book.destroy().then(res => {
            callback(null, book);
          });
        } else {
          req.flash("notice", "You are not authorized to do that.");
          callback(401);
        }
      })
      .catch(err => {
        callback(err);
      });
  },

  updateBook(req, updatedBook, callback) {
    return Book.findByPk(req.params.id).then(book => {
      if (!book) {
        return callback("Book not found");
      }

      const authorized = new Authorizer(req.user, book).update();

      if (authorized) {
        book
          .update(updatedBook, {
            fields: Object.keys(updatedBook)
          })
          .then(() => {
            callback(null, book);
          })
          .catch(err => {
            callback(err);
          });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback("Forbidden");
      }
    });
  }
};
