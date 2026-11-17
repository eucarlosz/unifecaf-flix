CREATE DATABASE IF NOT EXISTS unifecaf_flix
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE unifecaf_flix;

CREATE TABLE IF NOT EXISTS filmes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    genero VARCHAR(100) NOT NULL,
    ano INT NOT NULL,
    sinopse TEXT,
    poster_url VARCHAR(255)
);

-- Cada INSERT só acontece se o filme ainda não existir (o script pode rodar mais de uma vez)

INSERT INTO filmes (nome, genero, ano, sinopse, poster_url)
SELECT 'Interestelar', 'Ficção científica', 2014,
       'Uma equipe viaja pelo espaço em busca de um novo lar para a humanidade.',
       '/images/interestelar.webp'
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE nome = 'Interestelar');

INSERT INTO filmes (nome, genero, ano, sinopse, poster_url)
SELECT 'Batman: O Cavaleiro das Trevas', 'Ação', 2008,
       'Batman enfrenta o Coringa para proteger Gotham City.',
       '/images/batman.webp'
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE nome = 'Batman: O Cavaleiro das Trevas');

INSERT INTO filmes (nome, genero, ano, sinopse, poster_url)
SELECT 'Vingadores: Ultimato', 'Ação', 2019,
       'Os Vingadores se unem para tentar reverter as ações de Thanos.',
       '/images/avengers.webp'
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE nome = 'Vingadores: Ultimato');

INSERT INTO filmes (nome, genero, ano, sinopse, poster_url)
SELECT 'A Origem', 'Ficção científica', 2010,
       'Um ladrão especializado em invadir sonhos para roubar segredos recebe a missão inversa: implantar uma ideia na mente de um herdeiro.',
       '/images/a-origem.webp'
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE nome = 'A Origem');

INSERT INTO filmes (nome, genero, ano, sinopse, poster_url)
SELECT 'Homem-Aranha: Através do Aranhaverso', 'Animação', 2023,
       'Miles Morales atravessa o Multiverso e encontra uma sociedade de heróis-aranha que discorda dele sobre como enfrentar uma nova ameaça.',
       '/images/aranhaverso.webp'
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE nome = 'Homem-Aranha: Através do Aranhaverso');

INSERT INTO filmes (nome, genero, ano, sinopse, poster_url)
SELECT 'Coringa', 'Drama', 2019,
       'Arthur Fleck, um comediante fracassado de Gotham City, mergulha em uma espiral de abandono e violência que o transforma no Coringa.',
       '/images/coringa.webp'
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE nome = 'Coringa');

INSERT INTO filmes (nome, genero, ano, sinopse, poster_url)
SELECT 'Parasita', 'Suspense', 2019,
       'Uma família pobre se infiltra, um a um, na rotina de uma família rica, até que um segredo escondido na casa muda tudo.',
       '/images/parasita.webp'
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE nome = 'Parasita');

INSERT INTO filmes (nome, genero, ano, sinopse, poster_url)
SELECT 'Cidade de Deus', 'Drama', 2002,
       'Pelo olhar de Buscapé, um jovem que sonha ser fotógrafo, o filme acompanha o crescimento do crime em uma comunidade do Rio de Janeiro entre os anos 60 e 80.',
       '/images/cidade-de-deus.webp'
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE nome = 'Cidade de Deus');
