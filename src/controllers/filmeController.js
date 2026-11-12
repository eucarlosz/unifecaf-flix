
const filmeModel = require("../models/filmeModel");

function listarFilmes(req, res) {
  const filmes = filmeModel.listarFilmes();

  return res.status(200).json(filmes);
}

module.exports = { listarFilmes };
