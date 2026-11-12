
const express = require("express");
const router = express.Router();

const filmeController = require("../controllers/filmeController");

router.get("/filme", filmeController.listarFilmes);

module.exports = router;

router.get("/filme/:id", filmeController.buscarFilmePorId);