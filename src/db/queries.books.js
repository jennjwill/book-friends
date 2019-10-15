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
  }
};
