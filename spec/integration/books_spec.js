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
        title: "Jade War",
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
});
