
const express = require("express");
const path = require("path");
const filmeRoutes = require("./src/routes/filmeRoutes");

const app = express();
const PORT = 3000;

app.use(express.json());

// Site, CSS, JavaScript e imagens
app.use(express.static(path.join(__dirname, "public")));

// API de filmes
app.use("/v1/controle-filmes", filmeRoutes);

const servidor = app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

servidor.on("error", (erro) => {
  console.error("Erro no servidor:", erro);
});
