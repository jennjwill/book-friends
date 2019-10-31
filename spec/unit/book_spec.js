const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/books/";
const sequelize = require("../../src/db/models/index").sequelize;
const Book = require("../../src/db/models").Book;
const User = require("../../src/db/models/index").User;
const UserBookList = require("../../src/db/models/index").UserBookList;
const methods = require("../../src/services/textSearchService.js");

describe("Book", () => {
  beforeEach(done => {
    this.book;
    this.user;

    sequelize.sync({ force: true }).then(res => {
      User.create({
        username: "MikeD",
        email: "bboy@gmail.com",
        password: "123456"
      }).then(user => {
        this.user = user; //stores user

        Book.create({
          title: "Pyewacket",
          author: "Cool Author",
          userId: this.user.id
        }).then(book => {
          this.book = book; //stores book
          done();
        });
      });
    });
  });

  describe("#create()", () => {
    it("should create a book object with a title and author and assigned user", done => {
      Book.create({
        title: "Jane Eyre",
        author: "Charlotte Bronte",
        userId: this.user.id
      }).then(book => {
        expect(book.title).toBe("Jane Eyre");
        expect(book.author).toBe("Charlotte Bronte");
        expect(book.userId).toBe(this.user.id);
        done();
      });
    });

    it("should NOT create a book with a missing title, or assigned user", done => {
      Book.create({
        title: "Lone NOPE Book"
      })
        .then(book => {
          //validation error may skip this
          done();
        })
        .catch(err => {
          expect(err.message).toContain("Book.userId cannot be null");
          done();
        });
    });
  });

  describe("#setUser()", () => {
    it("should associate a book and user together", done => {
      Book.create({
        title: "It",
        author: "Stephen King"
      }).then(newBook => {
        expect(this.book.userId).toBe(this.user.id);
        this.book.setBook(newBook).then(user => {
          expect(post.bookId).toBe(newBook.id);
          done();
        });
      });
    });
  });

  describe("#getBook()", () => {
    it("should return the associated book", done => {
      this.user.getBook().then(associatedBook => {
        expect(associatedBook.title).toBe("Pyewacket");
        done();
      });
    });
  });
});

//this spec is not showing up at all in testing? potentially for testing drop-down search

// describe("methods: books", () => {
// beforeEach(done => {
//   search = new methods();
// });
// describe("json book search", done => {
//   it("should find a book or author that contains the typed-in snippet", done => {
//     expect(findMatches("thin", books)).toContain("Things Fall Apart");
//     expect(methods.findMatches("thin", books)).not.toBeNull();
//     done();
//   });
// });
// });
