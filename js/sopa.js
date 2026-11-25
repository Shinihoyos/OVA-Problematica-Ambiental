(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const SIZE = 16;

  /* ---------- Conceptos (palabras sin tildes en la cuadrícula) ---------- */
  const CONCEPTS = [
    { id: 1,  word: "BIODIVERSIDAD",  label: "Biodiversidad",  def: "Variedad de seres vivos, especies y ecosistemas que existen en un determinado lugar o en todo el planeta." },
    { id: 2,  word: "DEFORESTACION",  label: "Deforestación",  def: "Proceso de eliminación o pérdida de bosques y superficies forestales, generalmente por actividades humanas." },
    { id: 3,  word: "ECOSISTEMA",     label: "Ecosistema",     def: "Conjunto de organismos vivos que interactúan entre sí y con los elementos físicos de su entorno." },
    { id: 4,  word: "CONTAMINACION",  label: "Contaminación",  def: "Introducción de sustancias o agentes que alteran las condiciones naturales del ambiente y afectan a los seres vivos." },
    { id: 5,  word: "RECICLAJE",      label: "Reciclaje",      def: "Proceso mediante el cual determinados materiales recuperados se transforman para fabricar nuevos productos." },
    { id: 6,  word: "SOSTENIBILIDAD", label: "Sostenibilidad", def: "Forma de satisfacer las necesidades actuales sin comprometer la capacidad de las futuras generaciones para satisfacer las suyas." },
    { id: 7,  word: "REFORESTACION",  label: "Reforestación",  def: "Acción de recuperar la cobertura vegetal mediante la plantación de árboles en zonas donde se han perdido los bosques." },
    { id: 8,  word: "BIOMA",          label: "Bioma",          def: "Gran región ecológica caracterizada por condiciones climáticas, vegetación y comunidades de organismos particulares." },
    { id: 9,  word: "EROSION",        label: "Erosión",        def: "Desgaste y transporte del suelo o las rocas por acción del agua, el viento u otros agentes naturales." },
    { id: 10, word: "DESERTIFICACION",label: "Desertificación",def: "Degradación de las tierras en zonas áridas, semiáridas y subhúmedas secas, asociada a variaciones climáticas y actividades humanas." },
    { id: 11, word: "BIOMASA",        label: "Biomasa",        def: "Cantidad total de materia orgánica de origen biológico presente en un área o utilizada como recurso energético." },
    { id: 12, word: "ECOTURISMO",     label: "Ecoturismo",     def: "Modalidad de turismo responsable que promueve la conservación de la naturaleza y el respeto por las comunidades locales." }
  ];
  const TOTAL = CONCEPTS.length;

  /* Ocho direcciones [fila, columna]. Las 4 primeras se leen de izquierda a derecha
     o de arriba abajo; las 4 últimas son sentidos inversos. */
  const DIRS = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]];
  const REVERSED = (d) => DIRS.indexOf(d) >= 4;

  const rnd = (n) => Math.floor(Math.random() * n);
  const key = (r, c) => r * SIZE + c;
  const inside = (r, c) => r >= 0 && r < SIZE && c >= 0 && c < SIZE;

  /* ---------- Generador de cuadrícula ---------- */
  function tryPlace(grid, word) {
    for (let t = 0; t < 400; t++) {
      const dir = DIRS[rnd(DIRS.length)];
      const r0 = rnd(SIZE), c0 = rnd(SIZE);
      const rEnd = r0 + dir[0] * (word.length - 1);
      const cEnd = c0 + dir[1] * (word.length - 1);
      if (!inside(rEnd, cEnd)) continue;
      const cells = [];
      let ok = true;
      for (let i = 0; i < word.length; i++) {
        const r = r0 + dir[0] * i, c = c0 + dir[1] * i;
        const cur = grid[r][c];
        if (cur !== "" && cur !== word[i]) { ok = false; break; }
        cells.push([r, c]);
      }
      if (!ok) continue;
      cells.forEach(([r, c], i) => { grid[r][c] = word[i]; });
      return { cells, dir };
    }
    return null;
  }

  const FILL_POOL = "AAAAAEEEEEIIIIOOOOOSSSSRRRNNNLLLCCCDDDTTTUUMMPPBBGGVQFHJKXYZ";
  const WORD_LETTERS = CONCEPTS.map((c) => c.word).join("");

  function fillGrid(grid) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] === "") {
          grid[r][c] = Math.random() < 0.45
            ? WORD_LETTERS[rnd(WORD_LETTERS.length)]
            : FILL_POOL[rnd(FILL_POOL.length)];
        }
      }
    }
  }

  /* Busca todas las apariciones de una palabra (en las 8 direcciones). */
  function occurrences(grid, word) {
    const found = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] !== word[0]) continue;
        for (const d of DIRS) {
          const re = r + d[0] * (word.length - 1), ce = c + d[1] * (word.length - 1);
          if (!inside(re, ce)) continue;
          let ok = true;
          for (let i = 1; i < word.length; i++) {
            if (grid[r + d[0] * i][c + d[1] * i] !== word[i]) { ok = false; break; }
          }
          if (ok) found.push(Array.from({ length: word.length }, (_, i) => key(r + d[0] * i, c + d[1] * i)));
        }
      }
    }
    return found;
  }

  /* Comprueba que las 12 palabras se pueden encontrar y que no hay apariciones accidentales. */
  function verify(grid, placed) {
    const placedSets = placed.map((p) => new Set(p.cells.map(([r, c]) => key(r, c))));
    for (let k = 0; k < placed.length; k++) {
      const occ = occurrences(grid, placed[k].word);
      let hasOwn = false;
      for (const cells of occ) {
        const sameAsOwn = cells.length === placedSets[k].size && cells.every((x) => placedSets[k].has(x));
        if (sameAsOwn) { hasOwn = true; continue; }
        // Permitido solo si queda contenida en otra palabra colocada (p. ej. BIOMA dentro de BIOMASA)
        const embedded = placedSets.some((s, j) => j !== k && cells.every((x) => s.has(x)));
        if (!embedded) return false;
      }
      if (!hasOwn) return false;
    }
    return true;
  }

  function generate() {
    const order = [...CONCEPTS].sort((a, b) => b.word.length - a.word.length);
    for (let attempt = 0; attempt < 800; attempt++) {
      const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(""));
      const placed = [];
      let ok = true;
      for (const c of order) {
        const p = tryPlace(grid, c.word);
        if (!p) { ok = false; break; }
        placed.push({ id: c.id, word: c.word, cells: p.cells, dir: p.dir });
      }
      if (!ok) continue;

      // Variedad: dificultad intermedia-alta
      const diag = placed.filter((p) => p.dir[0] !== 0 && p.dir[1] !== 0).length;
      const horiz = placed.filter((p) => p.dir[0] === 0).length;
      const vert = placed.filter((p) => p.dir[1] === 0).length;
      const rev = placed.filter((p) => REVERSED(p.dir)).length;
      if (diag < 3 || horiz < 2 || vert < 2 || rev < 3) continue;

      fillGrid(grid);
      if (!verify(grid, placed)) continue;
      return { grid, placed };
    }
    throw new Error("No se pudo generar una cuadrícula válida");
  }

  /* Exposición mínima para pruebas automáticas */
  window.SopaTest = { generate, verify, occurrences, CONCEPTS, SIZE };

  /* ---------- Estado ---------- */
  let game = null;
  let timer = null;
  window.SopaTest.state = () => game;

  const lettersEl = $("#letters");
  let cellEls = [];

  const ICON = {
    hand: `<svg viewBox="0 0 32 32" fill="none"><circle cx="14" cy="14" r="7" stroke="#F1F2E6" stroke-width="3.2"/><path d="M19.5 19.5L26 26" stroke="#BBC4A6" stroke-width="3.6" stroke-linecap="round"/></svg>`,
    ok: `<svg viewBox="0 0 32 32" fill="none"><path d="M7 17l6 6 12-13" stroke="#F1F2E6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    bad: `<svg viewBox="0 0 32 32" fill="none"><path d="M9 9l14 14M23 9L9 23" stroke="#F1F2E6" stroke-width="4" stroke-linecap="round"/></svg>`
  };

  function show(name) {
    $$("[data-screen]").forEach((s) => { s.hidden = s.dataset.screen !== name; });
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  /* ---------- Nueva partida ---------- */
  function newGame() {
    const { grid, placed } = generate();
    game = {
      grid, placed,
      found: new Set(),          // ids de conceptos encontrados
      foundCells: new Set(),     // celdas resaltadas de forma permanente
      wrong: 0,
      start: Date.now(),
      elapsed: 0,
      sel: null,
      done: false
    };

    lettersEl.innerHTML = "";
    cellEls = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const d = document.createElement("div");
        d.className = "cell";
        d.textContent = grid[r][c];
        lettersEl.appendChild(d);
        cellEls.push(d);
      }
    }

    $("#clues").innerHTML = CONCEPTS.map((c) => `
      <li class="clue" data-id="${c.id}">
        <span class="clue__num">${c.id}</span>
        <p class="clue__def">${c.def}</p>
        <p class="clue__status">Pendiente</p>
      </li>`).join("");

    $("#howto").hidden = true;
    $("#howtoBtn").setAttribute("aria-expanded", "false");
    updateProgress();
    setFeedback("idle", "Encuentra el primer concepto",
      "Lee una pista, deduce el concepto y arrastra sobre sus letras para marcarlo.");

    clearInterval(timer);
    $("#time").textContent = "00:00";
    timer = setInterval(() => {
      if (!game || game.done) return;
      game.elapsed = Math.floor((Date.now() - game.start) / 1000);
      $("#time").textContent = fmtTime(game.elapsed);
    }, 1000);

    show("game");
  }

  function updateProgress() {
    const n = game.found.size;
    const pct = Math.round((n / TOTAL) * 100);
    $("#count").textContent = `${n}/${TOTAL}`;
    $("#cluesCount").textContent = `${n} de ${TOTAL}`;
    $("#fill").style.width = pct + "%";
    $("#pct").textContent = pct + "%";
    $("#progressbar").setAttribute("aria-valuenow", pct);
  }

  function setFeedback(kind, title, text) {
    const box = $("#feedback");
    box.classList.remove("is-ok", "is-bad");
    void box.offsetWidth;
    if (kind === "ok") box.classList.add("is-ok");
    if (kind === "bad") box.classList.add("is-bad");
    $("#fbIcon").innerHTML = kind === "ok" ? ICON.ok : kind === "bad" ? ICON.bad : ICON.hand;
    $("#fbTitle").textContent = title;
    $("#fbText").textContent = text;
  }

  /* ---------- Selección por arrastre (mouse y táctil) ---------- */
  function cellFromPoint(e) {
    const a = cellEls[0].getBoundingClientRect();
    const z = cellEls[cellEls.length - 1].getBoundingClientRect();
    const stepX = (z.left - a.left) / (SIZE - 1);
    const stepY = (z.top - a.top) / (SIZE - 1);
    const gapX = stepX - a.width, gapY = stepY - a.height;
    const c = Math.floor((e.clientX - a.left + gapX / 2) / stepX);
    const r = Math.floor((e.clientY - a.top + gapY / 2) / stepY);
    return { r: Math.min(SIZE - 1, Math.max(0, r)), c: Math.min(SIZE - 1, Math.max(0, c)) };
  }

  /* Ajusta el arrastre a la línea recta más cercana (8 direcciones). */
  function snapLine(r0, c0, r, c) {
    const dr = r - r0, dc = c - c0;
    if (dr === 0 && dc === 0) return [[r0, c0]];
    const idx = Math.round(Math.atan2(dr, dc) / (Math.PI / 4));
    const sr = Math.round(Math.sin(idx * Math.PI / 4));
    const sc = Math.round(Math.cos(idx * Math.PI / 4));
    let n = Math.max(0, Math.round((dr * sr + dc * sc) / (sr * sr + sc * sc)));
    while (n > 0 && !inside(r0 + sr * n, c0 + sc * n)) n--;
    return Array.from({ length: n + 1 }, (_, i) => [r0 + sr * i, c0 + sc * i]);
  }

  function paintSelection(cells) {
    if (game.sel && game.sel.painted) game.sel.painted.forEach((i) => cellEls[i].classList.remove("is-sel"));
    const idx = cells.map(([r, c]) => key(r, c));
    idx.forEach((i) => cellEls[i].classList.add("is-sel"));
    game.sel.painted = idx;
    game.sel.cells = cells;
  }

  function clearSelection() {
    if (game && game.sel && game.sel.painted) game.sel.painted.forEach((i) => cellEls[i].classList.remove("is-sel"));
    if (game) game.sel = null;
  }

  lettersEl.addEventListener("pointerdown", (e) => {
    if (!game || game.done || e.button > 0) return;
    e.preventDefault();
    const { r, c } = cellFromPoint(e);
    lettersEl.setPointerCapture(e.pointerId);
    game.sel = { r0: r, c0: c, pid: e.pointerId, cells: [], painted: [] };
    paintSelection([[r, c]]);
  });

  lettersEl.addEventListener("pointermove", (e) => {
    if (!game || !game.sel || e.pointerId !== game.sel.pid) return;
    const { r, c } = cellFromPoint(e);
    paintSelection(snapLine(game.sel.r0, game.sel.c0, r, c));
  });

  lettersEl.addEventListener("pointerup", (e) => {
    if (!game || !game.sel || e.pointerId !== game.sel.pid) return;
    const cells = game.sel.cells;
    clearSelection();
    if (cells.length >= 2) evaluate(cells);
  });

  lettersEl.addEventListener("pointercancel", () => clearSelection());
  lettersEl.addEventListener("contextmenu", (e) => e.preventDefault());

  /* ---------- Evaluación ---------- */
  function evaluate(cells) {
    const word = cells.map(([r, c]) => game.grid[r][c]).join("");
    const back = [...word].reverse().join("");
    const hit = CONCEPTS.find((c) => c.word === word || c.word === back);

    if (hit && !game.found.has(hit.id)) {
      markFound(hit, cells);
      return;
    }
    if (hit && game.found.has(hit.id)) {
      setFeedback("idle", "Ese concepto ya lo habías encontrado", "Busca otra pista que todavía esté pendiente.");
      return;
    }
    game.wrong++;
    cells.forEach(([r, c]) => {
      const el = cellEls[key(r, c)];
      el.classList.remove("is-shake");
      void el.offsetWidth;
      el.classList.add("is-shake");
      setTimeout(() => el.classList.remove("is-shake"), 450);
    });
    setFeedback("bad", "Esta combinación no corresponde a ningún concepto. Inténtalo nuevamente", "Revisa la definición y vuelve a buscar con calma.");
  }

  function markFound(concept, cells) {
    game.found.add(concept.id);
    cells.forEach(([r, c], i) => {
      const k = key(r, c);
      game.foundCells.add(k);
      const el = cellEls[k];
      el.classList.add("is-found", "is-pop");
      el.style.animationDelay = `${i * 40}ms`;
      setTimeout(() => { el.classList.remove("is-pop"); el.style.animationDelay = ""; }, 600 + i * 40);
    });

    const clue = $(`.clue[data-id="${concept.id}"]`);
    clue.classList.add("is-found");
    $(".clue__status", clue).textContent = concept.label;

    updateProgress();

    if (game.found.size === TOTAL) {
      game.done = true;
      game.elapsed = Math.floor((Date.now() - game.start) / 1000);
      clearInterval(timer);
      setFeedback("ok", "¡Correcto! Has identificado el concepto", `${concept.label}. ¡Encontraste los ${TOTAL} conceptos!`);
      setTimeout(showFinal, 1700);
    } else {
      setFeedback("ok", "¡Correcto! Has identificado el concepto", `${concept.label}: te faltan ${TOTAL - game.found.size}.`);
    }
  }

  /* ---------- Pantalla final ---------- */
  function computeScore() {
    // Base 100; cada intento fallido resta 3 (máx. 30) y cada 2 min sobre los 10 restan 3 (máx. 12). Mínimo 55.
    const wrongPenalty = Math.min(30, game.wrong * 3);
    const timePenalty = Math.min(12, Math.floor(Math.max(0, game.elapsed - 600) / 120) * 3);
    return Math.max(55, 100 - wrongPenalty - timePenalty);
  }

  function showFinal() {
    const score = computeScore();
    let sub, text;
    if (score >= 90) {
      sub = "Excelente: dominas el vocabulario ambiental.";
      text = "Interpretaste cada definición y encontraste los conceptos casi sin errores. Ya puedes explicar estas ideas con tus propias palabras.";
    } else if (score >= 75) {
      sub = "Muy buen trabajo: comprendes las ideas clave.";
      text = "Encontraste todos los conceptos. Repásalos para afianzar los que te costaron más y mejora tu puntuación en otra partida.";
    } else {
      sub = "Lo lograste: sigue fortaleciendo tu vocabulario.";
      text = "Completaste el reto, y eso es lo importante. Repasa las definiciones y vuelve a intentarlo para encontrar los conceptos con más seguridad.";
    }
    $("#finalSub").textContent = sub;
    $("#finalText").textContent = text;
    $("#fScore").textContent = score;
    $("#fPct").textContent = "100%";
    $("#fPctText").textContent = `${TOTAL} de ${TOTAL} conceptos ambientales.`;
    $("#fTime").textContent = fmtTime(game.elapsed);
    $("#fWrong").textContent = game.wrong;
    show("final");
  }

  /* ---------- Repaso ---------- */
  function showReview() {
    $("#reviewList").innerHTML = CONCEPTS.map((c) => `
      <article class="card review-card">
        <h3><i>${c.id}</i>${c.label}</h3>
        <p>${c.def}</p>
      </article>`).join("");
    show("review");
  }

  /* ---------- Acciones ---------- */
  $("#howtoBtn").addEventListener("click", () => {
    const box = $("#howto");
    box.hidden = !box.hidden;
    $("#howtoBtn").setAttribute("aria-expanded", String(!box.hidden));
  });

  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-action]");
    if (!a) return;
    const act = a.dataset.action;
    if (act === "start" || act === "retry") newGame();
    else if (act === "review") showReview();
    else if (act === "final") show("final");
  });
})();
