(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Datos: canecas (código de colores de Colombia) ---------- */
  const BINS = [
    { id: "blanca", name: "Blanca", label: "BLANCA", sub: "Aprovechables",
      hint: "Plástico, vidrio, metal, papel y cartón limpios y secos",
      tip: "Enjuaga y seca los envases antes de depositarlos.",
      body: "#F6F6EE", lid: "#D5DABF", slot: "#2C3822", plate: "#BBC4A6" },
    { id: "verde", name: "Verde", label: "VERDE", sub: "Orgánicos",
      hint: "Restos de frutas, verduras, cáscaras y comida",
      tip: "Se descomponen y pueden convertirse en abono.",
      body: "#6D985E", lid: "#55804A", slot: "#2C3822", plate: "#F1F2E6" },
    { id: "negra", name: "Negra", label: "NEGRA", sub: "No aprovechables",
      hint: "Papel sucio o grasiento, higiénicos y empaques mezclados",
      tip: "Lo que no se puede reciclar ni compostar termina aquí.",
      body: "#3B4034", lid: "#2A2E25", slot: "#929F76", plate: "#F1F2E6" },
    { id: "roja", name: "Roja", label: "ROJA", sub: "Peligrosos",
      hint: "Pilas, bombillos, medicinas y residuos con químicos",
      tip: "Llévalos a puntos de recolección posconsumo.",
      body: "#B5604F", lid: "#944A3C", slot: "#2C3822", plate: "#F1F2E6" }
  ];

  /* ---------- Datos: residuos con ilustración vectorial ---------- */
  const ITEMS = [
    { id: "botella", name: "Botella de plástico", bin: "blanca",
      explain: "Los plásticos limpios y secos son aprovechables: van en la caneca blanca.",
      art: `<rect x="32" y="6" width="16" height="9" rx="3" fill="#2C3822"/>
        <path d="M34 15h12v8c0 4 10 7 10 16v29a6 6 0 0 1-6 6H30a6 6 0 0 1-6-6V39c0-9 10-12 10-16z" fill="#BFD9DC" stroke="#247A92" stroke-width="3" stroke-linejoin="round"/>
        <rect x="25.5" y="42" width="29" height="14" fill="#247A92"/>
        <path d="M31 28c-2 3-3 5-3 9" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".7" fill="none"/>` },
    { id: "banano", name: "Cáscara de banano", bin: "verde",
      explain: "Es un residuo orgánico: se descompone y puede convertirse en abono. Va en la caneca verde.",
      art: `<path d="M14 18C8 48 30 72 68 58C46 56 24 46 14 18Z" fill="#E3C95A" stroke="#8C7A2E" stroke-width="3" stroke-linejoin="round"/>
        <path d="M14 18l-3-9 6-2 3 9z" fill="#6B5B2A"/>
        <path d="M24 46c10 8 22 10 34 8" stroke="#8C7A2E" stroke-width="2.5" stroke-linecap="round" fill="none" opacity=".6"/>` },
    { id: "pila", name: "Pila usada", bin: "roja",
      explain: "Contiene metales pesados que contaminan el agua y el suelo. Es un residuo peligroso: caneca roja o punto de recolección.",
      art: `<rect x="32" y="6" width="16" height="9" rx="3" fill="#BBC4A6"/>
        <rect x="22" y="14" width="36" height="58" rx="8" fill="#2C3822"/>
        <rect x="22" y="30" width="36" height="22" fill="#6D985E"/>
        <path d="M40 35v12M34 41h12" stroke="#F1F2E6" stroke-width="3" stroke-linecap="round"/>
        <path d="M31 62h18" stroke="#BBC4A6" stroke-width="3" stroke-linecap="round"/>` },
    { id: "carton", name: "Caja de cartón", bin: "blanca",
      explain: "El cartón seco y limpio se recicla: va en la caneca blanca.",
      art: `<path d="M10 28L40 14l30 14-30 14z" fill="#D2A978"/>
        <path d="M10 28l30 14v30L10 58z" fill="#B98B5A"/>
        <path d="M70 28L40 42v30l30-14z" fill="#A87A4C"/>
        <path d="M32 17l30 14-10 5L22 22z" fill="#E8D6B0"/>` },
    { id: "servilleta", name: "Servilleta usada", bin: "negra",
      explain: "Con grasa o restos de comida no se puede reciclar: va en la caneca negra.",
      art: `<path d="M16 30L28 14l16 6 16-8 8 18-6 16 6 16-20 6-16-6-18 4-2-20z" fill="#FBFBF4" stroke="#929F76" stroke-width="3" stroke-linejoin="round"/>
        <path d="M28 14l6 22 10-16M60 12l-8 22 16-4M34 36l-4 26M52 34l-4 34" stroke="#BBC4A6" stroke-width="2" fill="none" stroke-linejoin="round"/>
        <circle cx="44" cy="46" r="7" fill="#C49A6C" opacity=".7"/>` },
    { id: "lata", name: "Lata de atún", bin: "blanca",
      explain: "Los metales como el acero y el aluminio se reciclan: caneca blanca.",
      art: `<rect x="14" y="26" width="52" height="38" rx="7" fill="#C9CDC0" stroke="#929F76" stroke-width="2.5"/>
        <rect x="14" y="36" width="52" height="20" fill="#6D985E"/>
        <ellipse cx="40" cy="26" rx="26" ry="7" fill="#E4E7DA" stroke="#929F76" stroke-width="2.5"/>
        <path d="M30 46q8-8 16 0-8 8-16 0zM46 46l6-5v10z" fill="#F1F2E6"/>` },
    { id: "manzana", name: "Corazón de manzana", bin: "verde",
      explain: "Los restos de fruta son orgánicos: caneca verde.",
      art: `<path d="M20 14Q40 6 60 14Q52 26 50 40Q52 54 60 66Q40 74 20 66Q28 54 30 40Q28 26 20 14Z" fill="#E9E3B4" stroke="#B5584A" stroke-width="3" stroke-linejoin="round"/>
        <ellipse cx="40" cy="35" rx="3" ry="5" fill="#2C3822"/><ellipse cx="40" cy="48" rx="3" ry="5" fill="#2C3822"/>
        <path d="M40 12Q42 5 49 3" stroke="#6B5B2A" stroke-width="3" stroke-linecap="round" fill="none"/>` },
    { id: "bombillo", name: "Bombillo ahorrador", bin: "roja",
      explain: "Los bombillos ahorradores contienen mercurio: son residuos peligrosos, caneca roja.",
      art: `<path d="M40 8a22 22 0 0 0-12 40c3 2 4 5 4 8h16c0-3 1-6 4-8A22 22 0 0 0 40 8z" fill="#F4EBB0" stroke="#2C3822" stroke-width="3" stroke-linejoin="round"/>
        <path d="M33 34l7 9 7-9" stroke="#B5604F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <rect x="31" y="58" width="18" height="6" rx="2" fill="#929F76"/>
        <rect x="33" y="65" width="14" height="7" rx="3.5" fill="#2C3822"/>` },
    { id: "snack", name: "Empaque de snack", bin: "negra",
      explain: "Los empaques metalizados mezclan plástico y aluminio y no se reciclan fácilmente: caneca negra.",
      art: `<path d="M16 12l6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6V62l-6 6-6-6-6 6-6-6-6 6-6-6-6 6-6-6z" fill="#6D985E" stroke="#2C3822" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="40" cy="40" r="12" fill="#F1F2E6"/>
        <path d="M34 40h12" stroke="#6D985E" stroke-width="3" stroke-linecap="round"/>` },
    { id: "frasco", name: "Frasco de vidrio", bin: "blanca",
      explain: "El vidrio se puede reciclar muchas veces: caneca blanca. Enjuágalo antes.",
      art: `<rect x="26" y="8" width="28" height="10" rx="3" fill="#2C3822"/>
        <path d="M28 18h24c4 4 8 8 8 16v30a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6V34c0-8 4-12 8-16z" fill="#CFE3DC" stroke="#247A92" stroke-width="3" stroke-linejoin="round"/>
        <path d="M28 34c-2 4-2 9-2 15" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8" fill="none"/>
        <path d="M22 52c6-3 10 3 18 0s12 3 18 0" stroke="#247A92" stroke-width="2.5" stroke-linecap="round" fill="none" opacity=".6"/>` }
  ];

  const ICONS = {
    hand: `<svg viewBox="0 0 32 32" fill="none"><path d="M16 5v16M9 14l7 7 7-7" stroke="#F1F2E6" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 27h18" stroke="#BBC4A6" stroke-width="3.2" stroke-linecap="round"/></svg>`,
    ok: `<svg viewBox="0 0 32 32" fill="none"><path d="M7 17l6 6 12-13" stroke="#F1F2E6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    bad: `<svg viewBox="0 0 32 32" fill="none"><path d="M9 9l14 14M23 9L9 23" stroke="#F1F2E6" stroke-width="4" stroke-linecap="round"/></svg>`,
    down: `<svg viewBox="0 0 16 16" fill="none"><path d="M8 2v10M3.5 8L8 12.5 12.5 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  };

  /* ---------- Ilustración frontal de la caneca ---------- */
  function binSVG(b) {
    const small = b.sub.length > 14 ? 8.2 : 9.5;
    return `<svg class="bin__art" viewBox="0 0 160 200" aria-hidden="true" focusable="false">
      <circle cx="48" cy="188" r="8" fill="#2C3822"/><circle cx="112" cy="188" r="8" fill="#2C3822"/>
      <rect x="58" y="6" width="44" height="16" rx="8" fill="${b.lid}"/>
      <rect x="12" y="18" width="136" height="26" rx="13" fill="${b.lid}"/>
      <rect x="34" y="27" width="92" height="8" rx="4" fill="${b.slot}"/>
      <path d="M22 46h116l-9 124a10 10 0 0 1-10 9H41a10 10 0 0 1-10-9z" fill="${b.body}" ${b.id === "blanca" ? 'stroke="#BBC4A6" stroke-width="2"' : ""}/>
      <path d="M46 56l4 112M80 56v112M114 56l-4 112" stroke="#2C3822" stroke-width="3" stroke-linecap="round" opacity=".12"/>
      <rect x="32" y="88" width="96" height="58" rx="14" fill="${b.plate}"/>
      <text x="80" y="113" text-anchor="middle" font-size="16" font-weight="800" fill="#2C3822" letter-spacing=".6">${b.label}</text>
      <text x="80" y="130" text-anchor="middle" font-size="${small}" font-weight="600" fill="#2C3822">${b.sub}</text>
    </svg>`;
  }

  /* ---------- Estado ---------- */
  const total = ITEMS.length;
  let state;

  function freshState() {
    return { done: new Set(), tries: {}, firstTry: 0, errors: 0, selected: null };
  }

  const shuffle = (a) => {
    const r = [...a];
    for (let i = r.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
  };

  const itemById = (id) => ITEMS.find((i) => i.id === id);
  const binById = (id) => BINS.find((b) => b.id === id);

  /* ---------- Pantallas ---------- */
  function show(name) {
    $$("[data-screen]").forEach((s) => { s.hidden = s.dataset.screen !== name; });
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  /* ---------- Intro: canecas decorativas ---------- */
  $("#miniBins").innerHTML = BINS.map(binSVG).join("");

  /* ---------- Juego ---------- */
  function startGame() {
    state = freshState();

    $("#bins").innerHTML = BINS.map((b) => `
      <div class="bin" data-bin="${b.id}" tabindex="0" role="button"
           aria-label="Caneca ${b.name}, ${b.sub}. ${b.hint}">
        ${binSVG(b)}
        <h3 class="bin__name">Caneca ${b.name}</h3>
        <p class="bin__hint">${b.hint}</p>
        <div class="bin__drop">
          <span class="bin__placeholder">${ICONS.down}Suelta aquí</span>
          <div class="bin__chips"></div>
        </div>
      </div>`).join("");

    $("#items").innerHTML = shuffle(ITEMS).map((it) => `
      <div class="item" data-item="${it.id}" tabindex="0" role="button" aria-label="${it.name}">
        <svg class="item__art" viewBox="0 0 80 80" aria-hidden="true" focusable="false">${it.art}</svg>
        <div class="item__name">${it.name}</div>
      </div>`).join("");

    $$(".item").forEach(bindItem);
    $$(".bin").forEach(bindBin);

    updateStats();
    feedback("idle", "Empieza a clasificar",
      "Arrastra un residuo hasta su caneca. Si prefieres, toca el residuo y luego la caneca.");
    show("game");
  }

  function updateStats() {
    $("#statDone").textContent = `${state.done.size}/${total}`;
    $("#statErrors").textContent = state.errors;
  }

  function feedback(kind, title, text, withAction = false) {
    const box = $("#feedback");
    box.classList.remove("is-ok", "is-bad");
    void box.offsetWidth; // reinicia la animación
    if (kind === "ok") box.classList.add("is-ok");
    if (kind === "bad") box.classList.add("is-bad");
    $("#fbIcon").innerHTML = kind === "ok" ? ICONS.ok : kind === "bad" ? ICONS.bad : ICONS.hand;
    $("#fbTitle").textContent = title;
    $("#fbText").textContent = text;
    $("#fbAction").hidden = !withAction;
  }

  function clearSelection() {
    state.selected = null;
    $$(".item.is-selected").forEach((e) => e.classList.remove("is-selected"));
    $$(".bin.is-armed").forEach((e) => e.classList.remove("is-armed"));
  }

  function place(itemId, binId) {
    const it = itemById(itemId);
    const bin = binById(binId);
    const el = $(`.item[data-item="${itemId}"]`);
    const binEl = $(`.bin[data-bin="${binId}"]`);
    state.tries[itemId] = (state.tries[itemId] || 0) + 1;
    clearSelection();

    if (it.bin === binId) {
      if (state.tries[itemId] === 1) state.firstTry++;
      state.done.add(itemId);
      el.classList.add("is-done");
      el.setAttribute("aria-hidden", "true");
      el.tabIndex = -1;

      const chip = document.createElement("span");
      chip.className = "chip";
      chip.title = it.name;
      chip.innerHTML = `<svg viewBox="0 0 80 80" aria-hidden="true">${it.art}</svg>`;
      $(".bin__chips", binEl).appendChild(chip);
      $(".bin__placeholder", binEl).hidden = true;

      binEl.classList.remove("is-pulse");
      void binEl.offsetWidth;
      binEl.classList.add("is-pulse");

      updateStats();
      if (state.done.size === total) {
        feedback("ok", "¡Clasificaste todos los residuos!",
          `${it.name}: ${it.explain} Ya puedes ver cómo te fue.`, true);
      } else {
        feedback("ok", `¡Correcto! ${it.name} va en la caneca ${bin.name}`, it.explain);
      }
    } else {
      state.errors++;
      el.classList.remove("is-shake");
      void el.offsetWidth;
      el.classList.add("is-shake");
      updateStats();
      if (state.tries[itemId] >= 2) {
        feedback("bad", `Todavía no: ${it.name} no va en la caneca ${bin.name}`, it.explain);
      } else {
        feedback("bad", `Esa no es: ${it.name} no va en la caneca ${bin.name}`,
          "Lee las pistas de cada caneca e inténtalo de nuevo.");
      }
    }
  }

  /* ---------- Interacción: arrastrar (ratón y tacto) o tocar ---------- */
  let drag = null;

  function bindItem(el) {
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleSelect(el); }
    });
  }

  function bindBin(el) {
    el.addEventListener("click", () => {
      if (state.selected) place(state.selected, el.dataset.bin);
      else feedback("idle", "Primero elige un residuo", "Arrastra un residuo hasta esta caneca o tócalo para seleccionarlo.");
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.click(); }
    });
  }

  function toggleSelect(el) {
    if (el.classList.contains("is-done")) return;
    const id = el.dataset.item;
    const was = state.selected === id;
    clearSelection();
    if (was) return;
    state.selected = id;
    el.classList.add("is-selected");
    $$(".bin").forEach((b) => b.classList.add("is-armed"));
    feedback("idle", `Elegiste: ${itemById(id).name}`, "Ahora toca la caneca donde crees que va.");
  }

  function onDown(e) {
    if (e.button > 0) return;
    const el = e.currentTarget;
    if (el.classList.contains("is-done")) return;
    const r = el.getBoundingClientRect();
    drag = {
      el, id: el.dataset.item, pid: e.pointerId,
      sx: e.clientX, sy: e.clientY,
      ox: e.clientX - r.left, oy: e.clientY - r.top,
      w: r.width, moved: false, ghost: null, over: null
    };
    el.setPointerCapture(e.pointerId);
  }

  function onMove(e) {
    if (!drag || e.pointerId !== drag.pid) return;
    if (!drag.moved) {
      if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 6) return;
      drag.moved = true;
      document.body.classList.add("is-dragging");
      clearSelection();
      const g = drag.el.cloneNode(true);
      g.removeAttribute("data-item");
      g.removeAttribute("tabindex");
      g.classList.add("ghost");
      g.style.width = drag.w + "px";
      document.body.appendChild(g);
      drag.ghost = g;
      drag.el.classList.add("is-source");
    }
    drag.ghost.style.transform =
      `translate(${e.clientX - drag.ox}px, ${e.clientY - drag.oy}px) scale(1.07) rotate(-2.5deg)`;

    const target = document.elementFromPoint(e.clientX, e.clientY);
    const bin = target ? target.closest(".bin") : null;
    if (bin !== drag.over) {
      if (drag.over) drag.over.classList.remove("is-over");
      if (bin) bin.classList.add("is-over");
      drag.over = bin;
    }
  }

  function onUp(e) {
    if (!drag || e.pointerId !== drag.pid) return;
    const d = drag;
    const binEl = d.over;
    endDrag();
    if (!d.moved) { toggleSelect(d.el); return; }
    if (binEl) place(d.id, binEl.dataset.bin);
    else feedback("idle", "Suelta el residuo sobre una caneca", "Llévalo hasta la zona punteada de la caneca que elijas.");
  }

  function endDrag() {
    if (!drag) return;
    document.body.classList.remove("is-dragging");
    if (drag.ghost) drag.ghost.remove();
    if (drag.over) drag.over.classList.remove("is-over");
    drag.el.classList.remove("is-source");
    try { drag.el.releasePointerCapture(drag.pid); } catch (_) {}
    drag = null;
  }

  /* ---------- Resultados ---------- */
  function showResults() {
    const pct = Math.round((state.firstTry / total) * 100);
    let title, sub, text;
    if (state.firstTry >= total - 1) {
      title = "¡Excelente clasificación!";
      sub = "Ya separas los residuos como un experto.";
      text = "Dominas el código de colores de las canecas. Compártelo en casa y en tu colegio: separar en la fuente hace más fácil reciclar y cuida el planeta.";
    } else if (state.firstTry >= Math.ceil(total * 0.6)) {
      title = "¡Buen trabajo!";
      sub = "Vas por muy buen camino.";
      text = "Acertaste varios residuos a la primera. Repasa las ideas de abajo y vuelve a intentarlo para llegar al máximo.";
    } else {
      title = "¡Sigue practicando!";
      sub = "Equivocarse también enseña.";
      text = "Clasificar bien requiere práctica. Repasa las pistas de cada caneca y juega de nuevo: verás cómo mejoras en cada intento.";
    }
    $("#resTitle").textContent = title;
    $("#resSub").textContent = sub;
    $("#resText").textContent = text;
    $("#resScore").textContent = `${state.firstTry}/${total}`;
    $("#resFirst").textContent = state.firstTry;
    $("#resErrors").textContent = state.errors;
    $("#resPct").textContent = pct + "%";

    $("#recap").innerHTML = BINS.map((b) => `
      <article class="bin bin--static">
        ${binSVG(b)}
        <h3 class="bin__name">Caneca ${b.name}</h3>
        <p class="bin__hint">${b.hint}</p>
        <p class="bin__hint" style="font-weight:600">${b.tip}</p>
      </article>`).join("");

    show("results");
  }

  /* ---------- Acciones ---------- */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-action]");
    if (!a) return;
    const act = a.dataset.action;
    if (act === "start") startGame();
    else if (act === "home") show("intro");
    else if (act === "results") showResults();
  });
})();
