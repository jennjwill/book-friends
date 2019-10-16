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

  addBookToList(newBook, callback) {
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
  }
};
