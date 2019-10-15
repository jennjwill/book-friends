const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/books/";
const sequelize = require("../../src/db/models/index").sequelize;
const Book = require("../../src/db/models").Book;

describe("routes : books", () => {
  // beforeEach(done => {
  //   this.book;
  //   sequelize.sync({ force: true }).then(res => {
  //     Book.create({
  //       title: "Jade War",
  //       author: "Fonda Lee"
  //     })
  //       .then(book => {
  //         this.book = book;
  //         done();
  //       })
  //       .catch(err => {
  //         console.log(err);
  //         done();
  //       });
  //   });
  // });

  describe("GET /books", () => {
    it("should return a status code 200 and book list form", done => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("My Favorite Books");
        done();
      });
    });
  });
});
