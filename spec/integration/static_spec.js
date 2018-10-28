const request = require('request');
const server = require('../../src/server');
const base = "http://localhost:3000/";

describe("routes : static", () => {
  describe("GET /", () => {
    it("should return status code 200", done => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        done();
      });
    });

    it("should return a body that contains 'Welcome to Bloccit'", done => {
      request.get(base, (err, res, body) => {
        expect(res.body).toContain("Welcome to Bloccit");
        done();
      })
    })
  });

  describe("GET /marco", () => {
    it("should return the status code 200", done => {
      request.get(base + "marco", (err, res, body) => {
        expect(res.statusCode).toBe(200);
        done();
      });
    });

    it("should return a body that contains 'polo'", done => {
      request.get(base + 'marco', (err, res, body) => {
        expect(res.body).toContain("Polo");
        done();
      });
    });
  });

  describe("GET /about", () => {
    it("should return the status code 200", done => {
      request.get(base + "about", (err, res, body) => {
        expect(res.statusCode).toBe(200);
        done();
      });
    });


    it("should return a body that contains 'About Us'", done => {
      request.get(base + "about", (err, res, body) => {
        expect(res.body).toContain("About Us");
        done();
      });
    });
  });

});