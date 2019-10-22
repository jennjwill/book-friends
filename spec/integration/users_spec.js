const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {
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

  describe("GET /users/sign_up", () => {
    it("should render a view with a sign-up form", done => {
      request.get(`${base}sign_up`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign up");
        done();
      });
    });
  });

  describe("POST /users", () => {
    it("should create a new user with valid username, email, password, and redirect", done => {
      const options = {
        url: base,
        form: {
          username: "kittyUser",
          email: "kitty@fake.com",
          password: "123456"
        }
      };
      request.post(options, (err, res, body) => {
        User.findOne({ where: { email: "kitty@fake.com" } })
          .then(user => {
            expect(user).not.toBeNull();
            expect(user.username).toBe("kittyUser");
            expect(user.email).toBe("kitty@fake.com");
            expect(user.id).toBe(1);
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });

    it("should NOT create a new user with invalid attributes & redirect", done => {
      request.post(
        {
          url: base,
          form: {
            username: "oops",
            email: "no",
            password: "123456"
          }
        },
        (err, res, body) => {
          User.findOne({ where: { email: "no" } })
            .then(user => {
              expect(user).toBeNull();
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

  describe("GET /users/sign_in", () => {
    it("should render a view with a sign-in form", done => {
      request.get(`${base}sign_in`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign in");
        done();
      });
    });
  });
});
