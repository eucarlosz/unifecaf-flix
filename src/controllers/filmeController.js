
const filmeModel = require("../models/filmeModel");

// Listar todos os filmes
async function listarFilmes(req, res) {
  try {
    const filmes = await filmeModel.listarFilmes();
    return res.status(200).json(filmes);
  } catch (erro) {
    console.error("Erro ao listar filmes:", erro);
    return res.status(500).json({
      mensagem: "Erro interno ao buscar filmes."
    });
  }
}

// Buscar filme pelo ID
async function buscarFilmePorId(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "ID inválido. Informe um número inteiro positivo."
      });
    }

    const filme = await filmeModel.buscarFilmePorId(id);

    if (!filme) {
      return res.status(404).json({
        mensagem: "Filme não encontrado."
      });
    }

    return res.status(200).json(filme);
  } catch (erro) {
    console.error("Erro ao buscar filme:", erro);
    return res.status(500).json({
      mensagem: "Erro interno ao buscar filme."
    });
  }
}

// Filtrar filmes por nome ou sinopse
async function filtrarFilmes(req, res) {
  try {
    const { nome } = req.query;

    if (typeof nome !== "string" || !nome.trim()) {
      return res.status(400).json({
        mensagem: "Informe um nome válido para pesquisar."
      });
    }

    const filmes = await filmeModel.filtrarFilmes(nome.trim());

    return res.status(200).json(filmes);
  } catch (erro) {
    console.error("Erro ao filtrar filmes:", erro);
    return res.status(500).json({
      mensagem: "Erro interno ao pesquisar filmes."
    });
  }
}

module.exports = {
  listarFilmes,
  buscarFilmePorId,
  filtrarFilmes
};
