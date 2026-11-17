// =============================================================
// UniFECAF Flix — Planeta 3D interativo (Three.js)
// Carregado em index.html com: <script type="module" src="./planet.js"></script>
// =============================================================

// Versão FIXA do Three.js. Sem versão fixa, o CDN pode trocar a
// biblioteca sozinho e quebrar o código (uma causa comum do "planeta sumiu").
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const SELETORES = ["#planet-container", "#planet", ".planet-container", ".hero-planet", ".hero-visual"];
const container = SELETORES.map((s) => document.querySelector(s)).find(Boolean);
const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// -------------------------------------------------------------
// Utilitários
// -------------------------------------------------------------
const limitar = (v, min, max) => Math.min(max, Math.max(min, v));
const suavizar = (a, b, t) => {
  const x = limitar((t - a) / (b - a), 0, 1);
  return x * x * (3 - 2 * x);
};
// Interpolação independente da taxa de quadros (60 Hz ou 144 Hz se comportam igual)
const aproximar = (atual, alvo, velocidade, dt) => atual + (alvo - atual) * (1 - Math.exp(-velocidade * dt));

// Ruído procedural periódico no eixo X: a textura "fecha" sem emenda ao redor da esfera
function criarRuido(semente = 7) {
  let s = semente;
  const aleatorio = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const valores = new Float32Array(256 * 256);
  for (let i = 0; i < valores.length; i++) valores[i] = aleatorio();

  const curva = (t) => t * t * (3 - 2 * t);
  const v = (x, y) => valores[(y & 255) * 256 + (x & 255)];

  function ruido(x, y, periodo) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const fx = curva(x - xi);
    const fy = curva(y - yi);
    const x0 = ((xi % periodo) + periodo) % periodo;
    const x1 = (x0 + 1) % periodo;
    const a = v(x0, yi) + (v(x1, yi) - v(x0, yi)) * fx;
    const b = v(x0, yi + 1) + (v(x1, yi + 1) - v(x0, yi + 1)) * fx;
    return a + (b - a) * fy;
  }

  // Soma de várias camadas de ruído (fbm) → aspecto natural
  return function fbm(u, vv, escala, oitavas = 4) {
    let total = 0;
    let amplitude = 0.5;
    let freq = escala;
    for (let o = 0; o < oitavas; o++) {
      total += amplitude * ruido(u * freq, vv * freq, freq);
      freq *= 2;
      amplitude *= 0.5;
    }
    return total;
  };
}

// -------------------------------------------------------------
// Texturas geradas em canvas (não dependem de arquivos externos)
// -------------------------------------------------------------
function criarTexturaPlaneta(fbm) {
  const L = 1024;
  const A = 512;
  const canvas = document.createElement("canvas");
  canvas.width = L;
  canvas.height = A;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(L, A);

  const paleta = [
    [5, 12, 32],
    [12, 36, 88],
    [26, 78, 160],
    [80, 142, 228],
    [186, 216, 255],
  ];

  // Tempestades: quebram a simetria das faixas.
  // Faixas só horizontais parecem paradas ao girar — por isso a rotação antiga quase não aparecia.
  const tempestades = [
    { u: 0.22, v: 0.62, ru: 0.055, rv: 0.032 },
    { u: 0.66, v: 0.37, ru: 0.038, rv: 0.024 },
    { u: 0.86, v: 0.71, ru: 0.022, rv: 0.015 },
  ];

  for (let y = 0; y < A; y++) {
    const vv = y / A;
    const latitude = Math.abs(vv - 0.5) * 2;

    for (let x = 0; x < L; x++) {
      const u = x / L;
      const turbulencia = fbm(u, vv, 8, 5);

      const faixa = Math.sin((vv + (turbulencia - 0.47) * 0.14) * Math.PI * 18) * 0.5 + 0.5;
      const macro = Math.sin(vv * Math.PI * 5 + turbulencia * 2.2) * 0.5 + 0.5;
      const detalhe = fbm(u, vv * 3, 16, 3);

      let t = faixa * 0.45 + macro * 0.3 + detalhe * 0.35;

      for (const s of tempestades) {
        let du = u - s.u;
        if (du > 0.5) du -= 1;
        if (du < -0.5) du += 1;
        const d = (du / s.ru) ** 2 + ((vv - s.v) / s.rv) ** 2;
        if (d < 6) {
          t += Math.exp(-d * 1.4) * 0.55;
          t -= Math.exp(-((Math.sqrt(d) - 1.5) ** 2) * 5) * 0.22;
        }
      }

      t *= 1 - suavizar(0.72, 1, latitude) * 0.5; // polos mais escuros
      t = limitar(t, 0, 0.999) * (paleta.length - 1);

      const i = Math.floor(t);
      const f = t - i;
      const c0 = paleta[i];
      const c1 = paleta[i + 1];
      const p = (y * L + x) * 4;
      img.data[p] = c0[0] + (c1[0] - c0[0]) * f;
      img.data[p + 1] = c0[1] + (c1[1] - c0[1]) * f;
      img.data[p + 2] = c0[2] + (c1[2] - c0[2]) * f;
      img.data[p + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  return textura;
}

function criarTexturaNuvens(fbm) {
  const L = 512;
  const A = 256;
  const canvas = document.createElement("canvas");
  canvas.width = L;
  canvas.height = A;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(L, A);

  for (let y = 0; y < A; y++) {
    const vv = y / A;
    for (let x = 0; x < L; x++) {
      const u = x / L;
      const n = fbm(u + 0.37, vv * 3 + 11, 6, 5); // esticado na horizontal → nuvens em faixas
      const p = (y * L + x) * 4;
      img.data[p] = 225;
      img.data[p + 1] = 238;
      img.data[p + 2] = 255;
      img.data[p + 3] = suavizar(0.48, 0.72, n) * 150;
    }
  }

  ctx.putImageData(img, 0, 0);
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  return textura;
}

// -------------------------------------------------------------
// Cena
// -------------------------------------------------------------
function iniciarPlaneta(container) {
  // O canvas fica em position:absolute, então o tamanho vem só do container (sem loop de redimensionamento)
  if (getComputedStyle(container).position === "static") container.style.position = "relative";
  if (container.clientHeight < 80) container.style.minHeight = "420px";

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const canvas = renderer.domElement;
  container.querySelectorAll("canvas").forEach((c) => c.remove()); // remove canvas de versões antigas
  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    display: "block",
    opacity: "0",
    cursor: "grab",
    touchAction: "pan-y", // no celular: arrastar na horizontal gira, na vertical rola a página
    transition: reduzirMovimento ? "opacity 0.4s ease" : "opacity 1.6s cubic-bezier(0.22, 1, 0.36, 1)",
  });
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Planeta 3D interativo. Arraste para girar.");
  container.appendChild(canvas);

  const cena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);

  // Iluminação: luz principal + preenchimento azul + contraluz para destacar a borda
  const sol = new THREE.DirectionalLight(0xffffff, 2.8);
  sol.position.set(-4, 2.5, 5);
  const contraluz = new THREE.DirectionalLight(0x3d8bff, 1.4);
  contraluz.position.set(5, -1, -4);
  cena.add(sol, contraluz, new THREE.AmbientLight(0x4a6cff, 0.22));

  // Hierarquia: raiz (flutuação e mouse) → sistema (arraste) → eixo (inclinação) → planeta
  const raiz = new THREE.Group();
  const sistema = new THREE.Group();
  const eixo = new THREE.Group();
  eixo.rotation.z = 0.38;
  raiz.add(sistema);
  sistema.add(eixo);
  cena.add(raiz);

  const fbm = criarRuido();
  const texturaPlaneta = criarTexturaPlaneta(fbm);
  texturaPlaneta.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const planeta = new THREE.Mesh(
    new THREE.SphereGeometry(1, 96, 64),
    new THREE.MeshStandardMaterial({ map: texturaPlaneta, roughness: 0.85, metalness: 0 })
  );

  const nuvens = new THREE.Mesh(
    new THREE.SphereGeometry(1.014, 96, 64),
    new THREE.MeshStandardMaterial({ map: criarTexturaNuvens(fbm), transparent: true, depthWrite: false, roughness: 1 })
  );

  // Atmosfera: brilho só na borda (efeito Fresnel)
  const atmosfera = new THREE.Mesh(
    new THREE.SphereGeometry(1.06, 64, 48),
    new THREE.ShaderMaterial({
      uniforms: { uCor: { value: new THREE.Color(0x4da3ff) } },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vVisao;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vVisao = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 uCor;
        varying vec3 vNormal;
        varying vec3 vVisao;
        void main() {
          float f = pow(1.0 - max(dot(vNormal, vVisao), 0.0), 2.6);
          gl_FragColor = vec4(uCor * f * 1.3, f);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );

  eixo.add(planeta, nuvens, atmosfera);

  // Anéis orbitais: cada um tem uma pequena "esfera luminosa" percorrendo a órbita,
  // senão o movimento de um anel perfeito seria invisível
  const aneis = [
    { raio: 1.38, rotacao: [1.35, 0, 0.25], vel: 0.55, opacidade: 0.5 },
    { raio: 1.6, rotacao: [1.2, 0, -0.45], vel: -0.38, opacidade: 0.32 },
    { raio: 1.82, rotacao: [1.78, 0, 0.6], vel: 0.26, opacidade: 0.2 },
  ].map((cfg) => {
    const precessao = new THREE.Group();
    const plano = new THREE.Group();
    plano.rotation.set(...cfg.rotacao);

    const anel = new THREE.Mesh(
      new THREE.TorusGeometry(cfg.raio, 0.0045, 8, 220),
      new THREE.MeshBasicMaterial({ color: 0x7fb8ff, transparent: true, opacity: cfg.opacidade })
    );

    const pivo = new THREE.Group();
    const ponto = new THREE.Mesh(
      new THREE.SphereGeometry(0.022, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0xcfe4ff })
    );
    ponto.position.x = cfg.raio;
    pivo.add(ponto);

    plano.add(anel, pivo);
    precessao.add(plano);
    sistema.add(precessao);
    return { precessao, pivo, vel: cfg.vel };
  });

  // Satélite: corpo + dois painéis solares
  const orbitaSatelite = new THREE.Group();
  orbitaSatelite.rotation.set(0.35, 0, -0.25);
  const satelite = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: 0xd6dde8, roughness: 0.4, metalness: 0.6 });
  const painel = new THREE.MeshStandardMaterial({ color: 0x1f4fa8, roughness: 0.3, metalness: 0.5, emissive: 0x0a1f4a });
  satelite.add(new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.07), metal));
  const painelEsq = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.004, 0.05), painel);
  painelEsq.position.x = -0.1;
  const painelDir = painelEsq.clone();
  painelDir.position.x = 0.1;
  satelite.add(painelEsq, painelDir);
  satelite.position.x = 2.0;
  orbitaSatelite.add(satelite);
  sistema.add(orbitaSatelite);

  // -----------------------------------------------------------
  // Interação: arrastar com inércia + leve reação ao mouse
  // -----------------------------------------------------------
  const GIRO_AUTOMATICO = reduzirMovimento ? 0.05 : 0.18; // rad/s do sistema inteiro
  const GIRO_PLANETA = reduzirMovimento ? 0.06 : 0.24; // rad/s do planeta sobre o próprio eixo
  const SENSIBILIDADE = 0.008; // radianos por pixel arrastado

  let arrastando = false;
  let ultimoX = 0;
  let ultimoY = 0;
  let ultimoTempo = 0;
  let velocidadeY = GIRO_AUTOMATICO;
  let inclinacaoAlvo = 0;
  let inclinacao = 0;
  const paralaxeAlvo = { x: 0, y: 0 };

  canvas.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    arrastando = true;
    ultimoX = e.clientX;
    ultimoY = e.clientY;
    ultimoTempo = performance.now();
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = "grabbing";
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!arrastando) return;
    const agora = performance.now();
    const dt = Math.max(8, agora - ultimoTempo) / 1000;
    const dx = e.clientX - ultimoX;
    const dy = e.clientY - ultimoY;

    sistema.rotation.y += dx * SENSIBILIDADE;
    // Guarda a velocidade do gesto para continuar girando ao soltar (inércia)
    velocidadeY = velocidadeY * 0.5 + limitar((dx * SENSIBILIDADE) / dt, -6, 6) * 0.5;
    inclinacaoAlvo = limitar(inclinacaoAlvo + dy * SENSIBILIDADE * 0.7, -0.6, 0.6);

    ultimoX = e.clientX;
    ultimoY = e.clientY;
    ultimoTempo = agora;
  });

  const soltar = (e) => {
    if (!arrastando) return;
    arrastando = false;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    canvas.style.cursor = "grab";
    // Se o usuário parou o mouse antes de soltar, não "arremessa"
    if (performance.now() - ultimoTempo > 80) velocidadeY = 0;
  };
  canvas.addEventListener("pointerup", soltar);
  canvas.addEventListener("pointercancel", soltar);

  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || arrastando) return;
    paralaxeAlvo.y = (e.clientX / window.innerWidth - 0.5) * 0.24;
    paralaxeAlvo.x = (e.clientY / window.innerHeight - 0.5) * 0.16;
  });

  // -----------------------------------------------------------
  // Tamanho responsivo: a câmera se afasta em telas estreitas
  // -----------------------------------------------------------
  function redimensionar() {
    const largura = container.clientWidth;
    const altura = container.clientHeight;
    if (!largura || !altura) return;

    renderer.setSize(largura, altura, false);
    camera.aspect = largura / altura;
    const raioVisivel = 2.2; // planeta + anéis + satélite
    const meioFov = THREE.MathUtils.degToRad(camera.fov / 2);
    camera.position.set(0, 0, raioVisivel / Math.tan(meioFov) / Math.min(1, camera.aspect));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(redimensionar).observe(container);
  redimensionar();

  // Pausa a renderização quando o planeta sai da tela (economiza bateria/CPU)
  let visivel = true;
  new IntersectionObserver(([entrada]) => {
    visivel = entrada.isIntersecting;
  }).observe(container);

  // -----------------------------------------------------------
  // Loop de animação
  // -----------------------------------------------------------
  const inicio = performance.now();
  let anterior = inicio;
  let primeiroQuadro = true;

  function animar(agora) {
    requestAnimationFrame(animar);
    const dt = Math.min(0.05, (agora - anterior) / 1000);
    anterior = agora;
    if (!visivel) return;

    const tempo = (agora - inicio) / 1000;

    // Giro contínuo + inércia que volta suavemente à velocidade automática
    if (!arrastando) {
      sistema.rotation.y += velocidadeY * dt;
      velocidadeY = aproximar(velocidadeY, GIRO_AUTOMATICO, 1.4, dt);
      inclinacaoAlvo = aproximar(inclinacaoAlvo, 0, 0.9, dt);
    }
    inclinacao = aproximar(inclinacao, inclinacaoAlvo, 10, dt);
    sistema.rotation.x = inclinacao;

    planeta.rotation.y += GIRO_PLANETA * dt;
    nuvens.rotation.y += GIRO_PLANETA * 1.35 * dt;

    for (const a of aneis) {
      a.pivo.rotation.z += a.vel * dt;
      a.precessao.rotation.y += a.vel * 0.12 * dt;
    }
    orbitaSatelite.rotation.y += (reduzirMovimento ? 0.15 : 0.6) * dt;
    satelite.rotation.y += 0.8 * dt;

    // Flutuação e reação ao mouse
    raiz.position.y = reduzirMovimento ? 0 : Math.sin(tempo * 0.9) * 0.06;
    raiz.rotation.x = aproximar(raiz.rotation.x, paralaxeAlvo.x, 3, dt);
    raiz.rotation.y = aproximar(raiz.rotation.y, paralaxeAlvo.y, 3, dt);

    // Entrada: cresce de 82% para 100% com desaceleração suave
    const progresso = reduzirMovimento ? 1 : Math.min(1, tempo / 1.8);
    raiz.scale.setScalar(0.82 + 0.18 * (1 - Math.pow(1 - progresso, 4)));

    renderer.render(cena, camera);

    if (primeiroQuadro) {
      primeiroQuadro = false;
      canvas.style.opacity = "1";
    }
  }
  requestAnimationFrame(animar);
}


/* ==========================================
   INICIALIZAÇÃO SEGURA DO PLANETA 3D
========================================== */

if (!container) {
  console.error(
    "[planet.js] Container do planeta não encontrado."
  );
} else {
  try {
    iniciarPlaneta(container);

    console.log(
      "[planet.js] Planeta 3D inicializado."
    );
  } catch (erro) {
    console.error(
      "[planet.js] Erro ao inicializar o planeta:",
      erro
    );

    container.classList.add("planet--fallback");
  }
}
