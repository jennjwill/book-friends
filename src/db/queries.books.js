const Book = require("./models").Book;
const Authorizer = require("../policies/book");

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

  //is this change below affecting show/edit
  getBook(id, callback) {
    let result = {};
    return Book.findByPk(id).then(book => {
      if (!book) {
        callback(404);
      } else {
        result["book"] = book;
        callback(null, result); //??
      }
    });

    // return Book.findByPk(id)
    //   .then(book => {
    //     callback(null, book);
    //   })
    //   .catch(err => {
    //     callback(err);
    //   });
  },

  addBook(newBook, callback) {
    return Book.create({
      title: newBook.title,
      author: newBook.author,
      userId: newBook.userId
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
      console.log("req user IS:", req.user);
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
