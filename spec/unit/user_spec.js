const sequelize = require('../../src/db/models/index').sequelize;
const User = require('../../src/db/models').User;

describe("User", () => {
  beforeEach(done => {
    sequelize.sync({force: true}).then(() => {
      done();
    }).catch(err => {
      console.log(err);
      done();
    })
  })

  describe("#create", () => {
    it("should create a User object with a valid email and pasword", done => {
      User.create({
        email: "user@example.com",
        password: "1234567890"
      }).then(user => {
        expect(user.email).toBe("user@example.com");
        expect(user.id).toBe(1);
        done();
      });
    });

    it("should not create a User with an invalid email or password", done => {
      User.create({
        email: "It's-a me, Mario!",
        password: "12345676890"
      }).then(user => {
        // This code will be caught by the validation. Exepctations will be tested in catch block.
        done();
      }).catch(err => {
        expect(err.message).toContain("Validation error: must be a valid email");
        done();
      });
    });

    it("should not create a User with a duplicate email", done => {
      User.create({
        email: "user@example.com",
        password: "1234567890"
      }).then(user => {
        User.create({
          email: "user@example.com",
          password: "1234567890"
        }).then(user => {
          // This code will be caught by the validation. Exepctations will be tested in catch block.
          done();
        }).catch(err => {
          expect(err.message).toContain("Validation error");
          done();
        });
        done();
      }).catch(err => {
        console.log(err);
        done();
      });
    });
  });
})