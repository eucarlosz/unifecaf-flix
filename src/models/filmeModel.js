
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


function buscarFilmePorId(id) {
  return filmes.find((filme) => filme.id === id);
}


function filtrarFilmes(termo) {
  const pesquisa = termo.toLocaleLowerCase("pt-BR");

  return filmes.filter((filme) => {
    const nome = filme.nome.toLocaleLowerCase("pt-BR");
    const sinopse = (filme.sinopse || "").toLocaleLowerCase("pt-BR");

    return nome.includes(pesquisa) || sinopse.includes(pesquisa);
  });
}



module.exports = {
  listarFilmes,
  buscarFilmePorId,
  filtrarFilmes
};