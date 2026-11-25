/* =========================================================
   La huella de mi entorno — lógica local (sin APIs ni conexión)
   Índice: 0 (impacto mínimo) a 100 (impacto máximo).
   Es una estimación educativa, no una medición científica oficial.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------- Datos ---------------- */

  const CATEGORIES = [
    {
      id: 'transporte', name: 'Transporte', icon: 'i-bus',
      msg: {
        bajo: 'Te mueves de forma ligera y tu entorno ofrece buenas alternativas.',
        moderado: 'Combinas opciones sostenibles con otras que generan emisiones y congestión.',
        alto: 'El transporte pesa bastante: hay mucho vehículo particular, congestión o pocas alternativas.'
      },
      ok: 'Tus respuestas muestran una movilidad sostenible. Anima a tu familia y compañeros a moverse así.'
    },
    {
      id: 'residuos', name: 'Residuos', icon: 'i-bin',
      msg: {
        bajo: 'Separas y manejas bien tus residuos, y la recolección funciona.',
        moderado: 'Tienes buenos hábitos, pero aún queda residuo que se puede evitar o aprovechar.',
        alto: 'Se generan y acumulan muchos residuos que no se aprovechan.'
      },
      ok: 'Manejas bien tus residuos. Comparte tu sistema de separación con vecinos y compañeros.'
    },
    {
      id: 'agua', name: 'Agua', icon: 'i-drop',
      msg: {
        bajo: 'Cuidas el agua y tus fuentes cercanas están en buen estado.',
        moderado: 'Hay prácticas de ahorro, pero también consumo o contaminación por mejorar.',
        alto: 'Hay alto consumo o fuentes de agua deterioradas que necesitan atención.'
      },
      ok: 'Haces un uso cuidadoso del agua. Mantén esos hábitos y cuida las fuentes cercanas.'
    },
    {
      id: 'energia', name: 'Energía', icon: 'i-bolt',
      msg: {
        bajo: 'Usas la energía con eficiencia y la aprovechas bien.',
        moderado: 'Tu consumo es medio: hay hábitos y equipos que se pueden mejorar.',
        alto: 'Hay un consumo elevado y pocas medidas de eficiencia.'
      },
      ok: 'Usas la energía con eficiencia. Compártelo en casa y en el colegio para multiplicar el ahorro.'
    },
    {
      id: 'verdes', name: 'Zonas verdes y contaminación', icon: 'i-leaf',
      msg: {
        bajo: 'Tu entorno tiene vegetación cercana y poca contaminación notoria.',
        moderado: 'Hay algunas zonas verdes, pero también fuentes de contaminación visibles.',
        alto: 'Hay pocas zonas verdes y contaminación frecuente en el aire, el ruido o el ambiente.'
      },
      ok: 'Tu entorno cuenta con vegetación y poca contaminación notoria. Ayuda a conservarlo.'
    }
  ];

  const LEVELS = [
    { key: 'bajo', label: 'Bajo', max: 33 },
    { key: 'moderado', label: 'Moderado', max: 66 },
    { key: 'alto', label: 'Alto', max: 100 }
  ];

  const LEVEL_TEXT = {
    bajo: 'Tu entorno muestra señales favorables: hay buenos hábitos y condiciones. Aun así, siempre se puede mejorar.',
    moderado: 'Hay aspectos positivos y otros por mejorar. Pequeños cambios en los hábitos y en la comunidad pueden reducir el impacto.',
    alto: 'Varias condiciones o hábitos generan un impacto importante. Las recomendaciones te ayudan a decidir por dónde empezar.'
  };

  /* Tipos de pregunta:
     single  -> una opción; cada opción tiene score (0-100) o null (no cuenta)
     multi   -> varias opciones; mode 'good' (más marcadas = menos impacto) o 'bad' (más marcadas = más impacto)
     slider  -> escala numérica; invert=true si un valor alto significa menos impacto */
  const QUESTIONS = [
    // ---- Transporte ----
    {
      cat: 'transporte', type: 'single',
      text: '¿Cómo llegas normalmente a tu colegio o a tus actividades diarias?',
      hint: 'Elige la forma que usas con más frecuencia.',
      options: [
        { label: 'Caminando o en bicicleta', score: 0 },
        { label: 'En transporte público o ruta escolar', score: 25 },
        { label: 'En moto', score: 65, tip: 'Si tu recorrido es corto, prueba combinarlo con caminar o con bicicleta algunos días, o compartir el viaje con compañeros del barrio.' },
        { label: 'En carro particular', score: 100, tip: 'Propón compartir el carro con vecinos o compañeros, o alternar con transporte público o bicicleta en los trayectos cortos.' }
      ]
    },
    {
      cat: 'transporte', type: 'single',
      text: 'Piensa en las calles de tu zona en horas pico. ¿Qué tan seguido hay congestión de vehículos?',
      hint: 'Responde según lo que observas en una semana normal.',
      tip: 'La congestión aumenta el humo y el ruido. En tu colegio puedes proponer horarios escalonados, rutas compartidas o días sin carro.',
      options: [
        { label: 'Rara vez o nunca', score: 0 },
        { label: 'Algunos días de la semana', score: 35 },
        { label: 'Casi todos los días', score: 70 },
        { label: 'Todo el día, incluso fuera de horas pico', score: 100 }
      ]
    },
    {
      cat: 'transporte', type: 'multi', mode: 'good',
      text: '¿Cuáles de estas condiciones existen en tu entorno para moverse de forma sostenible?',
      hint: 'Marca todas las que apliquen.',
      options: [
        { label: 'Ciclorrutas o vías seguras para bicicleta', tip: 'Averigua en la alcaldía o en la junta de acción comunal si hay planes de ciclorrutas, y propón rutas seguras para moverse en bicicleta.' },
        { label: 'Andenes y cruces peatonales en buen estado', tip: 'Documenta con fotos los andenes dañados o sin rampas y repórtalos a la autoridad local.' },
        { label: 'Transporte público frecuente y cercano', tip: 'Consulta las rutas y horarios del transporte público de tu zona; usarlo aunque sea un par de días reduce el uso de vehículos particulares.' },
        { label: 'Ninguna de las anteriores', exclusive: true }
      ]
    },

    // ---- Residuos ----
    {
      cat: 'residuos', type: 'single',
      text: 'En tu casa, ¿qué haces con la basura de cada día?',
      hint: 'Piensa en lo que ocurre normalmente, no en lo ideal.',
      options: [
        { label: 'Separo orgánicos, reciclables y no aprovechables', score: 0 },
        { label: 'Separo solo algunos materiales, como plástico o papel', score: 30, tip: 'Amplía la separación a los residuos orgánicos: con ellos puedes hacer compost casero o entregarlos a un programa de aprovechamiento.' },
        { label: 'Separo de vez en cuando, sin un sistema fijo', score: 65, tip: 'Define un sistema fijo: tres recipientes marcados (reciclable, orgánico y no aprovechable) ayudan a volver el hábito constante.' },
        { label: 'Todo va junto en la misma bolsa', score: 100, tip: 'Empieza por lo más fácil: un recipiente aparte para papel, cartón, plástico y vidrio limpios, y revisa el código de colores que usa tu municipio.' }
      ]
    },
    {
      cat: 'residuos', type: 'slider',
      text: 'En una semana normal, ¿cuántas veces usas productos desechables de un solo uso, como botellas, bolsas, vasos o pitillos?',
      hint: 'Mueve el control para dar una cifra aproximada.',
      min: 0, max: 10, step: 1, invert: false, unit: 'veces por semana',
      lowLabel: 'Ninguna', highLabel: '10 o más',
      tip: 'Lleva contigo botella reutilizable, bolsa de tela y un recipiente para la comida: reducir lo desechable es la forma más directa de generar menos residuos.'
    },
    {
      cat: 'residuos', type: 'single',
      text: '¿Cómo funciona la recolección de residuos en tu barrio o vereda?',
      hint: 'Elige la descripción que más se parezca a tu entorno.',
      options: [
        { label: 'Pasa con regularidad y las calles se mantienen limpias', score: 0 },
        { label: 'Pasa, pero se acumulan bolsas en algunas esquinas', score: 40, tip: 'Identifica los puntos donde se acumulan bolsas y propón una campaña sobre los horarios de recolección con la junta de acción comunal.' },
        { label: 'Es irregular y hay puntos críticos de basura', score: 75, tip: 'Mapea los puntos críticos de tu barrio y plantea una jornada de limpieza junto con la junta de acción comunal o la empresa de aseo.' },
        { label: 'No hay servicio, y se queman o botan residuos en lotes o quebradas', score: 100, tip: 'Quemar residuos libera humo tóxico. Infórmate con la alcaldía o la empresa de servicios públicos sobre alternativas y evita botarlos en lotes o cuerpos de agua.' }
      ]
    },

    // ---- Agua ----
    {
      cat: 'agua', type: 'single',
      text: '¿Cuánto dura, en promedio, tu baño diario?',
      hint: 'Calcula un tiempo aproximado.',
      tip: 'Intenta acortar tu ducha uno o dos minutos y cierra la llave mientras te enjabonas: es un cambio simple que puedes medir.',
      options: [
        { label: 'Menos de 5 minutos', score: 0 },
        { label: 'Entre 5 y 10 minutos', score: 33 },
        { label: 'Entre 10 y 15 minutos', score: 66 },
        { label: 'Más de 15 minutos', score: 100 }
      ]
    },
    {
      cat: 'agua', type: 'multi', mode: 'good',
      text: '¿Cuáles de estas prácticas de ahorro de agua se hacen en tu hogar?',
      hint: 'Marca todas las que apliquen.',
      options: [
        { label: 'Cerrar la llave al cepillarse los dientes o lavar los platos', tip: 'Cierra la llave mientras te cepillas o enjabonas: ahorras agua todos los días sin cambiar nada más.' },
        { label: 'Reparar pronto las fugas de grifos y tuberías', tip: 'Revisa llaves y sanitarios en busca de goteos: una fuga pequeña desperdicia agua todos los días sin que se note.' },
        { label: 'Reutilizar agua, por ejemplo la del lavado para regar o limpiar', tip: 'Reutiliza el agua del lavado de verduras o de ropa para regar plantas o limpiar patios.' },
        { label: 'Recoger agua lluvia', tip: 'Si es posible, ubica un recipiente para recoger agua lluvia y úsala para plantas o aseo exterior.' },
        { label: 'Ninguna de estas', exclusive: true }
      ]
    },
    {
      cat: 'agua', type: 'single',
      text: '¿Cómo está el río, quebrada, caño o ciénaga más cercano a tu casa?',
      hint: 'Si no hay ninguno cerca, elige la última opción: esta pregunta no se tendrá en cuenta.',
      options: [
        { label: 'Limpio, con agua clara y orillas cuidadas', score: 0 },
        { label: 'Con algunos residuos en las orillas', score: 35, tip: 'Participa en jornadas de limpieza de orillas y evita arrojar residuos que el agua pueda arrastrar.' },
        { label: 'Turbio, con olores o basura frecuente', score: 70, tip: 'Los residuos y vertimientos afectan a los peces, los cultivos y la salud. Evita arrojar aceites o basura a los desagües y reporta vertimientos a la autoridad ambiental de tu región.' },
        { label: 'Muy contaminado, con vertimientos visibles', score: 100, tip: 'Reporta los vertimientos a la autoridad ambiental de tu región (en Colombia, la corporación autónoma regional) y propón en tu colegio una campaña para no arrojar residuos a desagües.' },
        { label: 'No tengo ninguno cerca', score: null }
      ]
    },

    // ---- Energía ----
    {
      cat: 'energia', type: 'single',
      text: 'Cuando nadie los usa, ¿qué pasa con las luces, el televisor o los cargadores en tu casa?',
      hint: 'Piensa en tus hábitos de todos los días.',
      tip: 'Haz una ronda de «apagado» antes de salir y de dormir: los cargadores y aparatos conectados también consumen energía.',
      options: [
        { label: 'Casi siempre se apagan o se desconectan', score: 0 },
        { label: 'A veces quedan encendidos', score: 40 },
        { label: 'Con frecuencia quedan encendidos', score: 70 },
        { label: 'Casi siempre hay algo encendido sin usarse', score: 100 }
      ]
    },
    {
      cat: 'energia', type: 'multi', mode: 'good',
      text: '¿Cuáles de estas opciones de energía eficiente hay en tu casa o en tu colegio?',
      hint: 'Marca todas las que apliquen.',
      options: [
        { label: 'Bombillos LED', tip: 'Cambia los bombillos incandescentes o fluorescentes por LED: consumen mucho menos energía y duran más.' },
        { label: 'Electrodomésticos con etiqueta de eficiencia energética', tip: 'Cuando cambien un electrodoméstico, comparen la etiqueta de eficiencia energética y elijan el de menor consumo.' },
        { label: 'Aprovechamiento de la luz y la ventilación naturales', tip: 'Abre cortinas y ventanas durante el día para usar luz y aire naturales antes de encender luces o ventiladores.' },
        { label: 'Energía solar (paneles o calentador)', tip: 'Infórmate sobre opciones de energía solar para tu colegio o comunidad; aunque no se instalen pronto, puedes proponer el tema en clase.' },
        { label: 'Ninguna de estas', exclusive: true }
      ]
    },
    {
      cat: 'energia', type: 'single',
      text: 'En días de calor, ¿cómo refrescan los espacios donde pasas más tiempo?',
      hint: 'Elige lo que más se usa en tu casa o salón.',
      tip: 'Antes de encender el aire acondicionado, intenta ventilar, cerrar cortinas al sol y usar ventilador; cuando lo uses, mantén una temperatura moderada.',
      options: [
        { label: 'Con ventilación natural, sin aparatos', score: 0 },
        { label: 'Con ventilador', score: 20 },
        { label: 'Con aire acondicionado unas pocas horas', score: 65 },
        { label: 'Con aire acondicionado casi todo el día', score: 100 }
      ]
    },

    // ---- Zonas verdes y contaminación ----
    {
      cat: 'verdes', type: 'single',
      text: '¿Qué tan cerca queda de tu casa el parque, la zona verde o el bosque más cercano?',
      hint: 'Calcula el tiempo que tardarías caminando.',
      tip: 'Mira si hay lotes baldíos o separadores que se puedan convertir en huertas o jardines comunitarios con apoyo de los vecinos y de la junta de acción comunal.',
      options: [
        { label: 'A menos de 5 minutos caminando', score: 0 },
        { label: 'Entre 5 y 15 minutos', score: 35 },
        { label: 'A más de 15 minutos, o necesito transporte', score: 70 },
        { label: 'No hay zonas verdes cercanas', score: 100 }
      ]
    },
    {
      cat: 'verdes', type: 'multi', mode: 'bad',
      text: '¿Cuáles de estas fuentes de contaminación notas con frecuencia en tu entorno?',
      hint: 'Marca todas las que apliquen.',
      options: [
        { label: 'Humo de vehículos, fábricas o quemas', tip: 'Reporta las quemas de basura o de vegetación a las autoridades y recuerda que la revisión técnico-mecánica ayuda a controlar las emisiones de los vehículos.' },
        { label: 'Ruido excesivo de tráfico, obras o música', tip: 'El ruido constante afecta la concentración y el descanso. Propón acuerdos de convivencia sobre horarios y volumen en tu barrio o colegio.' },
        { label: 'Malos olores de basuras, aguas residuales o animales', tip: 'Los malos olores suelen indicar residuos mal manejados: identifica el origen y repórtalo a la empresa de aseo o a la autoridad ambiental.' },
        { label: 'Polvo de obras, calles sin pavimentar o canteras', tip: 'El polvo afecta las vías respiratorias: pide que las obras se cubran y se humedezcan, y usa tapabocas si debes pasar cerca.' },
        { label: 'Ninguna de estas', exclusive: true }
      ]
    },
    {
      cat: 'verdes', type: 'slider',
      text: 'Del 1 al 10, ¿cuánta sombra y vegetación (árboles, antejardines, zonas verdes) hay en el camino entre tu casa y el colegio?',
      hint: 'Mueve el control para dar una valoración.',
      min: 1, max: 10, step: 1, invert: true, unit: 'de 10',
      lowLabel: 'Casi ninguna', highLabel: 'Mucha',
      tip: 'Planta un árbol nativo con tu curso o tu familia, con orientación de la autoridad ambiental o de un vivero local, para ganar sombra y mejorar el aire.'
    }
  ];

  QUESTIONS.forEach(function (q, i) { q.index = i; });

  /* ---------------- Cálculo (funciones puras) ---------------- */

  function levelOf(score) {
    for (let i = 0; i < LEVELS.length; i++) {
      if (score <= LEVELS[i].max) return LEVELS[i];
    }
    return LEVELS[LEVELS.length - 1];
  }

  // Puntaje de impacto (0-100) de una pregunta, o null si no cuenta / no se respondió.
  function scoreQuestion(q, a) {
    if (a === null || a === undefined) return null;
    if (q.type === 'single') {
      const o = q.options[a];
      return o && o.score !== null && o.score !== undefined ? o.score : null;
    }
    if (q.type === 'multi') {
      const total = q.options.filter(function (o) { return !o.exclusive; }).length;
      const count = a.filter(function (i) { return q.options[i] && !q.options[i].exclusive; }).length;
      const ratio = count / total;
      return Math.round(100 * (q.mode === 'good' ? 1 - ratio : ratio));
    }
    if (q.type === 'slider') {
      const pct = (a - q.min) / (q.max - q.min) * 100;
      return Math.round(q.invert ? 100 - pct : pct);
    }
    return null;
  }

  function average(list) {
    return list.reduce(function (s, n) { return s + n; }, 0) / list.length;
  }

  function computeResults(answers) {
    const categories = CATEGORIES.map(function (c) {
      const scores = QUESTIONS
        .filter(function (q) { return q.cat === c.id; })
        .map(function (q) { return scoreQuestion(q, answers[q.index]); })
        .filter(function (s) { return s !== null; });
      const score = scores.length ? Math.round(average(scores)) : null;
      return { id: c.id, name: c.name, icon: c.icon, score: score, level: score === null ? null : levelOf(score).key };
    });
    const valid = categories.filter(function (c) { return c.score !== null; });
    const overall = valid.length ? Math.round(average(valid.map(function (c) { return c.score; }))) : 0;
    const max = valid.length ? Math.max.apply(null, valid.map(function (c) { return c.score; })) : 0;
    const top = valid.filter(function (c) { return c.score === max; });
    return { categories: categories, overall: overall, level: levelOf(overall).key, max: max, top: top };
  }

  // Recomendaciones específicas según lo que respondió la persona (máx. 3 por categoría).
  function buildRecommendations(answers) {
    const by = {};
    CATEGORIES.forEach(function (c) { by[c.id] = []; });
    QUESTIONS.forEach(function (q) {
      const a = answers[q.index];
      const s = scoreQuestion(q, a);
      if (s === null) return;
      const tips = [];
      if (q.type === 'single') {
        if (s >= 30) {
          const t = q.options[a].tip || q.tip;
          if (t) tips.push(t);
        }
      } else if (q.type === 'multi') {
        if (q.mode === 'good') {
          q.options.forEach(function (o, oi) {
            if (!o.exclusive && a.indexOf(oi) === -1 && o.tip) tips.push(o.tip);
          });
        } else {
          a.forEach(function (oi) {
            const o = q.options[oi];
            if (o && !o.exclusive && o.tip) tips.push(o.tip);
          });
        }
      } else if (q.type === 'slider') {
        if (s >= 30 && q.tip) tips.push(q.tip);
      }
      tips.forEach(function (t) { by[q.cat].push({ text: t, priority: s }); });
    });
    const out = {};
    CATEGORIES.forEach(function (c) {
      const sorted = by[c.id]
        .map(function (t, i) { return { text: t.text, priority: t.priority, i: i }; })
        .sort(function (x, y) { return y.priority - x.priority || x.i - y.i; })
        .slice(0, 3)
        .map(function (t) { return t.text; });
      out[c.id] = sorted;
    });
    return out;
  }

  const api = {
    CATEGORIES: CATEGORIES, QUESTIONS: QUESTIONS, LEVELS: LEVELS,
    levelOf: levelOf, scoreQuestion: scoreQuestion,
    computeResults: computeResults, buildRecommendations: buildRecommendations
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof document !== 'undefined') initUI();

  /* ---------------- Interfaz ---------------- */

  function initUI() {
    const NS = 'http://www.w3.org/2000/svg';
    const total = QUESTIONS.length;
    const catById = {};
    CATEGORIES.forEach(function (c) { catById[c.id] = c; });
    const state = { entorno: '', index: 0, answers: QUESTIONS.map(function () { return null; }), reflection: '' };

    function $(sel, root) { return (root || document).querySelector(sel); }

    function el(tag, props) {
      const n = document.createElement(tag);
      Object.keys(props || {}).forEach(function (k) {
        const v = props[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') n.className = v;
        else if (k === 'text') n.textContent = v;
        else if (v === true) n.setAttribute(k, '');
        else n.setAttribute(k, v);
      });
      function add(c) {
        if (c === null || c === undefined) return;
        if (Array.isArray(c)) { c.forEach(add); return; }
        n.append(c.nodeType ? c : document.createTextNode(String(c)));
      }
      for (let i = 2; i < arguments.length; i++) add(arguments[i]);
      return n;
    }

    function icon(id) {
      const s = document.createElementNS(NS, 'svg');
      s.setAttribute('viewBox', '0 0 48 48');
      s.setAttribute('aria-hidden', 'true');
      const u = document.createElementNS(NS, 'use');
      u.setAttribute('href', '#' + id);
      s.append(u);
      return s;
    }

    function iconCircle(id, small) {
      return el('span', { class: 'icon' + (small ? ' icon--sm' : '') }, icon(id));
    }

    function pill(level, text) {
      const p = el('span', { class: 'pill', text: text || ('Impacto ' + levelLabel(level).toLowerCase()) });
      p.dataset.level = level;
      return p;
    }

    function levelLabel(key) {
      return LEVELS.filter(function (l) { return l.key === key; })[0].label;
    }

    const screens = { intro: $('#screen-intro'), quiz: $('#screen-quiz'), results: $('#screen-results') };

    function show(name) {
      Object.keys(screens).forEach(function (k) { screens[k].hidden = k !== name; });
      window.scrollTo(0, 0);
      const h = screens[name].querySelector('[data-focus]');
      if (h) h.focus({ preventScroll: true });
    }

    /* ---- Introducción ---- */
    const startForm = $('#start-form');
    const envInput = $('#entorno');
    const envError = $('#entorno-error');

    startForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const value = envInput.value.replace(/\s+/g, ' ').trim();
      if (value.length < 2) {
        envError.textContent = 'Escribe el nombre de tu ciudad, municipio o comunidad para comenzar.';
        envError.hidden = false;
        envInput.setAttribute('aria-invalid', 'true');
        envInput.focus();
        return;
      }
      envError.hidden = true;
      envInput.removeAttribute('aria-invalid');
      state.entorno = value;
      state.index = 0;
      $('#quiz-env').textContent = value;
      show('quiz');
      renderQuestion();
    });
    envInput.addEventListener('input', function () {
      if (!envError.hidden && envInput.value.trim().length >= 2) {
        envError.hidden = true;
        envInput.removeAttribute('aria-invalid');
      }
    });

    /* ---- Cuestionario ---- */
    function renderSteps() {
      const list = $('#steps');
      list.replaceChildren();
      const cur = CATEGORIES.map(function (c) { return c.id; }).indexOf(QUESTIONS[state.index].cat);
      CATEGORIES.forEach(function (c, i) {
        const cls = i < cur ? ' is-done' : (i === cur ? ' is-current' : '');
        list.append(el('li', { class: 'step' + cls, 'aria-current': i === cur ? 'step' : null },
          iconCircle(c.icon, true),
          el('span', { class: 'step__name', text: c.name })));
      });
    }

    function isAnswered(i) {
      const a = state.answers[i];
      return a !== null && a !== undefined;
    }

    function renderQuestion() {
      const i = state.index;
      const q = QUESTIONS[i];
      const cat = catById[q.cat];
      renderSteps();

      const bar = $('#progress-bar');
      bar.style.width = (i / total * 100) + '%';
      const prog = $('#progress');
      prog.setAttribute('aria-valuenow', String(i + 1));
      prog.setAttribute('aria-valuetext', 'Pregunta ' + (i + 1) + ' de ' + total);

      const legend = el('legend', { class: 'q__text', tabindex: '-1', text: q.text });
      const body = el('div', {});
      const fieldset = el('fieldset', {}, legend, q.hint ? el('p', { class: 'q__hint', text: q.hint }) : null, body);

      const prev = el('button', { class: 'btn btn--ghost', type: 'button', id: 'btn-prev', text: 'Anterior' });
      const next = el('button', { class: 'btn', type: 'button', id: 'btn-next', text: i === total - 1 ? 'Ver resultados' : 'Siguiente' });
      prev.disabled = i === 0;

      function updateNav() { next.disabled = !isAnswered(i); }

      if (q.type === 'single') body.append(buildSingle(q, i, updateNav));
      else if (q.type === 'multi') body.append(buildMulti(q, i, updateNav));
      else body.append(buildSlider(q, i, updateNav));

      prev.addEventListener('click', function () { if (state.index > 0) { state.index--; renderQuestion(); } });
      next.addEventListener('click', function () {
        if (!isAnswered(state.index)) return;
        if (state.index < total - 1) { state.index++; renderQuestion(); }
        else { showResults(); }
      });
      updateNav();

      const card = $('#question-card');
      card.replaceChildren(
        el('header', { class: 'q__head' },
          iconCircle(cat.icon),
          el('div', {},
            el('p', { class: 'q__cat', text: cat.name }),
            el('p', { class: 'q__count', text: 'Pregunta ' + (i + 1) + ' de ' + total }))),
        fieldset,
        el('div', { class: 'q__nav' }, prev, next));
      legend.focus({ preventScroll: true });
    }

    function syncSelected(wrap) {
      wrap.querySelectorAll('.option').forEach(function (lab) {
        lab.classList.toggle('is-selected', lab.querySelector('input').checked);
      });
    }

    function buildSingle(q, i, updateNav) {
      const wrap = el('div', { class: 'options', role: 'radiogroup' });
      q.options.forEach(function (o, oi) {
        const id = 'q' + i + '-o' + oi;
        const input = el('input', { type: 'radio', name: 'q' + i, id: id, value: String(oi) });
        input.checked = state.answers[i] === oi;
        input.addEventListener('change', function () {
          state.answers[i] = oi;
          syncSelected(wrap);
          updateNav();
        });
        wrap.append(el('label', { class: 'option', for: id },
          input, el('span', { class: 'option__mark', 'aria-hidden': 'true' }), el('span', { text: o.label })));
      });
      syncSelected(wrap);
      return wrap;
    }

    function buildMulti(q, i, updateNav) {
      const wrap = el('div', { class: 'options' });
      const inputs = [];
      q.options.forEach(function (o, oi) {
        const id = 'q' + i + '-o' + oi;
        const input = el('input', { type: 'checkbox', id: id, value: String(oi) });
        input.checked = Array.isArray(state.answers[i]) && state.answers[i].indexOf(oi) !== -1;
        inputs.push(input);
        input.addEventListener('change', function () {
          let sel = (state.answers[i] || []).slice();
          if (input.checked) {
            if (o.exclusive) {
              sel = [oi];
            } else {
              if (sel.indexOf(oi) === -1) sel.push(oi);
              sel = sel.filter(function (x) { return !q.options[x].exclusive; });
            }
          } else {
            sel = sel.filter(function (x) { return x !== oi; });
          }
          state.answers[i] = sel.length ? sel : null;
          inputs.forEach(function (inp, k) { inp.checked = sel.indexOf(k) !== -1; });
          syncSelected(wrap);
          updateNav();
        });
        wrap.append(el('label', { class: 'option option--check', for: id },
          input, el('span', { class: 'option__mark', 'aria-hidden': 'true' }), el('span', { text: o.label })));
      });
      syncSelected(wrap);
      return wrap;
    }

    function buildSlider(q, i, updateNav) {
      const answered = isAnswered(i);
      const start = answered ? state.answers[i] : Math.round((q.min + q.max) / 2);
      const out = el('output', { class: 'slider__value', for: 'q' + i + '-range' });
      const range = el('input', {
        type: 'range', id: 'q' + i + '-range', min: String(q.min), max: String(q.max), step: String(q.step),
        'aria-label': q.text
      });
      range.value = String(start);

      function paint() {
        if (isAnswered(i)) {
          out.classList.remove('is-empty');
          out.textContent = state.answers[i] + ' ' + q.unit;
        } else {
          out.classList.add('is-empty');
          out.textContent = 'Mueve el control';
        }
      }
      function commit() {
        state.answers[i] = Number(range.value);
        paint();
        updateNav();
      }
      range.addEventListener('input', commit);
      range.addEventListener('change', commit);
      range.addEventListener('pointerup', commit);
      range.addEventListener('keydown', function () { setTimeout(commit, 0); });
      paint();

      return el('div', { class: 'slider' },
        el('div', { class: 'slider__top' }, out),
        range,
        el('div', { class: 'slider__ends', 'aria-hidden': 'true' }, el('span', { text: q.lowLabel }), el('span', { text: q.highLabel })));
    }

    /* ---- Resultados ---- */
    function showResults() {
      renderResults();
      show('results');
    }

    function renderResults() {
      const r = computeResults(state.answers);
      const recs = buildRecommendations(state.answers);
      const lv = levelOf(r.overall);

      $('#res-env').textContent = state.entorno;

      // Resultado general
      $('#overall-score').textContent = String(r.overall);
      const op = $('#overall-pill');
      op.textContent = 'Impacto ' + lv.label.toLowerCase();
      op.dataset.level = lv.key;
      $('#overall-text').textContent = LEVEL_TEXT[lv.key];
      $('#scale-marker').style.left = Math.min(100, Math.max(0, r.overall)) + '%';

      // Gráfico de barras
      const chart = $('#chart');
      chart.replaceChildren();
      const fills = [];
      r.categories.forEach(function (c) {
        const isTop = c.score !== null && c.score === r.max && r.max > 0;
        const fill = el('div', { class: 'bar-fill' });
        fill.dataset.level = c.level || 'bajo';
        fills.push([fill, c.score || 0]);
        const track = el('div', { class: 'bar-track', role: 'img', 'aria-label': c.name + ': ' + c.score + ' de 100, impacto ' + levelLabel(c.level).toLowerCase() }, fill);
        const row = el('div', { class: 'bar-row' + (isTop ? ' is-top' : '') },
          el('div', { class: 'bar-row__label' }, iconCircle(c.icon, true), el('span', { text: c.name })),
          track,
          el('div', { class: 'bar-row__value' },
            el('span', { text: c.score + ' / 100' }),
            el('small', { text: isTop ? 'Mayor impacto' : levelLabel(c.level) })));
        chart.append(row);
      });
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          fills.forEach(function (f) { f[0].style.width = f[1] + '%'; });
        });
      });

      const summary = $('#chart-summary');
      if (r.max > 0) {
        const names = r.top.map(function (c) { return c.name; });
        const joined = names.length > 1 ? names.slice(0, -1).join(', ') + ' y ' + names[names.length - 1] : names[0];
        summary.replaceChildren('El mayor impacto se concentra en ', el('strong', { text: joined }), ' (' + r.max + ' de 100).');
      } else {
        summary.textContent = 'No aparece ningún área con impacto destacado. ¡Excelente punto de partida!';
      }

      // Tarjetas por categoría
      const catCards = $('#category-cards');
      catCards.replaceChildren();
      r.categories.forEach(function (c) {
        catCards.append(el('article', { class: 'card cat-card' },
          iconCircle(c.icon),
          el('div', { class: 'cat-card__score' },
            el('h3', { class: 'card__title', text: c.name }),
            el('p', { class: 'cat-card__num' }, String(c.score), el('small', { text: '/100' }))),
          pill(c.level),
          el('p', { class: 'card__text', text: catById[c.id].msg[c.level] })));
      });
      catCards.append(el('article', { class: 'card' },
        iconCircle('i-info'),
        el('h3', { class: 'card__title', text: 'Una estimación educativa' }),
        el('p', { class: 'card__text', text: 'Este índice es una aproximación para reflexionar a partir de tus respuestas. No es una medición científica oficial ni reemplaza los datos de las autoridades ambientales.' })));

      // Recomendaciones (primero las categorías con mayor impacto)
      const recBox = $('#recs');
      recBox.replaceChildren();
      const ordered = r.categories.slice().sort(function (a, b) { return b.score - a.score; });
      ordered.forEach(function (c, idx) {
        const list = recs[c.id];
        const titleChildren = [c.name];
        if (idx === 0 && r.max > 0) titleChildren.push(el('span', { class: 'tag', text: 'Prioridad' }));
        const content = list.length
          ? el('ul', {}, list.map(function (t) { return el('li', { text: t }); }))
          : el('p', { class: 'card__text', text: catById[c.id].ok });
        recBox.append(el('article', { class: 'card rec-card' },
          iconCircle(c.icon),
          el('h3', { class: 'card__title' }, titleChildren),
          content));
      });
      const first = ordered[0];
      recBox.append(el('article', { class: 'card rec-card' },
        iconCircle('i-leaf'),
        el('h3', { class: 'card__title', text: 'Tu punto de partida' }),
        el('p', { class: 'card__text', text: r.max > 0
          ? 'Elige una sola recomendación de «' + first.name + '», la categoría con mayor impacto, y proponla esta semana en tu casa, tu colegio o tu barrio.'
          : 'Tus respuestas son favorables. Elige una de las recomendaciones y compártela con tu familia y compañeros para multiplicar el efecto.' })));

      // Reflexión: se reinicia al generar nuevos resultados
      state.reflection = '';
      $('#reflection').value = '';
      $('#reflection-count').textContent = '0 / 600';
      $('#reflection-error').hidden = true;
      $('#reflection-save').textContent = 'Guardar reflexión';
      $('#summary').hidden = true;
    }

    /* ---- Reflexión ---- */
    const reflection = $('#reflection');
    const reflectionError = $('#reflection-error');
    reflection.addEventListener('input', function () {
      $('#reflection-count').textContent = reflection.value.length + ' / 600';
      if (!reflectionError.hidden && reflection.value.trim().length >= 10) {
        reflectionError.hidden = true;
        reflection.removeAttribute('aria-invalid');
      }
    });

    $('#reflection-form').addEventListener('submit', function (e) {
      e.preventDefault();
      const text = reflection.value.trim();
      if (text.length < 10) {
        reflectionError.textContent = 'Escribe al menos una frase para guardar tu reflexión.';
        reflectionError.hidden = false;
        reflection.setAttribute('aria-invalid', 'true');
        reflection.focus();
        return;
      }
      reflectionError.hidden = true;
      reflection.removeAttribute('aria-invalid');
      state.reflection = text;
      renderSummary();
      $('#reflection-save').textContent = 'Actualizar reflexión';
    });

    function renderSummary() {
      const r = computeResults(state.answers);
      const names = r.top.map(function (c) { return c.name; }).join(' y ');
      const rows = [
        ['Entorno:', state.entorno],
        ['Resultado general:', 'Impacto ' + levelLabel(r.level).toLowerCase() + ' (' + r.overall + ' / 100)'],
        ['Mayor impacto:', r.max > 0 ? names + ' (' + r.max + ' / 100)' : 'Sin áreas destacadas']
      ];
      const dl = $('#summary-list');
      dl.replaceChildren();
      rows.forEach(function (row) {
        dl.append(el('div', {}, el('dt', { text: row[0] }), el('dd', { text: row[1] })));
      });
      $('#summary-quote').textContent = state.reflection;
      const box = $('#summary');
      box.hidden = false;
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      $('#summary-title').focus({ preventScroll: true });
    }

    /* ---- Acciones finales ---- */
    $('#btn-print').addEventListener('click', function () { window.print(); });
    $('#btn-restart').addEventListener('click', function () {
      state.answers = QUESTIONS.map(function () { return null; });
      state.index = 0;
      state.reflection = '';
      $('#summary').hidden = true;
      show('intro');
    });
  }
})();
