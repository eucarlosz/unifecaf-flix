
const express = require("express");
const path = require("path");
const filmeRoutes = require("./src/routes/filmeRoutes");

const app = express();

// Porta definida automaticamente pela hospedagem
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Interface, CSS, JavaScript e imagens
app.use(express.static(path.join(__dirname, "public")));

// API REST de filmes
app.use("/v1/controle-filmes", filmeRoutes);

// Inicialização do servidor
const servidor = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});

servidor.on("error", (erro) => {
  console.error("Erro ao iniciar o servidor:", erro);
});
