
const db = require("../config/database");

async function listarFilmes() {
  const [filmes] = await db.query("SELECT * FROM filmes ORDER BY id");
  return filmes;
}

async function buscarFilmePorId(id) {
  const [filmes] = await db.query(
    "SELECT * FROM filmes WHERE id = ?",
    [id]
  );

  return filmes[0];
}

async function filtrarFilmes(termo) {
  const pesquisa = `%${termo}%`;

  const [filmes] = await db.query(
    "SELECT * FROM filmes WHERE nome LIKE ? OR sinopse LIKE ?",
    [pesquisa, pesquisa]
  );

  return filmes;
}

module.exports = {
  listarFilmes,
  buscarFilmePorId,
  filtrarFilmes
};
