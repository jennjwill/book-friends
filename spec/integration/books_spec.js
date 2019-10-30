const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/books/";
const sequelize = require("../../src/db/models/index").sequelize;
const Book = require("../../src/db/models").Book;
const User = require("../../src/db/models").User;

describe("routes : books", () => {
  beforeEach(done => {
    this.book;
    this.user;

    sequelize.sync({ force: true }).then(res => {
      User.create({
        username: "bowie99",
        email: "starman@gmail.com",
        password: 123456
      }).then(user => {
        this.user = user;

        Book.create({
          title: "Jade War", //changing this book title makes GET /books:id fail
          author: "Fonda Lee",
          userId: this.user.id
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
  });

  //guest user context

  describe("guest user performing CRUD actions for Book", () => {
    beforeEach(done => {
      request.get({
        // mock authentication
        url: "http://localhost:3000/auth/fake",
        form: {
          role: "guest" //`${this.userId == 0}` //guest vs member
        }
      });
      done();
    });

    describe("GET /books/new", () => {
      it("should NOT render a new book form", done => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).not.toContain("My Favorite Books");
          done();
        });
      });
    });

    //***FOR NOW GUESTS CAN'T SEE ANY BOOKS OR LISTS BUT THESE MAY BE NEEDED LATER IF THAT CHANGES */
    // describe("GET /books/:id", () => {
    //   it("should render a view of the selected post", done => {
    //     request.get(
    //       `${base}/${this.topic.id}/posts/${this.post.id}`,
    //       (err, res, body) => {
    //         expect(err).toBeNull();
    //         expect(body).toContain("Snowball Fighting");
    //         done();
    //       }
    //     );
    //   });
    // });

    //GUESTS CANNOT see these books at all (including edit/delete buttons)so an unhandled promise rejection error occurs if I test delete, edit.

    //   describe("POST /books/:id/destroy", () => {
    //     it("should NOT delete the book with the associated ID", done => {
    //       Book.findAll().then(books => {
    //         const bookCountBeforeDelete = books.length;

    //         expect(bookCountBeforeDelete).toBe(1);

    //         request.post(`${base}${this.book.id}/destroy`, (err, res, body) => {
    //           Book.findAll().then(books => {
    //             expect(statusCode).toBe(401);
    //             expect(books.length).toBe(bookCountBeforeDelete);
    //             done();
    //           });
    //         });
    //       });
    //     });
    //   });

    //   //maybe change the expect part of this to work
    //   describe("GET /books/:id/edit", () => {
    //     it("should NOT render a view with an edit book form", done => {
    //       request.get(`${base}${this.book.id}/edit`, (err, res, body) => {
    //         expect(body).not.toContain("Edit");
    //         done();
    //       });
    //     });
    //   });

    //   describe("POST /topics/:topicId/posts/:id/update", () => {
    //     it("should not return a status code 302", done => {
    //       request.post(
    //         {
    //           url: `${base}${this.book.id}/update`,
    //           form: {
    //             title: "Empress of Forever",
    //             author: "Max Gladstone"
    //           }
    //         },
    //         (err, res, body) => {
    //           expect(res.statusCode).not.toBe(302);
    //           done();
    //         }
    //       );
    //     });
    //   });
  });

  //end guest user context

  //begin admin user context

  describe("admin user performing CRUD actions for Book", () => {
    beforeEach(done => {
      User.create({
        email: "admin@example.com",
        password: "123456",
        role: "admin"
      }).then(user => {
        request.get(
          {
            // mock authentication
            url: "http://localhost:3000/auth/fake",
            form: {
              role: user.role, // mock authenticate as admin user
              userId: user.id,
              email: user.email
            }
          },
          (err, res, body) => {
            done();
          }
        );
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
  });

  //end admin user context

  //begin member user context

  describe("member user performing CRUD actions for Book", () => {
    // beforeEach(done => {
    //   request.get({
    //     url: "http://localhost:3000/auth/fake",
    //     form: {
    //       role: "member",
    //       userId: this.user.id
    //     }
    //   }),
    //     done();
    // });
    beforeEach(done => {
      User.create({
        username: "coolUser",
        email: "member@example.com",
        password: "123456",
        role: "member"
      }).then(user => {
        request.get(
          {
            // mock authentication
            url: "http://localhost:3000/auth/fake",
            form: {
              role: user.role, // mock authenticate as admin user
              userId: user.id,
              email: user.email
            }
          },
          (err, res, body) => {
            done();
          }
        );
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

    // ****MEMBERS CAN'T DESTROY/EDIT ANOTHER MEMBER'S BOOKS--HOW TO TEST THIS? Below needs to be changed for that.****
    //this has to be the owner member of the book
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
          expect(body).toContain("Edit");
          expect(body).toContain("Jade War");
          done();
        });
      });
    });

    //this has to be the *owner* member of the book
    describe("POST /books/:id/update", () => {
      it("should update the book list with the given values", done => {
        request.post(
          {
            url: `${base}${this.book.id}/update`,
            form: {
              title: "Empress of Forever",
              author: "Max Gladstone",
              userId: this.user.id
            }
          },
          (err, res, body) => {
            expect(err).toBeNull();
            Book.findOne({
              where: { id: 1 }
            })
              .then(book => {
                expect(book.title).toBe("Empress of Forever");
                done();
              })
              .catch(err => {
                console.log(err);
                done();
              });
          }
        );
      });
    });
  });
});
