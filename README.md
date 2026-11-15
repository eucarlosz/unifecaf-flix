
<div align="center">

# 🎬 UNIFECAF FLIX

### 🚀 REST API • NODE.JS • EXPRESS • MYSQL

**Uma API cinematográfica construída com tecnologia Backend.**

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:080B18,50:164D9A,100:00BFFF&height=180&section=header&text=UNIFECAF%20FLIX&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Movie%20Catalog%20REST%20API&descAlignY=60" width="100%" alt="Banner UniFECAF Flix"/>

![Node.js](https://img.shields.io/badge/Node.js-111827?style=for-the-badge&logo=nodedotjs&logoColor=5FAF50)
![Express](https://img.shields.io/badge/Express-111827?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-111827?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![MySQL](https://img.shields.io/badge/MySQL-111827?style=for-the-badge&logo=mysql&logoColor=00BFFF)

<br>

![API](https://img.shields.io/badge/API-REST-0088FF?style=flat-square)
![Architecture](https://img.shields.io/badge/Architecture-MVC-5865F2?style=flat-square)
![Endpoints](https://img.shields.io/badge/Endpoints-3-00A86B?style=flat-square)
![Tests](https://img.shields.io/badge/Manual_Tests-6_Passed-00A86B?style=flat-square)

</div>

---

## 🌌 Sobre o projeto

O **UniFECAF Flix** é uma API REST desenvolvida para consultar um catálogo de filmes armazenado em um banco de dados MySQL.

O projeto utiliza **Node.js**, **Express** e arquitetura **MVC**, com foco em organização, boas práticas de desenvolvimento Backend e integração com bancos de dados relacionais.

Desenvolvido como projeto acadêmico do curso de **Análise e Desenvolvimento de Sistemas — UniFECAF**.

### ✨ Funcionalidades

- 🎞️ Listagem de filmes cadastrados.
- 🔎 Pesquisa de filmes por nome ou sinopse.
- 🎯 Consulta individual por ID.
- 🗄️ Integração com MySQL.
- 🛡️ Validação de parâmetros.
- ⚡ Tratamento de erros HTTP.
- 🧩 Organização em arquitetura MVC.

---

## 📊 Visão geral

<div align="center">

| 🎬 Endpoints | 🧩 Arquitetura | 🧪 Testes manuais |
|:---:|:---:|:---:|
| **03** | **MVC** | **06 aprovados** |
| Rotas principais | Código organizado | Cenários verificados |

</div>

---

## 🏗️ Arquitetura do sistema

```mermaid
flowchart TD
    A["🌐 Cliente / HTTP"] --> B["🚀 Express Server"]
    B --> C["🛣️ Routes"]
    C --> D["⚙️ Controllers"]
    D --> E["🧩 Models"]
    E --> F[("🗄️ MySQL Database")]
    F --> E
    E --> D
    D --> B
    B --> A

    style A fill:#14213d,color:#fff,stroke:#38bdf8
    style B fill:#164e63,color:#fff,stroke:#38bdf8
    style C fill:#1e3a8a,color:#fff,stroke:#60a5fa
    style D fill:#1e40af,color:#fff,stroke:#60a5fa
    style E fill:#1d4ed8,color:#fff,stroke:#93c5fd
    style F fill:#0f766e,color:#fff,stroke:#5eead4
```

A arquitetura MVC separa as responsabilidades:

**Model:** realiza consultas SQL e acessa os dados.

**Controller:** processa as requisições e define as respostas HTTP.

**Routes:** organiza os endpoints disponíveis.

---

## 🛠️ Tecnologias utilizadas

<div align="center">

| Tecnologia | Utilização |
|:---|:---|
| 🟢 Node.js | Ambiente de execução JavaScript |
| ⚡ Express.js | Framework para criação da API |
| 🟨 JavaScript | Linguagem de programação |
| 🐬 MySQL 8 | Banco de dados relacional |
| 🔗 MySQL2 | Comunicação entre Node.js e MySQL |
| 🔐 Dotenv | Configuração de variáveis de ambiente |
| 🌿 Git | Controle de versões |
| 🐙 GitHub | Hospedagem do código-fonte |

</div>

---

## 📁 Estrutura do projeto

```text
unifecaf-flix/
│
├── 📂 database/
│   └── database.sql
│
├── 📂 src/
│   ├── 📂 config/
│   │   └── database.js
│   │
│   ├── 📂 controllers/
│   │   └── filmeController.js
│   │
│   ├── 📂 models/
│   │   └── filmeModel.js
│   │
│   └── 📂 routes/
│       └── filmeRoutes.js
│
├── .env
├── .gitignore
├── package.json
└── server.js
```

> O arquivo `.env` contém configurações locais e não deve ser publicado no GitHub.

---

## 🌐 Endpoints da API

### 🎞️ 01 — Listar todos os filmes

```http
GET /v1/controle-filmes/filme
```

Retorna os filmes cadastrados no banco de dados.

### 🎯 02 — Buscar filme pelo ID

```http
GET /v1/controle-filmes/filme/1
```

**Exemplo de resposta:**

```json
{
  "id": 1,
  "nome": "Interestelar",
  "genero": "Ficção científica",
  "ano": 2014,
  "sinopse": "Uma equipe viaja pelo espaço em busca de um novo lar para a humanidade."
}
```

### 🔎 03 — Pesquisar filmes

```http
GET /v1/controle-filmes/filtro/filme?nome=batman
```

Permite pesquisar filmes pelo nome ou pela sinopse.

---

## 🚦 Respostas HTTP

| Código | Status | Descrição |
|:---:|:---|:---|
| 🟢 200 | OK | Requisição realizada com sucesso |
| 🟡 400 | Bad Request | Parâmetro inválido |
| 🟠 404 | Not Found | Filme não encontrado |
| 🔴 500 | Internal Server Error | Falha interna no servidor |

---

## 🚀 Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/eucarlosz/unifecaf-flix.git
cd unifecaf-flix
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar o MySQL

Com o MySQL instalado e em execução, importe o arquivo:

```text
database/database.sql
```

### 4. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=unifecaf_flix
```

> Substitua `sua_senha` pela senha local do MySQL. Nunca publique esse arquivo.

### 5. Iniciar o servidor

```bash
node server.js
```

A API ficará disponível em:

**http://localhost:3000**

---

## 🧪 Testes realizados

Foram realizados testes manuais utilizando `curl` para validar o funcionamento da API.

| Cenário | Resultado |
|:---|:---:|
| Listar todos os filmes | ✅ 200 |
| Buscar filme por ID | ✅ 200 |
| Pesquisar por nome | ✅ 200 |
| Buscar filme inexistente | ✅ 404 |
| Informar ID inválido | ✅ 400 |
| Pesquisar sem parâmetro | ✅ 400 |

**Resultado: 6 cenários aprovados.**

---

## 🛡️ Boas práticas aplicadas

- Separação de responsabilidades com MVC.
- Consultas SQL parametrizadas.
- Utilização de variáveis de ambiente.
- Pool de conexões com MySQL.
- Tratamento de erros com `try/catch`.
- Validação de parâmetros recebidos.
- Versionamento do código com Git.

---

## 🗺️ Roadmap

- [x] Configuração do Node.js e Express.
- [x] Implementação da arquitetura MVC.
- [x] Criação dos três endpoints.
- [x] Integração com MySQL.
- [x] Validação e tratamento de erros.
- [x] Script SQL de configuração.
- [ ] Testes automatizados.
- [ ] Interface web moderna e responsiva.
- [ ] Ampliação do catálogo.
- [ ] Documentação final e apresentação.

---

## 👨‍💻 Desenvolvedor

<div align="center">

### Carlos Eduardo da Costa Freire

**Estudante de Análise e Desenvolvimento de Sistemas — UniFECAF**

Foco em desenvolvimento Backend, APIs REST e bancos de dados.

[![GitHub](https://img.shields.io/badge/GitHub-eucarlosz-181717?style=for-the-badge&logo=github)](https://github.com/eucarlosz)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Carlos_Eduardo-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/carloseduardocostaf/)

---

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00BFFF,50:164D9A,100:080B18&height=120&section=footer" width="100%" alt="Rodapé decorativo"/>

**UNIFECAF FLIX © 2026**

*Desenvolvido para fins acadêmicos e evolução profissional.*

</div>
