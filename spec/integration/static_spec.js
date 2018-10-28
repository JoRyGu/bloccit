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


})