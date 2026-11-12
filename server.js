
const express = require("express");
const filmeRoutes = require("./src/routes/filmeRoutes");

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

app.use("/v1/controle-filmes", filmeRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
