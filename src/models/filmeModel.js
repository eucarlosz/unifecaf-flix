
const filmes = [
  {
    id: 1,
    nome: "Interestelar",
    genero: "Ficção científica",
    ano: 2014
  },
  {
    id: 2,
    nome: "Batman: O Cavaleiro das Trevas",
    genero: "Ação",
    ano: 2008
  },
  {
    id: 3,
    nome: "Vingadores: Ultimato",
    genero: "Ação",
    ano: 2019
  }
];

function listarFilmes() {
  return filmes;
}

module.exports = { listarFilmes };
