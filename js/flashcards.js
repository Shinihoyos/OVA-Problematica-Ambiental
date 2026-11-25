(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Iconografía sencilla (misma paleta) ---------- */
  const svg = (inner) => `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">${inner}</svg>`;
  const CLOUD = (y) => `<path d="M13 ${y}a7 7 0 0 1 1-14 9 9 0 0 1 17-1 7 7 0 0 1 2 15z" fill="#BBC4A6"/>`;
  const DROP = (fill) => `<path d="M24 6C17 16 12 22 12 29a12 12 0 0 0 24 0c0-7-5-13-12-23z" fill="${fill}"/>`;
  const ICONS = {
    smog: svg(`${CLOUD(30)}<path d="M12 37h24M16 42h16" stroke="#F1F2E6" stroke-width="3.5" stroke-linecap="round"/>`),
    rain: svg(`${CLOUD(26)}<path d="M16 33l-2 6M24 33l-2 6M32 33l-2 6" stroke="#F1F2E6" stroke-width="3.5" stroke-linecap="round"/>`),
    ghg: svg(`<rect x="20" y="6" width="8" height="26" rx="4" stroke="#F1F2E6" stroke-width="3.5"/><circle cx="24" cy="36" r="6" fill="#F1F2E6"/><path d="M24 14v20" stroke="#6D985E" stroke-width="3.5"/><path d="M33 12h6M33 18h4M33 24h6" stroke="#BBC4A6" stroke-width="3" stroke-linecap="round"/>`),
    noise: svg(`<path d="M8 20h7l9-8v24l-9-8H8z" fill="#F1F2E6"/><path d="M30 18c3 3 3 9 0 12M35 14c6 6 6 14 0 20" stroke="#BBC4A6" stroke-width="3.5" stroke-linecap="round"/>`),
    eutro: svg(`${DROP("#BBC4A6")}<path d="M16 30c3-3 5 3 8 0s5 3 8 0" stroke="#2C3822" stroke-width="3" stroke-linecap="round"/>`),
    oil: svg(`${DROP("#F1F2E6")}<ellipse cx="24" cy="31" rx="6" ry="4" fill="#2C3822"/>`),
    ocean: svg(`<path d="M6 18c4-5 8 5 12 0s8 5 12 0 8 5 12 0M6 28c4-5 8 5 12 0s8 5 12 0 8 5 12 0" stroke="#F1F2E6" stroke-width="3.5" stroke-linecap="round"/><circle cx="16" cy="38" r="2.5" fill="#BBC4A6"/><circle cx="26" cy="40" r="3.5" fill="#BBC4A6"/><circle cx="35" cy="37" r="2" fill="#BBC4A6"/>`),
    patch: svg(`<circle cx="24" cy="24" r="16" stroke="#BBC4A6" stroke-width="3" stroke-dasharray="4 5"/><circle cx="24" cy="24" r="8" stroke="#F1F2E6" stroke-width="3"/><circle cx="24" cy="24" r="2.5" fill="#F1F2E6"/>`),
    micro: svg(`<circle cx="14" cy="16" r="4" fill="#F1F2E6"/><circle cx="30" cy="12" r="3" fill="#BBC4A6"/><circle cx="36" cy="26" r="5" fill="#F1F2E6"/><circle cx="20" cy="30" r="3" fill="#BBC4A6"/><circle cx="28" cy="38" r="3.5" fill="#F1F2E6"/><circle cx="11" cy="36" r="2.5" fill="#BBC4A6"/>`),
    metal: svg(`<path d="M20 8h8v12l9 16a4 4 0 0 1-3.5 6h-19A4 4 0 0 1 11 36l9-16z" stroke="#F1F2E6" stroke-width="3.5" stroke-linejoin="round"/><path d="M15 33h18" stroke="#BBC4A6" stroke-width="3.5" stroke-linecap="round"/>`),
    ewaste: svg(`<rect x="14" y="6" width="20" height="36" rx="5" stroke="#F1F2E6" stroke-width="3.5"/><path d="M21 36h6" stroke="#BBC4A6" stroke-width="3.5" stroke-linecap="round"/><path d="M19 14l10 10M29 14L19 24" stroke="#6D985E" stroke-width="3.5" stroke-linecap="round"/>`),
    leach: svg(`<path d="M8 14h32M8 22h32M8 30h32" stroke="#BBC4A6" stroke-width="3.5" stroke-linecap="round"/><path d="M24 30c-3 4-5 6-5 9a5 5 0 0 0 10 0c0-3-2-5-5-9z" fill="#F1F2E6"/>`),
    leaf: svg(`<path d="M10 38C8 22 18 10 38 8c1 20-9 30-24 31" fill="#BBC4A6"/><path d="M12 36L30 18" stroke="#2C3822" stroke-width="3" stroke-linecap="round"/>`)
  };

  /* ---------- Contenido ---------- */
  const CATS = {
    aire:  { name: "Contaminación del aire", short: "Aire", icon: "smog",
             desc: "Gases, partículas y ruido que cambian la atmósfera y la vida en las ciudades." },
    agua:  { name: "Contaminación del agua", short: "Agua", icon: "eutro",
             desc: "Ríos, mares y océanos alterados por vertimientos, derrames y residuos." },
    suelo: { name: "Suelo y residuos", short: "Suelo y residuos", icon: "leach",
             desc: "Basuras, metales y desechos que se acumulan en la tierra y en los organismos." }
  };

  const CARDS = [
    { id: 1, cat: "aire", icon: "smog", term: "Smog",
      def: "Mezcla de humo, niebla y contaminantes como partículas, ozono y óxidos de nitrógeno que se acumula cerca del suelo y reduce la calidad del aire.",
      sit: "En muchas megaciudades, el tráfico, la industria y la quema de combustibles provocan días de aire poco saludable, con efectos en los pulmones y el corazón.",
      q: "¿Qué actividades de tu ciudad podrían estar generando esas emisiones?" },
    { id: 2, cat: "aire", icon: "rain", term: "Lluvia ácida",
      def: "Precipitación con acidez elevada, que se forma cuando el dióxido de azufre y los óxidos de nitrógeno reaccionan con el agua de la atmósfera.",
      sit: "Puede viajar lejos de su origen y dañar bosques, suelos, lagos y construcciones, incluso en regiones donde no hay industrias.",
      q: "¿Por qué un problema generado en un lugar puede afectar a otro país?" },
    { id: 3, cat: "aire", icon: "ghg", term: "Gases de efecto invernadero",
      def: "Gases como el dióxido de carbono y el metano que retienen calor en la atmósfera; su aumento por actividades humanas intensifica el calentamiento global.",
      sit: "La quema de combustibles fósiles, la ganadería intensiva y la deforestación elevan su concentración y alteran el clima en todo el planeta.",
      q: "¿Qué hábitos cotidianos aportan a estas emisiones y cuáles podrías cambiar?" },
    { id: 4, cat: "aire", icon: "noise", term: "Contaminación acústica",
      def: "Exceso de sonido ambiental, producido por el tráfico, la industria o la construcción, que puede afectar la salud, el descanso y la vida de la fauna.",
      sit: "En las ciudades grandes el ruido constante se asocia con estrés y problemas de sueño, y en el mar el ruido de las embarcaciones puede desorientar a ballenas y delfines.",
      q: "¿En qué lugares de tu entorno el ruido te resulta molesto y por qué?" },

    { id: 5, cat: "agua", icon: "eutro", term: "Eutrofización",
      def: "Enriquecimiento excesivo de un cuerpo de agua con nutrientes, como nitrógeno y fósforo, que provoca un crecimiento descontrolado de algas.",
      sit: "Los fertilizantes y las aguas residuales que llegan a ríos, lagos y costas pueden crear zonas con muy poco oxígeno donde mueren peces y otros organismos.",
      q: "¿Cómo se conecta lo que se aplica en un cultivo con lo que ocurre en un río?" },
    { id: 6, cat: "agua", icon: "oil", term: "Derrame de petróleo",
      def: "Liberación accidental o ilegal de hidrocarburos en el mar o en tierra, que forma una capa que asfixia y contamina los ecosistemas.",
      sit: "El derrame de la plataforma Deepwater Horizon, en el golfo de México en 2010, es uno de los mayores de la historia y afectó costas, aves y especies marinas.",
      q: "¿Qué medidas de prevención y respuesta deberían exigirse a las empresas petroleras?" },
    { id: 7, cat: "agua", icon: "patch", term: "Gran Mancha de Basura del Pacífico",
      def: "Zona del océano Pacífico donde las corrientes concentran grandes cantidades de residuos plásticos flotantes y fragmentos.",
      sit: "No es una isla sólida: son plásticos de distintos tamaños dispersos en el agua, que dañan a tortugas, aves y peces que los confunden con alimento.",
      q: "¿Qué plásticos de un solo uso podrías reducir para que no terminen en el mar?" },
    { id: 8, cat: "agua", icon: "ocean", term: "Acidificación del océano",
      def: "Disminución gradual del pH del mar causada por la absorción del dióxido de carbono presente en la atmósfera.",
      sit: "Dificulta que corales, moluscos y otros organismos formen sus esqueletos y conchas, lo que amenaza arrecifes y cadenas alimentarias.",
      q: "¿Qué relación hay entre lo que se emite al aire y lo que le ocurre al mar?" },

    { id: 9, cat: "suelo", icon: "micro", term: "Microplásticos",
      def: "Fragmentos de plástico menores de 5 milímetros, que provienen de la degradación de objetos más grandes o de productos como cosméticos y fibras sintéticas.",
      sit: "Se han encontrado en el agua, el suelo, el aire y dentro de organismos vivos, desde zonas urbanas hasta regiones remotas.",
      q: "¿Por qué es tan difícil recuperar algo tan pequeño una vez que está en el ambiente?" },
    { id: 10, cat: "suelo", icon: "metal", term: "Metales pesados",
      def: "Elementos tóxicos, como el mercurio y el plomo, que persisten en el ambiente y se acumulan en los organismos a lo largo de la cadena alimentaria.",
      sit: "El uso de mercurio en la minería artesanal de oro contamina ríos en varios países, incluida Colombia, y afecta a los peces y a las comunidades que dependen de ellos.",
      q: "¿Qué alternativas permitirían una minería menos dañina para el agua y la salud?" },
    { id: 11, cat: "suelo", icon: "ewaste", term: "Residuos electrónicos",
      def: "Aparatos eléctricos y electrónicos desechados, como celulares, computadores y baterías, que contienen materiales valiosos y sustancias tóxicas.",
      sit: "Cuando se desechan sin control, se queman o se abandonan en vertederos, liberando sustancias como plomo y mercurio al aire, al suelo y al agua.",
      q: "¿Qué haces con un dispositivo viejo y dónde podría entregarse de forma segura?" },
    { id: 12, cat: "suelo", icon: "leach", term: "Lixiviados",
      def: "Líquido contaminado que se forma cuando el agua de lluvia atraviesa los residuos de un vertedero y arrastra sustancias tóxicas.",
      sit: "Si no se controla, puede filtrarse hasta el suelo y las aguas subterráneas, afectando las fuentes de agua de las comunidades cercanas.",
      q: "¿Qué diferencia hay entre un relleno sanitario bien manejado y un botadero a cielo abierto?" }
  ];
  const TOTAL = CARDS.length;
  const byId = (id) => CARDS.find((c) => c.id === id);

  /* ---------- Estado ---------- */
  let st;
  function freshState() {
    return {
      order: CARDS.map((c) => c.id),
      status: {},        // id -> "mastered" | "review"
      notes: {},         // id -> texto
      filter: "all",
      idx: 0,
      flipped: false,
      timer: null
    };
  }
  st = freshState();

  const flip = $("#flip");
  const deck = () => st.order.filter((id) => {
    const c = byId(id), s = st.status[id];
    if (st.filter === "all") return true;
    if (st.filter === "pending") return s !== "mastered";
    return c.cat === st.filter;
  });
  const currentId = () => deck()[st.idx];

  function show(name) {
    $$("[data-screen]").forEach((s) => { s.hidden = s.dataset.screen !== name; });
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  /* ---------- Intro: categorías ---------- */
  $("#introCats").innerHTML = Object.keys(CATS).map((k) => {
    const n = CARDS.filter((c) => c.cat === k).length;
    return `<article class="card">
      <div class="icon-dot">${ICONS[CATS[k].icon]}</div>
      <h3 class="card-title">${CATS[k].name}</h3>
      <p>${CATS[k].desc}</p>
      <p class="card-meta">${n} tarjetas</p>
    </article>`;
  }).join("");

  /* ---------- Filtros ---------- */
  const FILTERS = [
    ["all", "Todas"], ["aire", "Aire"], ["agua", "Agua"], ["suelo", "Suelo y residuos"], ["pending", "Por repasar"]
  ];
  function renderFilters() {
    $("#filters").innerHTML = FILTERS.map(([k, label]) =>
      `<button type="button" class="fchip" data-filter="${k}" aria-pressed="${st.filter === k}">${label}</button>`).join("");
  }

  /* ---------- Render ---------- */
  function renderCard() {
    const d = deck();
    if (!d.length) {
      $("#fCat").textContent = "Sin tarjetas";
      $("#fNum").textContent = "";
      $("#fIcon").innerHTML = ICONS.leaf;
      $("#fTerm").textContent = "¡No hay tarjetas pendientes!";
      $("#bTerm").textContent = "";
      $("#bDef").textContent = ""; $("#bSit").textContent = "";
      lockAnalysis(true, "Cambia de filtro para seguir estudiando.");
      $("#pos").textContent = "0 de 0";
      renderTiles();
      return;
    }
    if (st.idx >= d.length) st.idx = 0;
    const c = byId(d[st.idx]);
    $("#fCat").textContent = CATS[c.cat].short;
    $("#fNum").textContent = `N.º ${c.id}`;
    $("#fIcon").innerHTML = ICONS[c.icon];
    $("#fTerm").textContent = c.term;
    $("#bTerm").textContent = c.term;
    $("#bDef").textContent = c.def;
    $("#bSit").textContent = c.sit;
    $("#note").value = st.notes[c.id] || "";
    $("#pos").textContent = `${st.idx + 1} de ${d.length}`;
    flip.setAttribute("aria-label", `Tarjeta ${c.term}. Toca para voltear.`);
    setFlipped(false);
    renderTiles();
  }

  function lockAnalysis(locked, msg) {
    const box = $("#analysis");
    box.classList.toggle("is-locked", locked);
    ["#note", "#mastered", "#review"].forEach((s) => { $(s).disabled = locked; });
    if (msg) $("#aQ").textContent = msg;
  }

  function setFlipped(v) {
    st.flipped = v;
    flip.classList.toggle("is-flipped", v);
    flip.setAttribute("aria-pressed", String(v));
    $("#flipBtn").textContent = v ? "Ver el frente" : "Voltear tarjeta";
    const id = currentId();
    if (v && id) {
      lockAnalysis(false, byId(id).q);
    } else {
      lockAnalysis(true, id ? "Voltea la tarjeta para ver la pregunta de análisis." : undefined);
    }
  }

  function renderTiles() {
    const d = deck();
    $("#tiles").innerHTML = d.map((id, i) => {
      const s = st.status[id] || "new";
      return `<button type="button" class="tile tile--${s}${i === st.idx ? " is-current" : ""}" data-i="${i}" aria-label="Tarjeta ${id}: ${byId(id).term}" aria-current="${i === st.idx}">${id}</button>`;
    }).join("");
    const m = Object.values(st.status).filter((s) => s === "mastered").length;
    const pct = Math.round((m / TOTAL) * 100);
    $("#count").textContent = `${m}/${TOTAL}`;
    $("#deckCount").textContent = `${m} de ${TOTAL}`;
    $("#fill").style.width = pct + "%";
    $("#pct").textContent = pct + "%";
    $("#progressbar").setAttribute("aria-valuenow", pct);
  }

  /* ---------- Navegación ---------- */
  function goTo(i) {
    const n = deck().length;
    if (!n) return;
    const next = ((i % n) + n) % n;
    if (st.flipped) {
      setFlipped(false);
      clearTimeout(st.timer);
      st.timer = setTimeout(() => { st.idx = next; renderCard(); }, 320);
    } else {
      st.idx = next;
      renderCard();
    }
  }

  function toggleFlip() {
    if (!deck().length) return;
    setFlipped(!st.flipped);
  }

  function mark(status) {
    const id = currentId();
    if (!id) return;
    st.status[id] = status;
    st.notes[id] = $("#note").value.trim();
    renderTiles();
    const allSeen = CARDS.every((c) => st.status[c.id]);
    if (allSeen && status === "mastered" && CARDS.every((c) => st.status[c.id] === "mastered")) {
      setTimeout(showSummary, 500);
      return;
    }
    if (st.filter === "pending" && status === "mastered") {
      // la tarjeta sale del filtro: mantener el mismo índice
      clearTimeout(st.timer);
      setFlipped(false);
      st.timer = setTimeout(() => { renderCard(); }, 320);
      return;
    }
    goTo(st.idx + 1);
  }

  /* ---------- Resumen ---------- */
  function showSummary() {
    if (st.flipped) st.notes[currentId()] = $("#note").value.trim();
    const m = CARDS.filter((c) => st.status[c.id] === "mastered").length;
    const r = CARDS.filter((c) => st.status[c.id] === "review").length;
    const n = TOTAL - m - r;
    $("#sScore").textContent = `${m}/${TOTAL}`;
    let title, sub, text;
    if (m === TOTAL) {
      title = "¡Excelente análisis!";
      sub = "Dominas los conceptos de contaminación ambiental.";
      text = "Revisaste las 12 situaciones y las entiendes bien. Comparte tus conclusiones: entender las causas es el primer paso para cuidar el planeta.";
    } else if (m >= TOTAL / 2) {
      title = "¡Buen repaso!";
      sub = "Ya tienes una base sólida.";
      text = "Dominas gran parte de las tarjetas. Repasa las pendientes para completar el mazo y fortalecer tu análisis.";
    } else {
      title = "¡Vas empezando!";
      sub = "Cada tarjeta suma a tu comprensión.";
      text = "Todavía quedan situaciones por analizar. Voltea las tarjetas pendientes y escribe tus conclusiones para entender mejor cada problema.";
    }
    $("#sTitle").textContent = title;
    $("#sSub").textContent = sub;
    $("#sText").textContent = text;
    $("#pendingBtn").hidden = (r + n) === 0;

    $("#sCats").innerHTML = Object.keys(CATS).map((k) => {
      const list = CARDS.filter((c) => c.cat === k);
      const ok = list.filter((c) => st.status[c.id] === "mastered").length;
      return `<article class="card"><div class="stat-num">${ok}/${list.length}</div>
        <h3 class="card-title" style="margin-top:14px">${CATS[k].name}</h3>
        <p>tarjetas dominadas</p></article>`;
    }).join("");

    const withNotes = CARDS.filter((c) => st.notes[c.id]);
    $("#sNotes").innerHTML = withNotes.length
      ? withNotes.map((c) => `<article class="card note-card"><h3>${c.term}</h3><p class="note-q">${c.q}</p><p>${escapeHtml(st.notes[c.id])}</p></article>`).join("")
      : `<article class="card note-card"><h3>Aún no escribiste conclusiones</h3><p>Al estudiar cada tarjeta puedes responder la pregunta de análisis. Aquí aparecerán tus ideas.</p></article>`;
    show("summary");
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  /* ---------- Inicio y reinicio ---------- */
  function startStudy(filter = "all", reset = false) {
    if (reset) st = freshState();
    st.filter = filter;
    st.idx = 0;
    renderFilters();
    renderCard();
    show("study");
  }

  /* ---------- Eventos ---------- */
  flip.addEventListener("click", toggleFlip);
  flip.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleFlip(); }
  });
  $("#flipBtn").addEventListener("click", toggleFlip);
  $("#prev").addEventListener("click", () => goTo(st.idx - 1));
  $("#next").addEventListener("click", () => goTo(st.idx + 1));
  $("#mastered").addEventListener("click", () => mark("mastered"));
  $("#review").addEventListener("click", () => mark("review"));
  $("#note").addEventListener("input", () => { const id = currentId(); if (id) st.notes[id] = $("#note").value; });

  $("#shuffle").addEventListener("click", () => {
    for (let i = st.order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [st.order[i], st.order[j]] = [st.order[j], st.order[i]];
    }
    st.idx = 0;
    renderCard();
  });

  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest("[data-filter]");
    if (!b) return;
    st.filter = b.dataset.filter;
    st.idx = 0;
    renderFilters();
    renderCard();
  });

  $("#tiles").addEventListener("click", (e) => {
    const t = e.target.closest("[data-i]");
    if (t) goTo(Number(t.dataset.i));
  });

  document.addEventListener("keydown", (e) => {
    if ($("[data-screen='study']").hidden) return;
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "textarea" || tag === "input") return;
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(st.idx + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(st.idx - 1); }
    else if (e.key === " " && e.target === document.body) { e.preventDefault(); toggleFlip(); }
  });

  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-action]");
    if (!a) return;
    const act = a.dataset.action;
    if (act === "start") startStudy("all", true);
    else if (act === "again") startStudy("all", true);
    else if (act === "pending") startStudy("pending", false);
    else if (act === "summary") showSummary();
  });

  window.FlashTest = { state: () => st, CARDS };
})();
