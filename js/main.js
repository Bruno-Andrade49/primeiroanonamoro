/* =====================================================================
   Bruno & Maria Luisa · 1 ano
   Todo o conteúdo vem de js/data.js
   ===================================================================== */
(() => {
  "use strict";

  const D = window.NAMORO;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const root = document.documentElement;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  // vibraçãozinha no Android (o iPhone ignora)
  const buzz = (p) => { try { navigator.vibrate?.(p); } catch (e) { /* sem suporte */ } };

  const HEART_D = "M12 21s-7.5-4.6-9.6-9.4C.9 8 3 4 6.9 4c2.2 0 3.8 1.2 5.1 3 1.3-1.8 2.9-3 5.1-3C21 4 23.1 8 21.6 11.6 19.5 16.4 12 21 12 21z";
  const heartSvg = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${HEART_D}"/></svg>`;
  const FX_COLORS = ["#F5B80F", "#FFD84D", "#2346D1", "#4F6FFF", "#FFE9A8"];

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const rand = (a, b) => a + Math.random() * (b - a);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const debounce = (fn, ms) => {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  };

  const foto = (id) => {
    const f = D.fotos[id];
    if (!f) { console.warn(`Foto "${id}" não está cadastrada em data.js`); return null; }
    return {
      id, ...f,
      src: `assets/fotos/${id}.jpg`,          // grande (tela cheia)
      thumb: `assets/fotos/thumbs/${id}.jpg`, // 640px (polaroids, álbum)
      mini: `assets/fotos/mini/${id}.jpg`,    // 200px (mosaico)
    };
  };
  const allFotos = Object.keys(D.fotos).map(foto);
  const imgPos = (f) => `object-position:${f.pos || "50% 50%"}`;

  let lenis = null;
  let heroIntro = null;
  let playMusic = null;

  history.scrollRestoration = "manual";
  scrollTo(0, 0);

  /* ===================================================================
     MONTAGEM DA PÁGINA
     =================================================================== */

  // ---------- nomes ----------
  $(".names__him").textContent = D.ele;
  $(".names__her").textContent = D.ela;
  $$("[data-split]").forEach((el) => {
    const text = el.textContent.trim();
    el.innerHTML =
      `<span class="sr-only">${esc(text)}</span>` +
      text.split(" ").map((w) =>
        `<span class="w" aria-hidden="true">${[...w].map((c) => `<span class="c">${esc(c)}</span>`).join("")}</span>`
      ).join(" ");
  });
  $("#heroSub").textContent = D.subtitulo || "";

  // ---------- fotos dentro do coração ----------
  const capa = (D.capa || []).map(foto).filter(Boolean);
  const slides = $("#heroSlides");
  // srcset: no celular o navegador escolhe a versão de 640px e economiza dados
  slides.innerHTML = capa
    .map((f, i) => `<img src="${f.src}" srcset="${f.thumb} 640w, ${f.src} ${f.w}w"
        sizes="(max-width: 900px) 72vw, 520px" alt="${esc(f.alt)}" decoding="async"
        ${i === 0 ? 'fetchpriority="high" class="is-on"' : 'loading="lazy"'} style="${imgPos(f)}">`)
    .join("");
  if (capa.length > 1 && !reduceMotion) {
    const imgs = $$("img", slides);
    let cur = 0;
    setInterval(() => {
      imgs[cur].classList.remove("is-on");
      cur = (cur + 1) % imgs.length;
      imgs[cur].classList.add("is-on");
    }, 4800);
  }

  // ---------- faixas ----------
  const buildMarquee = (el, words) => {
    const unit = words.map((w) => `<span>${esc(w)}</span>${heartSvg}`).join("");
    el.innerHTML = unit.repeat(4) + unit.repeat(4); // duas metades iguais = loop perfeito
  };
  buildMarquee($("#marqueeA"), [D.ele, D.ela, "1 ano de nós", "02.10.2025"]);
  buildMarquee($("#marqueeB"), ["azul & amarelo", "nossas cores", "365 dias", "pra sempre"]);

  // ---------- linha do tempo ----------
  const PILE = {
    1: [{ x: 0, y: 0, r: -3, z: 3 }],
    2: [{ x: -22, y: -3, r: -6, z: 3 }, { x: 24, y: 5, r: 5, z: 2 }],
    3: [{ x: 0, y: -4, r: 2, z: 3 }, { x: -36, y: 4, r: -9, z: 2 }, { x: 36, y: 7, r: 8, z: 1 }],
  };
  const mesFotos = (i) => (D.meses[i].fotos || []).map(foto).filter(Boolean);

  $("#chapters").innerHTML = D.meses.map((m, i) => {
    const fotos = mesFotos(i);
    const shown = fotos.slice(0, 3);
    const extra = fotos.length - shown.length;
    const texto = (m.texto || "").trim();
    const body = texto
      ? texto.split(/\n\s*\n/).map((p) => `<p>${esc(p)}</p>`).join("")
      : `<p class="is-empty">texto deste mês em breve…</p>`;

    const pols = shown.length
      ? shown.map((f, j) => {
          const l = PILE[shown.length][j];
          return `<button class="polaroid" type="button" data-month="${i}" data-index="${j}"
              style="--x:${l.x}%;--y:${l.y}%;--r:${l.r}deg;--z:${l.z}" aria-label="Ampliar foto: ${esc(f.legenda || f.alt)}">
            <span class="polaroid__card">
              <span class="polaroid__img"><img src="${f.thumb}" alt="${esc(f.alt)}" loading="lazy" decoding="async" style="${imgPos(f)}"></span>
              <span class="polaroid__cap">${esc(f.legenda || "")}</span>
            </span>
          </button>`;
        }).join("")
      : `<div class="polaroid polaroid--blank" style="--r:-3deg">
          <span class="polaroid__card"><span class="polaroid__img">${heartSvg}</span><span class="polaroid__cap">foto em breve</span></span>
        </div>`;

    const more = extra > 0
      ? `<button class="more" type="button" data-month="${i}" data-index="3">+${extra} foto${extra > 1 ? "s" : ""}</button>`
      : "";

    return `<li class="chapter">
      <div class="chapter__node" aria-hidden="true">${heartSvg}</div>
      <div class="chapter__text">
        <span class="chapter__num" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
        <p class="chapter__date">Mês ${i + 1} · ${esc(m.mes)} ${esc(m.ano)}</p>
        <h3 class="chapter__title">${esc(m.titulo || `Capítulo ${i + 1}`)}</h3>
        <div class="chapter__body">${body}</div>
      </div>
      <div class="chapter__photos">${pols}${more}</div>
    </li>`;
  }).join("");

  // ---------- galeria ----------
  const masonry = $("#masonry");
  const shotWraps = allFotos.map((f, i) => {
    const el = document.createElement("div");
    el.className = "shot-wrap";
    el.innerHTML = `
      <button class="shot" type="button" data-index="${i}" style="--ar:${f.w}/${f.h}" aria-label="Ampliar foto: ${esc(f.legenda || f.alt)}">
        <img src="${f.thumb}" alt="${esc(f.alt)}" loading="lazy" decoding="async" width="${f.w}" height="${f.h}">
      </button>`;
    return el;
  });
  // cada foto vai para a coluna mais curta (as proporções já são conhecidas pelo data.js)
  let masonryCols = 0;
  function layoutMasonry() {
    const w = masonry.clientWidth;
    const n = w >= 900 ? 4 : w >= 560 ? 3 : 2;
    if (n === masonryCols) return;
    masonryCols = n;
    const cols = Array.from({ length: n }, () => {
      const c = document.createElement("div");
      c.className = "masonry__col";
      return c;
    });
    const heights = new Array(n).fill(0);
    shotWraps.forEach((el, i) => {
      const k = heights.indexOf(Math.min(...heights));
      cols[k].appendChild(el);
      heights[k] += allFotos[i].h / allFotos[i].w + 0.05;
    });
    masonry.replaceChildren(...cols);
  }
  layoutMasonry();

  // ---------- carta ----------
  if (D.carta && D.carta.length) {
    $("#cartaTo").textContent = `Para a minha ${D.ela},`;
    $("#cartaFrom").textContent = D.ele;
    $("#cartaBody").innerHTML = D.carta
      .map((p) => `<p>${p.split(/(\s+)/).map((w) => (/^\s*$/.test(w) ? w : `<span class="word">${esc(w)}</span>`)).join("")}</p>`)
      .join("");
  } else {
    $("#carta").hidden = true;
    $('.nav a[href="#carta"]').hidden = true;
  }

  // ---------- mosaico em forma de coração ----------
  const HEART_GRID = [
    ".##...##.",
    "####.####",
    "#########",
    "#########",
    ".#######.",
    "..#####..",
    "...###...",
    "....#....",
  ];
  let tileN = 0;
  let photoN = 0;
  $("#mosaic").innerHTML = HEART_GRID.join("").split("").map((ch) => {
    if (ch !== "#") return "<span></span>";
    tileN++;
    if (tileN % 5 === 3) return `<span class="mosaic__tile ${tileN % 2 ? "is-yellow" : "is-blue"}"></span>`;
    const f = allFotos[(photoN++ * 7) % allFotos.length];
    return `<span class="mosaic__tile"><img src="${f.mini}" alt="" loading="lazy" decoding="async" style="${imgPos(f)}"></span>`;
  }).join("");

  /* ===================================================================
     CORAÇÕEZINHOS (efeitos)
     =================================================================== */
  let fxAlive = 0;
  function spawnHeart({ x, y, size, color, keyframes, duration, delay = 0, easing = "cubic-bezier(.2,.7,.3,1)" }) {
    if (fxAlive > 170) return;
    const el = document.createElement("span");
    el.className = "fx-heart";
    el.style.cssText = `--s:${size}px;--c:${color};left:${x - size / 2}px;top:${y - size / 2}px`;
    document.body.appendChild(el);
    fxAlive++;
    const a = el.animate(keyframes, { duration, delay, easing, fill: "both" });
    a.onfinish = a.oncancel = () => { el.remove(); fxAlive--; };
  }

  function burst(x, y, n = 18, spread = 1) {
    if (reduceMotion) return;
    for (let i = 0; i < n; i++) {
      const ang = Math.random() * Math.PI * 2;
      const dist = rand(40, 150) * spread;
      const dx = Math.cos(ang) * dist;
      const dy = Math.sin(ang) * dist - 30;
      const rot = rand(-50, 50);
      spawnHeart({
        x, y,
        size: rand(10, 26),
        color: pick(FX_COLORS),
        duration: rand(1000, 1600),
        keyframes: [
          { transform: "translate(0,0) scale(0) rotate(0deg)", opacity: 1 },
          { transform: `translate(${dx}px,${dy}px) scale(1) rotate(${rot}deg)`, opacity: 1, offset: 0.55 },
          { transform: `translate(${dx * 1.1}px,${dy + 70}px) scale(.8) rotate(${rot * 1.6}deg)`, opacity: 0 },
        ],
      });
    }
  }

  function rain(n = 70) {
    if (reduceMotion) return;
    for (let i = 0; i < n; i++) {
      spawnHeart({
        x: Math.random() * innerWidth,
        y: -40,
        size: rand(12, 34),
        color: pick(FX_COLORS),
        delay: Math.random() * 1800,
        duration: rand(2600, 4800),
        easing: "cubic-bezier(.3,.1,.6,1)",
        keyframes: [
          { transform: "translate(0,0) rotate(0deg)", opacity: 0 },
          { opacity: 1, offset: 0.1 },
          { transform: `translate(${rand(-90, 90)}px,${innerHeight + 90}px) rotate(${rand(-160, 160)}deg)`, opacity: 0.9 },
        ],
      });
    }
  }

  // rastro de coraçõezinhos no mouse
  if (finePointer && !reduceMotion) {
    let last = 0;
    addEventListener("pointermove", (e) => {
      const now = performance.now();
      if (now - last < 85) return;
      last = now;
      spawnHeart({
        x: e.clientX, y: e.clientY,
        size: rand(7, 13),
        color: pick(FX_COLORS.slice(0, 4)),
        duration: 950,
        easing: "ease-out",
        keyframes: [
          { transform: "translate(0,0) scale(.4)", opacity: 0.85 },
          { transform: `translate(${rand(-16, 16)}px,-42px) scale(1)`, opacity: 0 },
        ],
      });
    }, { passive: true });
  }

  // um toque em qualquer lugar solta coraçõezinhos.
  // "click" (e não pointerdown): no celular, o pointerdown dispara a cada rolagem com o dedo
  addEventListener("click", (e) => {
    if (e.target.closest("button, a, .lightbox, .intro")) return;
    burst(e.clientX, e.clientY, 8, 0.6);
  });

  /* ===================================================================
     CÉU (fundo animado: corações flutuando + estrelas no escuro)
     =================================================================== */
  const sky = (() => {
    const c = $("#sky");
    const ctx = c.getContext("2d");
    const heartPath = new Path2D(HEART_D);
    let W = 0, H = 0, dpr = 1, dark = false, colors = [];
    let hearts = [], stars = [];

    const cssVar = (v) => getComputedStyle(root).getPropertyValue(v).trim();
    const makeHeart = (anywhere) => ({
      x: rand(0, W),
      y: anywhere ? rand(0, H) : H + rand(10, 80),
      s: rand(8, 20),
      vy: rand(0.15, 0.45),
      sway: rand(0.2, 0.8),
      ph: rand(0, 6.28),
      rot: rand(-0.4, 0.4),
      a: rand(0.14, 0.36),
      color: pick(colors),
    });

    function refresh() {
      dark = root.dataset.theme === "dark";
      colors = [cssVar("--yellow"), cssVar("--blue-2"), cssVar("--yellow-2")];
      hearts.forEach((h) => (h.color = pick(colors)));
      if (reduceMotion) draw(0);
    }

    function resize() {
      const widthChanged = innerWidth !== W;
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth;
      H = innerHeight;
      c.width = W * dpr;
      c.height = H * dpr;
      if (widthChanged) {
        hearts = Array.from({ length: Math.round(Math.min(34, (W * H) / 38000)) }, () => makeHeart(true));
        stars = Array.from({ length: Math.round(Math.min(150, (W * H) / 9000)) }, () => ({
          x: rand(0, W), y: rand(0, H), r: rand(0.4, 1.4), ph: rand(0, 6.28), sp: rand(0.6, 2),
        }));
      }
      if (reduceMotion) draw(0);
    }

    function draw(t) {
      const time = t / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (dark) {
        ctx.fillStyle = "#FFF6DA";
        for (const s of stars) {
          ctx.globalAlpha = 0.2 + 0.8 * Math.abs(Math.sin(time * s.sp + s.ph));
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, 6.283);
          ctx.fill();
        }
      }
      for (const h of hearts) {
        if (!reduceMotion) {
          h.y -= h.vy;
          h.x += Math.sin(time * h.sway + h.ph) * 0.3;
          if (h.y < -30) Object.assign(h, makeHeart(false));
        }
        ctx.globalAlpha = dark ? h.a + 0.3 : h.a; // no escuro, amarelo fraco vira marrom

        ctx.fillStyle = h.color;
        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate(h.rot + Math.sin(time + h.ph) * 0.15);
        ctx.scale(h.s / 24, h.s / 24);
        ctx.translate(-12, -12);
        ctx.fill(heartPath);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    const loop = (t) => { draw(t); requestAnimationFrame(loop); };

    return {
      init() {
        refresh();
        resize();
        addEventListener("resize", debounce(resize, 200));
        if (!reduceMotion) requestAnimationFrame(loop);
      },
      refresh,
    };
  })();
  sky.init();

  /* ===================================================================
     TEMA (seletor de coração + transição em forma de coração)
     =================================================================== */
  const themeBtn = $("#themeBtn");
  const metaTheme = $('meta[name="theme-color"]');
  const syncTheme = () => {
    const dark = root.dataset.theme === "dark";
    metaTheme.content = dark ? "#060A22" : "#FFF8EA";
    themeBtn.setAttribute("aria-label", dark ? "Mudar para o tema claro" : "Mudar para o tema escuro");
  };
  syncTheme();

  themeBtn.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    const r = themeBtn.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    burst(x, y, 14, 0.8);

    const apply = () => {
      root.dataset.theme = next;
      try { localStorage.setItem("tema", next); } catch (e) { /* navegação privada */ }
      syncTheme();
      sky.refresh();
    };

    if (!document.startViewTransition || reduceMotion) return apply();

    const t = document.startViewTransition(apply);
    t.ready.then(() => {
      const far = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const w = far * 5;
      const h = w * 0.92;
      root.animate(
        {
          maskSize: ["0px 0px", `${w}px ${h}px`],
          maskPosition: [`${x}px ${y}px`, `${x - w / 2}px ${y - h / 2}px`],
        },
        { duration: 1000, easing: "cubic-bezier(.7,0,.25,1)", pseudoElement: "::view-transition-new(root)" }
      );
    }).catch(() => {});
  });

  /* ===================================================================
     CONTADOR
     =================================================================== */
  const start = new Date(D.inicio);
  const nums = Object.fromEntries($$(".clock__num").map((el) => [el.dataset.k, el]));
  const nf = new Intl.NumberFormat("pt-BR");
  const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;
  const fmtNum = (k, v) => (k === "d" ? String(v) : String(v).padStart(2, "0"));

  function calendarDiff(a, b) {
    let y = b.getFullYear() - a.getFullYear();
    let m = b.getMonth() - a.getMonth();
    let d = b.getDate() - a.getDate();
    if (d < 0) { m--; d += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    return { y, m, d };
  }

  function parts(now = new Date()) {
    const ms = Math.max(0, now - start);
    return {
      ms,
      d: Math.floor(ms / 864e5),
      h: Math.floor(ms / 36e5) % 24,
      m: Math.floor(ms / 6e4) % 60,
      s: Math.floor(ms / 1e3) % 60,
    };
  }

  function renderWords(now = new Date()) {
    const { y, m, d } = calendarDiff(start, now);
    const bits = [];
    if (y) bits.push(plural(y, "ano", "anos"));
    if (m) bits.push(plural(m, "mês", "meses"));
    if (d || !bits.length) bits.push(plural(d, "dia", "dias"));
    const txt = bits.length > 1 ? `${bits.slice(0, -1).join(", ")} e ${bits.at(-1)}` : bits[0];
    $("#counterHuman").innerHTML = `ou seja: <strong>${txt}</strong> de nós.`;

    // aniversário / mêsversário
    const special = $("#special");
    const months = y * 12 + m;
    if (now >= start && now.getDate() === start.getDate() && months > 0) {
      special.hidden = false;
      special.innerHTML = m === 0
        ? `Hoje é o nosso aniversário de namoro: ${plural(y, "ano", "anos")}!`
        : `Hoje é nosso mêsversário: ${plural(months, "mês", "meses")}!`;
    } else {
      special.hidden = true;
    }
  }

  function tick(bounce = true) {
    const now = new Date();
    const p = parts(now);
    for (const k of ["d", "h", "m", "s"]) {
      const v = fmtNum(k, p[k]);
      if (nums[k].textContent === v) continue;
      nums[k].textContent = v;
      if (bounce && !reduceMotion) {
        nums[k].classList.remove("tick");
        void nums[k].offsetWidth;
        nums[k].classList.add("tick");
      }
    }
    $("#beats").textContent = nf.format(Math.floor((p.ms / 1000) * 1.2)); // ~72 batidas por minuto
    if (p.s === 0) renderWords(now);
  }

  let clockOn = false;
  function startClock() {
    if (clockOn) return;
    clockOn = true;
    tick(false);
    setInterval(tick, 1000);
  }

  function countUp() {
    const { d, h, m, s } = parts();
    const o = { d: 0, h: 0, m: 0, s: 0 };
    gsap.to(o, {
      d, h, m, s,
      duration: 2.2,
      ease: "power3.out",
      onUpdate: () => { for (const k in o) if (nums[k]) nums[k].textContent = fmtNum(k, Math.round(o[k])); },
      onComplete: startClock,
    });
  }

  renderWords();
  $("#beats").textContent = nf.format(Math.floor((parts().ms / 1000) * 1.2));

  /* ===================================================================
     LIGHTBOX
     =================================================================== */
  const lightbox = (() => {
    const el = $("#lightbox");
    const img = $(".lb__img", el);
    const cap = $(".lb__cap", el);
    const count = $(".lb__count", el);
    const prev = $(".lb__prev", el);
    const next = $(".lb__next", el);
    let list = [];
    let i = 0;
    let lastFocus = null;
    let closing = false;

    function show(n, dir = 0) {
      i = (n + list.length) % list.length;
      const f = list[i];
      // o tamanho vem da proporção (--ar), não do arquivo: trocar miniatura -> foto grande não "pula"
      img.style.setProperty("--ar", f.w / f.h);
      img.alt = f.alt || "";
      // mostra a miniatura (já carregada) na hora e troca pela grande quando ela chegar
      img.src = f.thumb;
      const full = new Image();
      full.src = f.src;
      const swap = () => { if (list[i] === f && !el.hidden) img.src = f.src; };
      (full.decode ? full.decode() : Promise.resolve()).then(swap, swap);

      cap.textContent = f.legenda || "";
      count.textContent = `${i + 1} / ${list.length}`;
      prev.hidden = next.hidden = list.length < 2;
      if (dir && !reduceMotion) {
        img.animate(
          [{ opacity: 0, transform: `translateX(${dir * 60}px)` }, { opacity: 1, transform: "none" }],
          { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" }
        );
      }
      if (list.length > 1) new Image().src = list[(i + 1) % list.length].src;
    }

    function open(items, n) {
      list = items;
      lastFocus = document.activeElement;
      el.hidden = false;
      show(n);
      lenis?.stop();
      document.body.style.overflow = "hidden";
      if (!reduceMotion) {
        el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260 });
        img.animate(
          [{ transform: "scale(.9)", opacity: 0 }, { transform: "none", opacity: 1 }],
          { duration: 450, easing: "cubic-bezier(.2,.8,.2,1)" }
        );
      }
      $(".lb__close", el).focus();
    }

    function close() {
      if (el.hidden || closing) return;
      const finish = () => {
        el.hidden = true;
        closing = false;
        img.removeAttribute("src");
        lenis?.start();
        document.body.style.overflow = "";
        lastFocus?.focus?.({ preventScroll: true });
      };
      if (reduceMotion) return finish();
      closing = true;
      const a = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "ease-in", fill: "forwards" });
      a.onfinish = () => { finish(); a.cancel(); };
    }

    $(".lb__close", el).addEventListener("click", close);
    prev.addEventListener("click", () => show(i - 1, -1));
    next.addEventListener("click", () => show(i + 1, 1));
    el.addEventListener("click", (e) => {
      if (moved) return; // foi um arrastar, não um toque
      if (e.target === el || e.target.classList.contains("lb__figure")) close();
    });

    addEventListener("keydown", (e) => {
      if (el.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(i - 1, -1);
      else if (e.key === "ArrowRight") show(i + 1, 1);
      else if (e.key === "Tab") {
        const f = $$("button:not([hidden])", el);
        const idx = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(idx + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });

    // gestos: arrastar para os lados troca a foto, arrastar para baixo fecha.
    // A foto acompanha o dedo enquanto arrasta.
    let drag = null;
    let moved = false;
    img.addEventListener("dragstart", (e) => e.preventDefault());
    el.addEventListener("pointerdown", (e) => {
      if (!e.isPrimary || e.target.closest(".lb__btn")) return;
      drag = { x: e.clientX, y: e.clientY, dx: 0, dy: 0 };
      moved = false;
    });
    el.addEventListener("pointermove", (e) => {
      if (!drag || !e.isPrimary) return;
      drag.dx = e.clientX - drag.x;
      drag.dy = e.clientY - drag.y;
      if (!moved && Math.hypot(drag.dx, drag.dy) < 8) return;
      moved = true;
      el.classList.add("is-dragging");
      if (Math.abs(drag.dx) > Math.abs(drag.dy)) {
        img.style.transform = list.length > 1 ? `translateX(${drag.dx}px) rotate(${drag.dx / 45}deg)` : "";
      } else if (drag.dy > 0) {
        img.style.transform = `translateY(${drag.dy}px) scale(${1 - Math.min(drag.dy / 1200, 0.2)})`;
        el.style.backgroundColor = `rgba(5, 9, 34, ${Math.max(0.35, 0.96 - drag.dy / 500)})`;
      }
    });
    const endDrag = (e) => {
      if (!drag) return;
      const { dx, dy } = drag;
      drag = null;
      el.classList.remove("is-dragging");
      img.style.transform = "";
      el.style.backgroundColor = "";
      if (!moved || e.type === "pointercancel") return;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) && list.length > 1) show(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
      else if (dy > 110 && dy > Math.abs(dx)) close();
    };
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);

    return { open };
  })();

  $("#masonry").addEventListener("click", (e) => {
    const b = e.target.closest(".shot");
    if (b) lightbox.open(allFotos, +b.dataset.index);
  });
  $("#chapters").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-month]");
    if (b) lightbox.open(mesFotos(+b.dataset.month), +b.dataset.index);
  });

  /* ===================================================================
     MÚSICA (opcional)
     =================================================================== */
  if (D.musica) {
    const audio = $("#audio");
    const btn = $("#musicBtn");
    audio.src = D.musica;
    btn.hidden = false;
    const setOn = (on) => {
      btn.setAttribute("aria-pressed", String(on));
      btn.setAttribute("aria-label", on ? "Pausar nossa música" : "Tocar nossa música");
    };
    playMusic = () => audio.play().then(() => setOn(true)).catch(() => {});
    btn.addEventListener("click", () => {
      if (audio.paused) playMusic();
      else { audio.pause(); setOn(false); }
    });
  }

  /* ===================================================================
     NAVEGAÇÃO
     =================================================================== */
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const target = $(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -60, duration: 1.6 });
      else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    })
  );

  const topbar = $(".topbar");
  const onScroll = () => topbar.classList.toggle("is-scrolled", scrollY > 30);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // menu do topo: mostra só se couber entre a marca e os botões (depende da largura
  // do celular e de ter ou não o botão de música)
  const nav = $(".nav");
  const fitNav = () => {
    nav.hidden = false;
    const n = nav.getBoundingClientRect();
    const b = $(".brand").getBoundingClientRect();
    const a = $(".topbar__actions").getBoundingClientRect();
    // se não couber, o menu empurra os botões para fora da tela: por isso checa a.right também
    nav.hidden = n.left < b.right + 6 || n.right > a.left - 6 || a.right > topbar.clientWidth;
  };
  fitNav();
  addEventListener("resize", debounce(fitNav, 150));
  document.fonts?.ready.then(fitNav);

  /* ===================================================================
     ANIMAÇÕES DE SCROLL (GSAP + ScrollTrigger + Lenis)
     =================================================================== */
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  // ao girar o celular, remonta as colunas do álbum antes do ScrollTrigger medir tudo
  ScrollTrigger.addEventListener("refreshInit", layoutMasonry);

  if (!reduceMotion && typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  // barra de progresso
  gsap.to(".progress span", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

  // rabisco amarelo sob os títulos
  $$(".section-head").forEach((h) =>
    ScrollTrigger.create({ trigger: h, start: "top 80%", once: true, onEnter: () => h.classList.add("is-drawn") })
  );

  // o coraçãozinho de cada mês acende quando a linha chega nele
  $$(".chapter").forEach((ch) =>
    ScrollTrigger.create({
      trigger: $(".chapter__node", ch),
      start: "center 55%",
      onEnter: () => ch.classList.add("is-reached"),
      onLeaveBack: () => ch.classList.remove("is-reached"),
    })
  );

  if (reduceMotion) {
    startClock();
  } else {
    // ---------- hero (roda quando a carta abre) ----------
    heroIntro = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } })
      .from(".hero__heart", { scale: 0.55, opacity: 0, rotate: -10, duration: 1.4, ease: "elastic.out(1, .6)" })
      .from(".hero .eyebrow", { y: 20, opacity: 0, duration: 0.6 }, "<.1")
      .from(".names .c", { yPercent: 110, opacity: 0, rotate: 12, duration: 0.8, stagger: 0.035, ease: "back.out(1.8)" }, "<.1")
      .from(".names__amp", { scale: 0, rotate: -40, opacity: 0, duration: 0.9, ease: "back.out(3)" }, "<.3")
      .from(".hero__sub", { y: 20, opacity: 0, duration: 0.7 }, "-=.5")
      .from(".scroll-hint", { y: 20, opacity: 0, duration: 0.6 }, "-=.45")
      .from(".float-pol .polaroid__card", {
        scale: 0, opacity: 0, rotate: gsap.utils.wrap([-30, 30]), duration: 1, stagger: 0.15, ease: "back.out(1.6)",
      }, "-=1.1");

    const heroST = () => ({ trigger: ".hero", start: "top top", end: "bottom top", scrub: true });
    gsap.to(".hero__visual", { yPercent: 14, scale: 0.94, ease: "none", scrollTrigger: heroST() });
    gsap.to(".hero__copy", { yPercent: -10, ease: "none", scrollTrigger: heroST() });
    gsap.fromTo(".float-pol--a", { rotate: -10 }, { y: -90, rotate: -22, ease: "none", scrollTrigger: heroST() });
    gsap.fromTo(".float-pol--b", { rotate: 9 }, { y: -40, rotate: 20, ease: "none", scrollTrigger: heroST() });

    // ---------- faixas: aceleram com a velocidade do scroll ----------
    const loops = [
      gsap.to("#marqueeA", { xPercent: -50, duration: 38, ease: "none", repeat: -1 }),
      gsap.fromTo("#marqueeB", { xPercent: -50 }, { xPercent: 0, duration: 42, ease: "none", repeat: -1 }),
    ];
    let boost = 0;
    ScrollTrigger.create({
      trigger: ".marquee", start: "top bottom", end: "bottom top",
      onUpdate: (self) => { boost = Math.min(Math.abs(self.getVelocity()) / 250, 6); },
    });
    gsap.ticker.add(() => {
      boost *= 0.93;
      loops.forEach((l) => l.timeScale(1 + boost));
    });

    // ---------- contador ----------
    ScrollTrigger.create({ trigger: ".counter", start: "top 78%", once: true, onEnter: countUp });
    gsap.from(".counter__title", {
      scale: 0.7, opacity: 0, duration: 1.1, ease: "elastic.out(1, .6)",
      scrollTrigger: { trigger: ".counter", start: "top 80%" },
    });
    gsap.from(".clock__cell", {
      y: 50, opacity: 0, stagger: 0.1, duration: 0.8, ease: "back.out(1.6)",
      scrollTrigger: { trigger: ".clock", start: "top 88%" },
    });

    // ---------- títulos de seção ----------
    $$(".section-head").forEach((h) =>
      gsap.from(h.children, {
        y: 40, opacity: 0, stagger: 0.12, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: h, start: "top 82%" },
      })
    );

    // ---------- linha do tempo ----------
    const chaptersEl = $(".chapters");
    const lineST = () => ({ trigger: chaptersEl, start: "top 55%", end: "bottom 55%", scrub: 0.5 });
    gsap.to(".track__fill", { scaleY: 1, ease: "none", scrollTrigger: lineST() });
    gsap.to(".track__heart", {
      y: () => $(".track").offsetHeight,
      ease: "none",
      scrollTrigger: { ...lineST(), invalidateOnRefresh: true },
    });

    gsap.matchMedia().add({ desk: "(min-width: 821px)", mob: "(max-width: 820px)" }, (ctx) => {
      const { desk } = ctx.conditions;
      $$(".chapter").forEach((ch, i) => {
        const textSide = desk ? (i % 2 ? 1 : -1) : 1;
        const photoSide = desk ? -textSide : 1;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ch, start: "top 72%", toggleActions: "play none none reverse" },
        });
        tl.from($(".chapter__node", ch), { scale: 0, rotate: -90, duration: 0.6, ease: "back.out(3)" })
          .from($$(".chapter__text > :not(.chapter__num)", ch), {
            x: 50 * textSide, opacity: 0, stagger: 0.09, duration: 0.8, ease: "power3.out",
          }, "<.1")
          .from($$(".polaroid__card", ch), {
            x: 120 * photoSide, y: 80, scale: 0.6, opacity: 0,
            rotate: (k) => (k % 2 ? 1 : -1) * 25,
            stagger: 0.12, duration: 1.1, ease: "back.out(1.4)",
          }, "<.05");
        const more = $(".more", ch);
        if (more) tl.from(more, { scale: 0, opacity: 0, duration: 0.4, ease: "back.out(3)" }, "-=.3");

        gsap.fromTo($(".chapter__num", ch), { yPercent: 35 }, {
          yPercent: -35, ease: "none",
          scrollTrigger: { trigger: ch, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    });

    gsap.from(".end-heart", {
      scale: 0, rotate: -30, duration: 1.3, ease: "elastic.out(1, .5)",
      scrollTrigger: {
        trigger: ".timeline__end", start: "top 80%",
        onEnter: () => setTimeout(() => {
          const r = $(".end-heart").getBoundingClientRect();
          burst(r.left + r.width / 2, r.top + r.height / 2, 22, 1.2);
        }, 450),
      },
    });
    gsap.from(".timeline__end > :not(.end-heart)", {
      y: 30, opacity: 0, stagger: 0.1, duration: 0.8,
      scrollTrigger: { trigger: ".timeline__end", start: "top 75%" },
    });

    // ---------- galeria ----------
    gsap.set(".shot-wrap", { y: 80, opacity: 0, rotate: () => rand(-5, 5) });
    ScrollTrigger.batch(".shot-wrap", {
      start: "top 92%",
      onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, rotate: 0, stagger: 0.09, duration: 1, ease: "power3.out", overwrite: true }),
    });

    // ---------- carta: as palavras vão "se escrevendo" com o scroll ----------
    gsap.from(".paper", {
      y: 100, rotate: 4, opacity: 0, duration: 1.2, ease: "power3.out",
      scrollTrigger: { trigger: ".paper", start: "top 88%" },
    });
    gsap.from(".stamp", {
      scale: 2.6, rotate: -40, opacity: 0, duration: 0.55, ease: "power4.in",
      scrollTrigger: { trigger: ".paper", start: "top 55%" },
    });
    gsap.fromTo("#cartaBody .word", { opacity: 0.15 }, {
      opacity: 1, stagger: 0.1, ease: "none",
      scrollTrigger: { trigger: "#cartaBody", start: "top 85%", end: "bottom 80%", scrub: true },
    });
    gsap.from(".paper__sign", {
      y: 20, opacity: 0, duration: 1,
      scrollTrigger: { trigger: ".paper__sign", start: "top 88%" },
    });

    // ---------- final: as fotos voam e formam um coração ----------
    // Em telas altas a seção fica presa (pin) enquanto as fotos voam. Em telas baixas
    // (celular deitado) o conteúdo não caberia preso, então anima rolando normalmente.
    gsap.matchMedia().add({ tall: "(min-height: 620px)", short: "(max-height: 619.98px)" }, (ctx) => {
      const scrollTrigger = ctx.conditions.tall
        ? { trigger: ".finale", start: "top top", end: "+=140%", scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true }
        : { trigger: ".finale", start: "top 85%", end: "center 55%", scrub: 0.8, invalidateOnRefresh: true };
      gsap.timeline({ scrollTrigger })
        // fromTo (e não from): com invalidateOnRefresh, um from() gravaria o estado inicial como final
        .fromTo(".mosaic__tile", {
          x: () => rand(-0.6, 0.6) * innerWidth,
          y: () => rand(-0.7, 0.7) * innerHeight,
          rotate: () => rand(-220, 220),
          scale: 0.2,
          opacity: 0,
        }, {
          x: 0, y: 0, rotate: 0, scale: 1, opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: { each: 0.012, from: "random" },
        })
        .fromTo(".finale__text > *", { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.35 }, "-=.25");
    });
  }

  // botão final: a mensagem secreta entra no lugar do parágrafo
  let revealed = false;
  $("#loveBtn").addEventListener("click", (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 34, 1.6);
    rain(innerWidth < 600 ? 50 : 80);
    buzz([40, 90, 40, 90, 140]);
    if (!revealed) {
      revealed = true;
      const lead = $(".finale__lead");
      const secret = $("#secret");
      secret.textContent = D.final || "";
      lead.setAttribute("aria-hidden", "true");
      $(".love-btn span").textContent = "De novo!";
      if (reduceMotion) {
        lead.style.visibility = "hidden";
        secret.style.opacity = "1";
      } else {
        gsap.timeline()
          .to(lead, { y: -16, opacity: 0, duration: 0.35, ease: "power2.in" })
          .fromTo(secret, { y: 18, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.7)" }, "-=.05");
      }
    }
    if (!reduceMotion) {
      gsap.fromTo(".mosaic__tile", { scale: 1 }, {
        scale: 1.18, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out", stagger: { each: 0.02, from: "center" },
      });
    }
  });

  /* ===================================================================
     INTRO: ABRIR A CARTA
     =================================================================== */
  const outside = $$("main, .topbar, .footer");
  outside.forEach((el) => (el.inert = true));

  let opened = false;
  function openEnvelope() {
    if (opened) return;
    opened = true;
    const seal = $("#openBtn");
    const r = seal.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 26, 1.3);
    buzz(30);
    playMusic?.();

    const done = () => {
      $("#intro").remove();
      outside.forEach((el) => (el.inert = false));
      scrollTo(0, 0); // garante que ela começa do topo, mesmo se o navegador rolou por trás da carta
      document.body.classList.remove("is-locked");
      lenis?.start();
      heroIntro?.play();
      ScrollTrigger.refresh();
    };

    if (reduceMotion) {
      gsap.to("#intro", { opacity: 0, duration: 0.4, onComplete: done });
      return;
    }

    gsap.timeline({ onComplete: done })
      .to(seal, { scale: 0, rotate: 120, duration: 0.4, ease: "back.in(2)" })
      .to(".intro__hint", { opacity: 0, duration: 0.3 }, "<")
      .to(".envelope__flap", { rotateX: 180, duration: 0.7, ease: "power2.inOut" }, "-=.05")
      .set(".envelope__flap", { zIndex: 1 })
      .to(".letter", { yPercent: -58, duration: 0.9, ease: "power3.out" })
      .to(".envelope", { y: 30, scale: 0.92, opacity: 0, duration: 0.6, ease: "power2.in" }, "+=1")
      .to("#intro", { opacity: 0, duration: 0.6 }, "-=.25");
  }

  $("#openBtn").addEventListener("click", openEnvelope);
  $(".envelope").addEventListener("click", openEnvelope);
  $("#openBtn").focus({ preventScroll: true });

  // recalcula posições depois que fontes e imagens carregam
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  addEventListener("load", () => ScrollTrigger.refresh());
})();
