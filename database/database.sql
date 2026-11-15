
CREATE DATABASE IF NOT EXISTS unifecaf_flix
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE unifecaf_flix;

CREATE TABLE IF NOT EXISTS filmes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    genero VARCHAR(100) NOT NULL,
    ano INT NOT NULL,
    sinopse TEXT
);

INSERT INTO filmes (nome, genero, ano, sinopse)
SELECT 'Interestelar', 'Ficção científica', 2014,
       'Uma equipe viaja pelo espaço em busca de um novo lar para a humanidade.'
WHERE NOT EXISTS (
    SELECT 1 FROM filmes WHERE id = 1
);

INSERT INTO filmes (nome, genero, ano, sinopse)
SELECT 'Batman: O Cavaleiro das Trevas', 'Ação', 2008,
       'Batman enfrenta o Coringa para proteger Gotham City.'
WHERE NOT EXISTS (
    SELECT 1 FROM filmes WHERE id = 2
);

INSERT INTO filmes (nome, genero, ano, sinopse)
SELECT 'Vingadores: Ultimato', 'Ação', 2019,
       'Os Vingadores se unem para tentar reverter as ações de Thanos.'
WHERE NOT EXISTS (
    SELECT 1 FROM filmes WHERE id = 3
);
