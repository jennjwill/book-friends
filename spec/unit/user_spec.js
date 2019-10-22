const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {
  beforeEach(done => {
    sequelize
      .sync({ force: true })
      .then(() => {
        done();
      })
      .catch(err => {
        console.log(err);
        done();
      });
  });

  describe("#create()", () => {
    it("should create a User object with a valid email and password", done => {
      User.create({
        username: "coolUser",
        email: "user@fake.com",
        password: "123456"
      })
        .then(user => {
          expect(user.email).toBe("user@fake.com");
          expect(user.id).toBe(1);
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });

    it("should NOT create a user with invalid email or password", done => {
      User.create({
        username: "BadUser",
        email: "Bad Email",
        password: "nope"
      })
        .then(user => {
          //gets skipped
          done();
        })
        .catch(err => {
          expect(err.message).toContain(
            "Validation error: must be a valid email"
          );
          done();
        });
    });

    it("should NOT create a user with an email already taken", done => {
      User.create({
        username: "coolUser",
        email: "user@fake.com",
        password: "123456"
      })
        .then(user => {
          User.create({
            username: "superstar",
            email: "user@fake.com",
            password: "BestPassword"
          })
            .then(user => {
              //gets skipped
              done();
            })
            .catch(err => {
              expect(err.message).toContain("Validation error");
              done();
            });
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });
});
