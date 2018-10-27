const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Welcome to Bloccit");
});

router.get("/marco", (req, res, next) => {
  res.send("Welcom to Marco Polo's Page!");
});

module.exports = router;