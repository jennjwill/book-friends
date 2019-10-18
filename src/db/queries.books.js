const Book = require("./models").Book;

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

  deleteBook(id, callback) {
    return Book.destroy({
      where: { id }
    })
      .then(book => {
        callback(null, book);
      })
      .catch(err => {
        callback(err);
      });
  },

  updateBook(id, updatedBook, callback) {
    return Book.findByPk(id).then(book => {
      if (!book) {
        return callback("Book not found");
      }
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
    });
  }
};
