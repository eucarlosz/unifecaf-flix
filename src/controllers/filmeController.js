
const filmeModel = require("../models/filmeModel");

function listarFilmes(req, res) {
  const filmes = filmeModel.listarFilmes();

  return res.status(200).json(filmes);
}


function buscarFilmePorId(req, res) {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: "ID inválido. Informe um número inteiro positivo."
    });
  }

  const filme = filmeModel.buscarFilmePorId(id);

  if (!filme) {
    return res.status(404).json({
      mensagem: "Filme não encontrado."
    });
  }

  return res.status(200).json(filme);
}


function filtrarFilmes(req, res) {
  const { nome } = req.query;

  if (typeof nome !== "string" || !nome.trim()) {
    return res.status(400).json({
      mensagem: "Informe um nome válido para pesquisar."
    });
  }

  const filmes = filmeModel.filtrarFilmes(nome.trim());

  return res.status(200).json(filmes);
}


module.exports = {
  listarFilmes,
  buscarFilmePorId,
  filtrarFilmes
};