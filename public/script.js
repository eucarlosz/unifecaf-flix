
// =============================================================
// UniFECAF Flix — Catálogo, animações e janela de detalhes
// Compatível com Node.js e GitHub Pages
// =============================================================

const API_URL = "/v1/controle-filmes";

// Catálogo para a demonstração estática no GitHub Pages.
// Os dados correspondem ao database/database.sql.
const LOCAL_MOVIES = [
  {
    id: 1,
    nome: "Interestelar",
    genero: "Ficção científica",
    ano: 2014,
    sinopse: "Uma equipe viaja pelo espaço em busca de um novo lar para a humanidade.",
    poster_url: "images/interestelar.webp"
  },
  {
    id: 2,
    nome: "Batman: O Cavaleiro das Trevas",
    genero: "Ação",
    ano: 2008,
    sinopse: "Batman enfrenta o Coringa para proteger Gotham City.",
    poster_url: "images/batman.webp"
  },
  {
    id: 3,
    nome: "Vingadores: Ultimato",
    genero: "Ação",
    ano: 2019,
    sinopse: "Os Vingadores se unem para tentar reverter as ações de Thanos.",
    poster_url: "images/avengers.webp"
  },
  {
    id: 4,
    nome: "A Origem",
    genero: "Ficção científica",
    ano: 2010,
    sinopse: "Um ladrão especializado em invadir sonhos para roubar segredos recebe a missão inversa: implantar uma ideia na mente de um herdeiro.",
    poster_url: "images/a-origem.webp"
  },
  {
    id: 5,
    nome: "Homem-Aranha: Através do Aranhaverso",
    genero: "Animação",
    ano: 2023,
    sinopse: "Miles Morales atravessa o Multiverso e encontra uma sociedade de heróis-aranha que discorda dele sobre como enfrentar uma nova ameaça.",
    poster_url: "images/aranhaverso.webp"
  },
  {
    id: 6,
    nome: "Coringa",
    genero: "Drama",
    ano: 2019,
    sinopse: "Arthur Fleck, um comediante fracassado de Gotham City, mergulha em uma espiral de abandono e violência que o transforma no Coringa.",
    poster_url: "images/coringa.webp"
  },
  {
    id: 7,
    nome: "Parasita",
    genero: "Suspense",
    ano: 2019,
    sinopse: "Uma família pobre se infiltra, um a um, na rotina de uma família rica, até que um segredo escondido na casa muda tudo.",
    poster_url: "images/parasita.webp"
  },
  {
    id: 8,
    nome: "Cidade de Deus",
    genero: "Drama",
    ano: 2002,
    sinopse: "Pelo olhar de Buscapé, um jovem que sonha ser fotógrafo, o filme acompanha o crescimento do crime em uma comunidade do Rio de Janeiro entre os anos 60 e 80.",
    poster_url: "images/cidade-de-deus.webp"
  }
];

const isGitHubPages =
  window.location.hostname.endsWith(".github.io");

const header = document.getElementById("header");
const movieGrid = document.getElementById("movieGrid");
const searchInput = document.getElementById("searchInput");
const statusMessage = document.getElementById("statusMessage");

const modal = document.getElementById("movieModal");
const modalPoster = document.getElementById("modalPoster");
const modalMeta = document.getElementById("modalMeta");
const modalTitle = document.getElementById("modalTitle");
const modalSynopsis = document.getElementById("modalSynopsis");
const modalClose = document.getElementById("modalClose");

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const supportsHover = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
).matches;

let currentMovies = [];
let currentRequest = null;
let searchTimer;

window.flixPronto = true;

// -------------------------------------------------------------
// Utilitários
// -------------------------------------------------------------

function createElement(tag, className = "", text) {
  const element = document.createElement(tag);

  if (className) element.className = className;
  if (text !== undefined) element.textContent = String(text);

  return element;
}

function updateStatus(message) {
  statusMessage.textContent = message;
}

function movieMeta(movie) {
  return [movie.genero, movie.ano]
    .filter(Boolean)
    .join(" • ");
}

// -------------------------------------------------------------
// Animações de entrada
// -------------------------------------------------------------

const revealObserver =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -40px 0px"
        }
      )
    : null;

function reveal(elements) {
  elements.forEach((element) => {
    if (revealObserver) {
      revealObserver.observe(element);
    } else {
      element.classList.add("is-visible");
    }
  });
}

reveal(document.querySelectorAll(".reveal"));

// -------------------------------------------------------------
// Cabeçalho
// -------------------------------------------------------------

function updateHeader() {
  header.classList.toggle(
    "is-scrolled",
    window.scrollY > 10
  );
}

window.addEventListener("scroll", updateHeader, {
  passive: true
});

updateHeader();

// -------------------------------------------------------------
// Pôsteres
// -------------------------------------------------------------

function fillPoster(container, movie) {
  container.replaceChildren();

  const showFallback = () => {
    container.replaceChildren(
      createElement(
        "span",
        "poster-fallback",
        movie.nome || "Filme"
      )
    );
  };

  if (!movie.poster_url) {
    showFallback();
    return;
  }

  const image = document.createElement("img");

  image.className = "poster-image is-loading";
  image.alt = `Pôster de ${movie.nome || "filme"}`;
  image.decoding = "async";
  image.loading = "lazy";

  image.addEventListener("load", () => {
    image.classList.remove("is-loading");
  });

  image.addEventListener("error", showFallback);

  // Resolve caminhos absolutos da API e relativos do Pages.
  const posterPath = movie.poster_url;

  image.src = isGitHubPages
    ? posterPath.replace(/^\/+/, "")
    : posterPath;

  container.appendChild(image);
}

// -------------------------------------------------------------
// Cards
// -------------------------------------------------------------

function createMovieCard(movie, index) {
  const item = createElement(
    "div",
    "movie-item reveal"
  );

  item.style.setProperty(
    "--delay",
    `${Math.min(index, 8) * 80}ms`
  );

  const card = createElement(
    "article",
    "movie-card"
  );

  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute(
    "aria-label",
    `Ver detalhes de ${movie.nome}`
  );

  card.dataset.index = index;

  const poster = createElement(
    "div",
    "movie-poster"
  );

  fillPoster(poster, movie);

  const info = createElement(
    "div",
    "movie-info"
  );

  info.append(
    createElement(
      "h3",
      "movie-title",
      movie.nome || "Sem título"
    ),
    createElement(
      "p",
      "movie-meta",
      movieMeta(movie)
    ),
    createElement(
      "p",
      "movie-description",
      movie.sinopse || "Sinopse não disponível."
    )
  );

  card.append(poster, info);
  item.appendChild(card);

  return item;
}

// -------------------------------------------------------------
// Carregamento visual
// -------------------------------------------------------------

function showSkeleton(amount = 4) {
  const skeletons = Array.from(
    { length: amount },
    () => {
      const card = createElement(
        "div",
        "skeleton-card"
      );

      card.setAttribute(
        "aria-hidden",
        "true"
      );

      card.append(
        createElement(
          "div",
          "skeleton-block skeleton-poster"
        ),
        createElement(
          "div",
          "skeleton-block skeleton-line"
        ),
        createElement(
          "div",
          "skeleton-block skeleton-line"
        )
      );

      return card;
    }
  );

  movieGrid.replaceChildren(...skeletons);
}

// -------------------------------------------------------------
// Renderização
// -------------------------------------------------------------

function renderMovies(movies, term = "") {
  currentMovies = Array.isArray(movies)
    ? movies
    : [];

  if (currentMovies.length === 0) {
    movieGrid.replaceChildren();

    updateStatus(
      term
        ? `Nenhum filme encontrado para “${term}”.`
        : "Nenhum filme cadastrado."
    );

    return;
  }

  const items = currentMovies.map(
    createMovieCard
  );

  movieGrid.replaceChildren(...items);

  reveal(items);

  const total = currentMovies.length;

  updateStatus(
    `${total} ${
      total === 1
        ? "filme encontrado"
        : "filmes encontrados"
    }`
  );
}

// -------------------------------------------------------------
// Pesquisa local
// -------------------------------------------------------------

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function searchLocalMovies(term) {
  const query = normalizeText(term.trim());

  if (!query) {
    return [...LOCAL_MOVIES];
  }

  return LOCAL_MOVIES.filter((movie) =>
    normalizeText(movie.nome).includes(query)
  );
}

// -------------------------------------------------------------
// Carregamento dos filmes
// -------------------------------------------------------------

async function loadMovies(search = "") {
  if (currentRequest) {
    currentRequest.abort();
    currentRequest = null;
  }

  const term = search.trim();

  // GitHub Pages: funciona sem servidor e sem MySQL.
  if (isGitHubPages) {
    renderMovies(searchLocalMovies(term), term);
    return;
  }

  // Ambiente Node.js: mantém a API original.
  const controller = new AbortController();
  currentRequest = controller;

  const endpoint = term
    ? `${API_URL}/filtro/filme?nome=${encodeURIComponent(term)}`
    : `${API_URL}/filme`;

  updateStatus("Carregando filmes...");
  showSkeleton();

  try {
    const response = await fetch(endpoint, {
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    const movies = await response.json();

    if (currentRequest === controller) {
      renderMovies(movies, term);
    }
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }

    console.error(
      "Erro ao carregar filmes:",
      error
    );

    movieGrid.replaceChildren();

    updateStatus(
      "Não foi possível carregar os filmes. Verifique se o servidor e o MySQL estão rodando."
    );
  } finally {
    if (currentRequest === controller) {
      currentRequest = null;
    }
  }
}

// -------------------------------------------------------------
// Campo de pesquisa
// -------------------------------------------------------------

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);

  searchTimer = setTimeout(() => {
    loadMovies(searchInput.value);
  }, 350);
});

// -------------------------------------------------------------
// Efeito 3D dos cards
// -------------------------------------------------------------

if (supportsHover && !reduceMotion) {
  movieGrid.addEventListener(
    "pointermove",
    (event) => {
      const card = event.target.closest(
        ".movie-card"
      );

      if (!card) return;

      const rect =
        card.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) /
        rect.width;

      const y =
        (event.clientY - rect.top) /
        rect.height;

      card.style.setProperty(
        "--ry",
        `${(x - 0.5) * 7}deg`
      );

      card.style.setProperty(
        "--rx",
        `${(0.5 - y) * 5}deg`
      );

      card.style.setProperty(
        "--mouse-x",
        `${x * 100}%`
      );

      card.style.setProperty(
        "--mouse-y",
        `${y * 100}%`
      );
    }
  );

  movieGrid.addEventListener(
    "pointerout",
    (event) => {
      const card = event.target.closest(
        ".movie-card"
      );

      if (
        !card ||
        card.contains(event.relatedTarget)
      ) {
        return;
      }

      card.style.setProperty(
        "--rx",
        "0deg"
      );

      card.style.setProperty(
        "--ry",
        "0deg"
      );
    }
  );
}

// -------------------------------------------------------------
// Janela de detalhes
// -------------------------------------------------------------

function openModal(movie) {
  if (!movie) return;

  fillPoster(modalPoster, movie);

  modalMeta.textContent = movieMeta(movie);
  modalTitle.textContent = movie.nome;

  modalSynopsis.textContent =
    movie.sinopse ||
    "Sinopse não disponível.";

  modal.showModal();

  document.body.style.overflow =
    "hidden";

  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      modal.classList.add("is-open")
    )
  );
}

function closeModal() {
  if (!modal.open || modal.dataset.closing) {
    return;
  }

  modal.dataset.closing = "true";
  modal.classList.remove("is-open");

  const finish = () => {
    delete modal.dataset.closing;
    modal.close();
    document.body.style.overflow = "";
  };

  if (reduceMotion) {
    return finish();
  }

  const fallback = setTimeout(
    finish,
    600
  );

  modal.addEventListener(
    "transitionend",
    (event) => {
      if (event.target !== modal) return;

      clearTimeout(fallback);
      finish();
    },
    { once: true }
  );
}

movieGrid.addEventListener(
  "click",
  (event) => {
    const card = event.target.closest(
      ".movie-card"
    );

    if (card) {
      openModal(
        currentMovies[
          Number(card.dataset.index)
        ]
      );
    }
  }
);

movieGrid.addEventListener(
  "keydown",
  (event) => {
    const card = event.target.closest(
      ".movie-card"
    );

    if (
      !card ||
      (
        event.key !== "Enter" &&
        event.key !== " "
      )
    ) {
      return;
    }

    event.preventDefault();

    openModal(
      currentMovies[
        Number(card.dataset.index)
      ]
    );
  }
);

modalClose.addEventListener(
  "click",
  closeModal
);

modal.addEventListener(
  "cancel",
  (event) => {
    event.preventDefault();
    closeModal();
  }
);

modal.addEventListener(
  "click",
  (event) => {
    if (event.target === modal) {
      closeModal();
    }
  }
);

// -------------------------------------------------------------
// Fallback do planeta 3D
// -------------------------------------------------------------

setTimeout(() => {
  const planet = document.getElementById(
    "planet-container"
  );

  if (
    planet &&
    !planet.querySelector("canvas")
  ) {
    planet.classList.add(
      "planet--fallback"
    );
  }
}, 5000);

// -------------------------------------------------------------
// Inicialização
// -------------------------------------------------------------

loadMovies();