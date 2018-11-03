const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/advertisements/";
const sequelize = require("../../src/db/models/index").sequelize;
const Advertisement = require("../../src/db/models").Advertisement;

describe("routes : advertisements", () => {
  beforeEach(done => {
    this.advertisement;
    sequelize.sync({ force: true }).then(res => {
      Advertisement.create({
        title: "PlayStation",
        description: "The gaming platform with the best exclusive titles."
      })
        .then(advertisement => {
          this.advertisement = advertisement;
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });

  describe("GET /advertisements", () => {
    it("should return a status code 200 and all advertisements", done => {
      request.get(base, (err, res, body) => {
        expect(err).toBeNull();
        expect(res.statusCode).toBe(200);
        expect(body).toContain("PlayStation");
        done();
      });
    });
  });

  describe("POST /advertisements/create", () => {
    const options = {
      url: `${base}create`,
      form: {
        title: "Xbox is the Best!",
        description: "PlayStation wishes it was as good"
      }
    };

    it("should create a new advertisement and redirect", done => {
      request.post(options, (err, res, body) => {
        Advertisement.findOne({ where: { title: "Xbox is the Best!" } })
          .then(advertisement => {
            expect(res.statusCode).toBe(303);
            expect(advertisement.title).toBe("Xbox is the Best!");
            expect(advertisement.description).toBe(
              "PlayStation wishes it was as good"
            );
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });

  describe("GET /advertisements/:id", () => {
    it("should render a view with the selected ad", done => {
      request.get(`${base}${this.advertisement.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("PlayStation");
        expect(body).toContain(
          "The gaming platform with the best exclusive titles"
        );
        done();
      });
    });
  });

  describe("POST /advertisements/:id/destroy", () => {
    it("should delete the advertisement with the associated ID", done => {
      Advertisement.all()
      .then(advertisements => {
        const adCountBeforeDelete = advertisements.length;
        expect(adCountBeforeDelete).toBe(1);
        request.post(`${base}${this.advertisement.id}/destroy`, (err, res, body) => {
          Advertisement.all()
          .then(advertisements => {
            expect(err).toBeNull();
            expect(advertisements.length).toBe(adCountBeforeDelete - 1);
            done();
          });
        });
      });
    });
  });

  describe("GET /advertisements/:id/edit", () => {
    it("should render a view with an edit form", done => {
      request.get(`${base}${this.advertisement.id}/edit`, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toContain("Edit Advertisement");
        done();
      });
    });
  });

  describe("POST /advertisements/:id/update", () => {
    it("should update the selected ad with the given values", done => {
      const options = {
        url: `${base}${this.advertisement.id}/update`,
        form: {
          title: "PS4",
          description: "The gaming platform with the best exclusive titles."
        }
      };

      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Advertisement.findOne({
          where: { id: this.advertisement.id }
        })
        .then(advertisement => {
          expect(advertisement.title).toContain("PS4");
          done();
        });
      });
    });
  });
});
