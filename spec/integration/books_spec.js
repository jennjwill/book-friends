const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/books/";
const sequelize = require("../../src/db/models/index").sequelize;
const Book = require("../../src/db/models").Book;

describe("routes : books", () => {
  beforeEach(done => {
    this.book;
    sequelize.sync({ force: true }).then(res => {
      Book.create({
        title: "Jade War", //changing this book title makes GET /books:id fail
        author: "Fonda Lee"
      })
        .then(book => {
          this.book = book;
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });

  describe("GET /books", () => {
    it("should return a status code 200 and book list", done => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("My Favorite Books");
        done();
      });
    });
  });

  describe("GET /books/new", () => {
    it("should return a status code 200 and book list form", done => {
      request.get(`${base}new`, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("My Favorite Books");
        done();
      });
    });
  });

  describe("POST /books/create", () => {
    const options = {
      url: `${base}create`,
      form: {
        title: "Jade War",
        author: "Fonda Lee"
      }
    };
    it("should create/add to book/author list", done => {
      request.post(options, (err, res, body) => {
        Book.findOne({ where: { title: "Jade War" } })
          .then(book => {
            expect(res.statusCode).toBe(303); //expect redirect
            expect(book.title).toBe("Jade War");
            expect(book.author).toBe("Fonda Lee");
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });

  describe("GET /books/:id", () => {
    it("should render a view of selected book", done => {
      request.get(`${base}${this.book.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Jade War");
        done();
      });
    });
  });

  describe("POST /books/:id/destroy", () => {
    it("should delete the book with associated ID", done => {
      Book.findAll().then(books => {
        const bookCountBeforeDelete = books.length;

        expect(bookCountBeforeDelete).toBe(1);

        request.post(`${base}${this.book.id}/destroy`, (err, res, body) => {
          Book.findAll().then(books => {
            expect(err).toBeNull();
            expect(books.length).toBe(bookCountBeforeDelete - 1);
            done();
          });
        });
      });
    });
  });

  describe("GET /books/:id/edit", () => {
    it("should render a view with an edit book list form", done => {
      request.get(`${base}${this.book.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Book List");
        expect(body).toContain("Jade War");
        done();
      });
    });
  });

  describe("POST /books/:id/update", () => {
    it("should update the book list with the given values", done => {
      const options = {
        url: `${base}${this.book.id}/update`,
        form: {
          title: "Empress of Forever",
          author: "Max Gladstone"
        }
      };
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Book.findOne({
          where: { id: this.book.id }
        }).then(book => {
          expect(book.title).toBe("Empress of Forever");
          done();
        });
      });
    });
  });
});
