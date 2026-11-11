
const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    projeto: "UniFECAF Flix",
    mensagem: "API funcionando com sucesso!",
    versao: "1.0.0"
  });
});


app.get("/v1/controle-filmes/filme", (req, res) => {
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

  res.status(200).json(filmes);
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
