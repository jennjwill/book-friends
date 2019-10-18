const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/books/";
const sequelize = require("../../src/db/models/index").sequelize;
const Book = require("../../src/db/models").Book;
const methods = require("../../src/services/textSearchService.js");

//this spec is not showing up at all in testing? should be #9

describe("methods: books", () => {
  describe("json book search", done => {
    it("should find a book or author that contains the typed-in snippet", done => {
      expect(methods.findMatches("thin", books)).toContain("things");
      expect(methods.findMatches("thin", books)).not.toBeNull();
      done();
    });
  });
});
