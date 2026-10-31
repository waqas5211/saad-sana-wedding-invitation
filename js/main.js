/* =========================================================
   Wedding Invitation — shared behaviour
   Each page sets window.INVITE (date, venue, RSVP number…)
   ========================================================= */
(function () {
  "use strict";

  const CFG = window.INVITE || {};
  const TZ = "Asia/Karachi";
  const SVGNS = "http://www.w3.org/2000/svg";
  const eventDate = new Date(CFG.date);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ---------- SVG sprite (lantern, icons, ornaments) ---------- */
  const sprite = `
  <svg xmlns="${SVGNS}" style="display:none">
    <symbol id="i-lantern" viewBox="0 0 40 100">
      <line x1="20" y1="0" x2="20" y2="22" stroke="currentColor" stroke-width="1"/>
      <path d="M12 30 L20 21 L28 30Z" fill="currentColor"/>
      <g class="glow"><path d="M10 30H30L33 39V65L30 74H10L7 65V39Z" fill="#ffe3a1" fill-opacity=".85"/></g>
      <path d="M10 30H30L33 39V65L30 74H10L7 65V39Z" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <path d="M20 30V74M7 39H33M7 65H33M13.5 30V74M26.5 30V74" stroke="currentColor" stroke-width=".7" opacity=".7"/>
      <path d="M13 74 L20 84 L27 74Z" fill="currentColor"/>
      <line x1="20" y1="84" x2="20" y2="98" stroke="currentColor" stroke-width="1.2"/>
      <circle cx="20" cy="98" r="1.6" fill="currentColor"/>
    </symbol>
    <symbol id="i-orn" viewBox="0 0 24 24">
      <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" fill="currentColor" opacity=".9"/>
      <circle cx="12" cy="12" r="2" fill="var(--paper)"/>
    </symbol>
    <symbol id="i-guests" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.5 2.7-6.2 6-6.2s6 2.7 6 6.2"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.2c3 0 5.5 2.2 5.5 5.8"/></symbol>
    <symbol id="i-ring" viewBox="0 0 24 24"><circle cx="12" cy="15" r="6"/><path d="M9.2 6.2 12 3l2.8 3.2L12 9z"/></symbol>
    <symbol id="i-music" viewBox="0 0 24 24"><path d="M9 18V5.5l11-2.2v12.5"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="15.8" r="2.5"/></symbol>
    <symbol id="i-dinner" viewBox="0 0 24 24"><path d="M5 3v7a2.5 2.5 0 0 0 5 0V3M7.5 3v18M17.5 21V3c-2.2 1.2-3.5 4-3.5 8h3.5"/></symbol>
    <symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20z"/></symbol>
    <symbol id="i-leaf" viewBox="0 0 24 24"><path d="M5 19C5 10.5 11 4.5 19.5 4.5 19.5 13 13.5 19 5 19z"/><path d="M5 19l9-9M9.5 14.5h3.5M12 12V8.8"/></symbol>
    <symbol id="i-drum" viewBox="0 0 24 24"><ellipse cx="12" cy="7" rx="8" ry="3"/><path d="M4 7v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7M4 10l16 7M20 10L4 17"/></symbol>
    <symbol id="i-car" viewBox="0 0 24 24"><path d="M3 16v-3.5L5.5 7h13L21 12.5V16zM3 16v2.5h3V16M18 16v2.5h3V16M3 12.5h18"/><circle cx="7" cy="14.3" r=".8"/><circle cx="17" cy="14.3" r=".8"/></symbol>
    <symbol id="i-cal" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8"/></symbol>
    <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21.5s-7-6.2-7-11.5a7 7 0 0 1 14 0c0 5.3-7 11.5-7 11.5z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.5" fill="currentColor"/></symbol>
    <symbol id="i-wa" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.2-.5-.3z"/></symbol>
    <symbol id="i-play" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></symbol>
    <symbol id="i-pause" viewBox="0 0 24 24"><path fill="currentColor" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></symbol>
    <symbol id="i-down" viewBox="0 0 24 24"><path d="M5 9l7 7 7-7" fill="none" stroke="currentColor" stroke-width="1.6"/></symbol>
  </svg>`;
  document.body.insertAdjacentHTML("afterbegin", sprite);

  /* ---------- Mandala generator ---------- */
  function mandala() {
    const c = 100;
    let s = `<svg viewBox="0 0 200 200" xmlns="${SVGNS}" fill="none" stroke="currentColor" stroke-width=".7">`;
    s += `<circle cx="${c}" cy="${c}" r="8"/><circle cx="${c}" cy="${c}" r="20"/>`;
    for (let i = 0; i < 8; i++) s += `<ellipse cx="${c}" cy="${c - 31}" rx="5.5" ry="11" transform="rotate(${i * 45} ${c} ${c})"/>`;
    s += `<circle cx="${c}" cy="${c}" r="44"/>`;
    for (let i = 0; i < 16; i++) {
      const a = i * 22.5;
      s += `<path d="M${c} ${c - 44} C${c - 8} ${c - 54} ${c - 5} ${c - 66} ${c} ${c - 72} C${c + 5} ${c - 66} ${c + 8} ${c - 54} ${c} ${c - 44}Z" transform="rotate(${a} ${c} ${c})"/>`;
      s += `<path d="M${c} ${c - 50} L${c} ${c - 64}" transform="rotate(${a} ${c} ${c})" opacity=".6"/>`;
    }
    for (let i = 0; i < 32; i++) {
      const a = (i * 11.25 * Math.PI) / 180;
      s += `<circle cx="${(c + 78 * Math.sin(a)).toFixed(2)}" cy="${(c - 78 * Math.cos(a)).toFixed(2)}" r="1.6" fill="currentColor"/>`;
    }
    for (let i = 0; i < 24; i++) {
      s += `<path d="M${c - 6} ${c - 86} Q${c} ${c - 97} ${c + 6} ${c - 86}" transform="rotate(${i * 15} ${c} ${c})"/>`;
    }
    s += `<circle cx="${c}" cy="${c}" r="86"/><circle cx="${c}" cy="${c}" r="98" stroke-dasharray="1 3"/></svg>`;
    return s;
  }
  $$("[data-mandala]").forEach((el) => (el.innerHTML = mandala()));

  /* ---------- Wax seal with an irregular, poured edge ---------- */
  function waxSeal() {
    const pts = [];
    for (let i = 0; i <= 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      const r = 46 + 1.8 * Math.sin(a * 9) + 1.2 * Math.sin(a * 5 + 1) + 0.8 * Math.sin(a * 13 + 2);
      pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
    }
    return `<svg viewBox="0 0 100 100" xmlns="${SVGNS}">
      <defs>
        <radialGradient id="wax" cx=".38" cy=".32" r=".75">
          <stop offset="0" stop-color="#fffdf6"/><stop offset=".55" stop-color="#f4ead6"/><stop offset="1" stop-color="#ddc9a2"/>
        </radialGradient>
        <radialGradient id="waxIn" cx=".5" cy=".5" r=".5">
          <stop offset=".8" stop-color="#f1e5cc"/><stop offset="1" stop-color="#e2d0ab"/>
        </radialGradient>
      </defs>
      <polygon points="${pts.join(" ")}" fill="url(#wax)" stroke="#d8c39a" stroke-width=".6"/>
      <circle cx="50" cy="50" r="33" fill="url(#waxIn)" stroke="#fffaf0" stroke-width="1.2"/>
      <circle cx="50" cy="50" r="33" fill="none" stroke="#cdb487" stroke-width=".5" transform="translate(.5 .6)"/>
      <circle cx="50" cy="50" r="29" fill="none" stroke="#d6c197" stroke-width=".5" stroke-dasharray="1 2"/>
    </svg>`;
  }
  $$(".seal[data-wax]").forEach((el) => el.insertAdjacentHTML("afterbegin", waxSeal()));

  /* ---------- Floral corner cluster ---------- */
  function rose(cx, cy, r) {
    let g = "";
    const layers = [
      { n: 6, d: 0.55, rx: 0.42, ry: 0.55, fill: "var(--petal3)" },
      { n: 6, d: 0.38, rx: 0.36, ry: 0.46, fill: "var(--petal)" },
      { n: 5, d: 0.2, rx: 0.3, ry: 0.36, fill: "var(--petal2)" },
    ];
    layers.forEach((L, li) => {
      for (let i = 0; i < L.n; i++) {
        const a = (360 / L.n) * i + li * 17;
        g += `<ellipse cx="${cx}" cy="${cy - r * L.d}" rx="${r * L.rx}" ry="${r * L.ry}" fill="${L.fill}" stroke="var(--gold-light)" stroke-width=".8" transform="rotate(${a} ${cx} ${cy})"/>`;
      }
    });
    g += `<circle cx="${cx}" cy="${cy}" r="${r * 0.16}" fill="var(--gold)"/>`;
    return g;
  }
  function leaf(x, y, len, rot) {
    return `<ellipse cx="${x}" cy="${y - len / 2}" rx="${len * 0.22}" ry="${len / 2}" fill="var(--leaf)" opacity=".85" transform="rotate(${rot} ${x} ${y})"/>`;
  }
  function floraCluster() {
    let s = `<svg viewBox="0 0 200 200" xmlns="${SVGNS}">`;
    s += `<path d="M-10 20 C60 10 120 30 190 60" fill="none" stroke="var(--leaf)" stroke-width="1.5"/>`;
    s += `<path d="M20 -10 C10 60 30 120 60 190" fill="none" stroke="var(--leaf)" stroke-width="1.5"/>`;
    [[150, 46, 18, 60], [175, 58, 14, 110], [120, 30, 16, 20], [48, 150, 18, -60], [58, 178, 14, -110], [28, 120, 16, -20], [92, 58, 16, 140], [62, 95, 16, -130]]
      .forEach((l) => (s += leaf(...l)));
    s += rose(48, 48, 40) + rose(116, 36, 26) + rose(34, 112, 24) + rose(160, 62, 14) + rose(64, 162, 13);
    [[185, 70], [72, 186], [96, 22], [18, 88]].forEach(([x, y]) => (s += `<circle cx="${x}" cy="${y}" r="4" fill="var(--petal2)" stroke="var(--gold-light)" stroke-width=".6"/>`));
    return s + "</svg>";
  }
  $$("[data-flora]").forEach((el) => (el.innerHTML = floraCluster()));

  /* ---------- Marigold garlands (Mehndi) ---------- */
  $$("[data-garlands]").forEach((wrap) => {
    const n = window.innerWidth < 380 ? 9 : 11;
    for (let i = 0; i < n; i++) {
      const g = document.createElement("div");
      g.className = "garland";
      const t = Math.abs(i - (n - 1) / 2) / ((n - 1) / 2); // 0 center → 1 edges
      const count = Math.round(5 + t * 11);
      g.style.left = `calc(${(i / (n - 1)) * 100}% - 7px)`;
      g.style.animationDelay = `${-rand(0, 5)}s`;
      g.innerHTML = "<i></i>".repeat(count) + "<b></b>";
      wrap.appendChild(g);
    }
  });
  $$("[data-swag]").forEach((wrap) => {
    let s = `<svg viewBox="0 0 400 120" preserveAspectRatio="none" xmlns="${SVGNS}" style="width:100%;height:100%">
      <defs><radialGradient id="mg" cx=".4" cy=".35"><stop offset="0" stop-color="#ffe08a"/><stop offset=".55" stop-color="#f59e0b"/><stop offset="1" stop-color="#c2410c"/></radialGradient>
      <radialGradient id="yg" cx=".4" cy=".35"><stop offset="0" stop-color="#fff3b0"/><stop offset=".55" stop-color="#facc15"/><stop offset="1" stop-color="#ca8a04"/></radialGradient></defs>`;
    const swags = [[0, 140, 70], [130, 270, 90], [260, 400, 70]];
    swags.forEach(([x0, x1, sag]) => {
      for (let k = 0; k <= 16; k++) {
        const t = k / 16;
        const x = x0 + (x1 - x0) * t;
        const y = 6 + 4 * sag * t * (1 - t);
        s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="url(#${k % 3 ? "mg" : "yg"})"/>`;
      }
    });
    wrap.innerHTML = s + "</svg>";
  });

  /* ---------- Date formatting (Pakistan time) ---------- */
  const fmt = (opts) => new Intl.DateTimeFormat("en-GB", { timeZone: TZ, ...opts }).format(eventDate);
  const dayNum = Number(fmt({ day: "numeric" }));
  const ordinal = (n) => n + (n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th");
  const parts = {
    day: String(dayNum).padStart(2, "0"),
    month: fmt({ month: "long" }),
    year: fmt({ year: "numeric" }),
    weekday: fmt({ weekday: "long" }),
    time: new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" }).format(eventDate),
  };
  $$("[data-date-long]").forEach((el) => (el.textContent = `${parts.weekday}, ${ordinal(dayNum)} ${parts.month} ${parts.year}`));
  $$("[data-date-short]").forEach((el) => (el.textContent = `${parts.day} · ${fmt({ month: "2-digit" })} · ${parts.year}`));
  $$("[data-weekday]").forEach((el) => (el.textContent = parts.weekday));
  $$("[data-time]").forEach((el) => (el.textContent = parts.time));

  /* ---------- Venue + map + calendar ---------- */
  const v = CFG.venue || {};
  $$("[data-venue-name]").forEach((el) => (el.textContent = v.name || ""));
  $$("[data-venue-address]").forEach((el) => (el.textContent = v.address || ""));
  const mapQ = encodeURIComponent(v.mapQuery || `${v.name || ""} ${v.address || ""}`);
  const mapBox = $("#map");
  if (mapBox) {
    // Load the map only when it scrolls near, to keep the first paint fast.
    new IntersectionObserver((entries, obs) => {
      if (!entries[0].isIntersecting) return;
      mapBox.innerHTML = `<iframe loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Venue map"
        src="https://maps.google.com/maps?q=${mapQ}&z=15&output=embed"></iframe>`;
      obs.disconnect();
    }, { rootMargin: "300px" }).observe(mapBox);
  }
  $$("[data-directions]").forEach((a) => (a.href = v.mapsLink || `https://www.google.com/maps/dir/?api=1&destination=${mapQ}`));

  const toCal = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const end = new Date(eventDate.getTime() + (CFG.durationHours || 4) * 3600e3);
  $$("[data-calendar]").forEach((a) => {
    a.href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent(CFG.title || "Wedding")}` +
      `&dates=${toCal(eventDate)}/${toCal(end)}` +
      `&location=${encodeURIComponent([v.name, v.address].filter(Boolean).join(", "))}` +
      `&details=${encodeURIComponent(CFG.calendarNote || "")}`;
  });

  /* ---------- Music ---------- */
  const audio = $("#bgm");
  const musicBtn = $("#musicBtn");
  function setMusicIcon() {
    if (!musicBtn) return;
    const playing = audio && !audio.paused;
    musicBtn.classList.toggle("playing", playing);
    musicBtn.innerHTML = `<svg><use href="#i-${playing ? "pause" : "play"}"/></svg>`;
    musicBtn.setAttribute("aria-label", playing ? "Pause music" : "Play music");
  }
  if (audio && musicBtn) {
    audio.volume = 0.6;
    audio.addEventListener("canplay", () => musicBtn.classList.add("ready"), { once: true });
    audio.addEventListener("play", setMusicIcon);
    audio.addEventListener("pause", setMusicIcon);
    musicBtn.addEventListener("click", () => (audio.paused ? audio.play().catch(() => {}) : audio.pause()));
    setMusicIcon();
  }

  /* ---------- Reveal on scroll ---------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  function startReveals() { $$(".reveal").forEach((el) => revealObs.observe(el)); }

  /* ---------- Falling petals ---------- */
  function startPetals() {
    const box = document.createElement("div");
    box.className = "petals";
    const n = window.innerWidth < 500 ? 16 : 24;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span");
      const r = Math.random();
      p.className = "petal" + (r < 0.3 ? " spark" : r < 0.55 ? " alt" : "");
      p.style.left = rand(0, 100) + "vw";
      p.style.animationDuration = rand(11, 20) + "s";
      p.style.animationDelay = -rand(0, 20) + "s";
      p.style.scale = rand(0.6, 1.2).toFixed(2);
      box.appendChild(p);
    }
    document.body.appendChild(box);
  }

  /* ---------- Confetti ---------- */
  function confetti() {
    let cv = $("#confetti");
    if (!cv) { cv = document.createElement("canvas"); cv.id = "confetti"; document.body.appendChild(cv); }
    const ctx = cv.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);
    const colors = CFG.confetti || ["#c39b4a", "#ead6a4", "#94712c", "#fff3c8", "#e7c98f"];
    const ps = Array.from({ length: 140 }, () => ({
      x: innerWidth / 2 + rand(-40, 40), y: innerHeight * 0.45,
      vx: rand(-7, 7), vy: rand(-13, -4),
      w: rand(5, 9), h: rand(8, 14), r: rand(0, 6), vr: rand(-0.2, 0.2),
      c: colors[(Math.random() * colors.length) | 0],
    }));
    const t0 = performance.now();
    (function frame(t) {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ps.forEach((p) => {
        p.vy += 0.28; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)));
        ctx.restore();
      });
      if (t - t0 < 4000) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })(t0);
  }

  /* ---------- Scratch to reveal ---------- */
  const scratchCards = $$(".scratch");
  let revealedCount = 0;
  scratchCards.forEach((card) => {
    const key = card.dataset.part;
    const val = card.querySelector(".val");
    val.textContent = parts[key] || "";
    if (key === "month" && parts.month.length > 5) val.classList.add("small");

    const cv = document.createElement("canvas");
    card.appendChild(cv);
    const ctx = cv.getContext("2d");
    let w, h, drawing = false, last = null, done = false, moves = 0;

    function paint() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = card.clientWidth; h = card.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cs = getComputedStyle(document.body);
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, cs.getPropertyValue("--gold-deep").trim());
      g.addColorStop(0.45, cs.getPropertyValue("--gold-light").trim());
      g.addColorStop(0.6, cs.getPropertyValue("--gold").trim());
      g.addColorStop(1, cs.getPropertyValue("--gold-deep").trim());
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 60; i++) { // glitter
        ctx.fillStyle = `rgba(255,255,255,${rand(0.15, 0.6)})`;
        ctx.beginPath(); ctx.arc(rand(0, w), rand(0, h), rand(0.4, 1.4), 0, 7); ctx.fill();
      }
      ctx.fillStyle = "rgba(255,255,255,.9)";
      ctx.font = `600 ${Math.max(9, w * 0.1)}px Cinzel, serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("✦", w / 2, h / 2 - h * 0.1);
      ctx.fillText("SCRATCH", w / 2, h / 2 + h * 0.12);
    }
    function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    function scratch(p) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = Math.max(22, w * 0.26); ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo((last || p).x, (last || p).y); ctx.lineTo(p.x + 0.1, p.y + 0.1);
      ctx.stroke();
      last = p;
      if (++moves % 6 === 0) check();
    }
    function check() {
      const data = ctx.getImageData(0, 0, cv.width, cv.height).data;
      let clear = 0, total = 0;
      for (let i = 3; i < data.length; i += 64) { total++; if (data[i] < 40) clear++; }
      if (clear / total > 0.45) finish();
    }
    function finish() {
      if (done) return;
      done = true; card.classList.add("cleared");
      if (navigator.vibrate) navigator.vibrate(25);
      if (++revealedCount === scratchCards.length) {
        confetti();
        $$(".date-extra").forEach((el) => el.classList.add("show"));
      }
    }
    cv.addEventListener("pointerdown", (e) => { drawing = true; last = null; cv.setPointerCapture(e.pointerId); scratch(pos(e)); });
    cv.addEventListener("pointermove", (e) => drawing && scratch(pos(e)));
    const stop = () => { if (drawing) { drawing = false; check(); } };
    cv.addEventListener("pointerup", stop);
    cv.addEventListener("pointercancel", stop);
    // Keyboard / accessibility fallback
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Reveal the ${key}`);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); finish(); } });

    (document.fonts ? document.fonts.ready : Promise.resolve()).then(paint);
    let lastW = 0;
    new ResizeObserver(() => { if (!done && card.clientWidth !== lastW) { lastW = card.clientWidth; paint(); } }).observe(card);
  });

  /* ---------- Countdown ---------- */
  const cd = $("#countdown");
  if (cd) {
    const cells = { d: $("[data-cd=d]", cd), h: $("[data-cd=h]", cd), m: $("[data-cd=m]", cd), s: $("[data-cd=s]", cd) };
    const tick = () => {
      const diff = eventDate - Date.now();
      if (diff <= 0) {
        const over = Date.now() > end.getTime();
        cd.outerHTML = `<p class="count-done">${over ? "Thank you for celebrating with us" : "Today is the day!"}</p>`;
        clearInterval(timer);
        return;
      }
      const s = Math.floor(diff / 1000);
      cells.d.textContent = Math.floor(s / 86400);
      cells.h.textContent = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
      cells.m.textContent = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
      cells.s.textContent = String(s % 60).padStart(2, "0");
    };
    const timer = setInterval(tick, 1000);
    tick();
  }

  /* ---------- RSVP via WhatsApp ---------- */
  const form = $("#rsvpForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = (fd.get("name") || "").toString().trim();
      if (!name) { form.name.focus(); return; }
      const coming = fd.get("attending") === "yes";
      const guests = (fd.get("guests") || "1").toString();
      const note = (fd.get("message") || "").toString().trim();
      let msg = `Assalam-o-Alaikum! RSVP for ${CFG.title}\n\nName: ${name}\n` +
        (coming ? `Attending: Yes, InshaAllah\nGuests: ${guests}` : "Attending: Sorry, can't make it");
      if (note) msg += `\nMessage: ${note}`;
      const phone = (CFG.rsvpPhone || "").replace(/\D/g, "");
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    });
    const guestsWrap = $("#guestsWrap");
    form.addEventListener("change", () => {
      if (guestsWrap) guestsWrap.style.display = form.attending.value === "no" ? "none" : "";
    });
  }

  /* ---------- Intro (envelope / doors) ---------- */
  const intro = $("#intro");
  function openInvite() {
    if (!intro || intro.classList.contains("opening")) return;
    const total = CFG.introMs || 2100;
    intro.classList.add("opening");
    if (audio) audio.play().catch(() => {});
    // Envelope stages: flaps part and light leaks through (peek), then glide away (open)
    setTimeout(() => intro.classList.add("peek"), 450);
    setTimeout(() => { intro.classList.add("open"); startReveals(); }, total - 1150);
    setTimeout(() => {
      intro.classList.add("done");
      document.body.classList.remove("locked");
      startReveals();
      startPetals();
    }, total);
    setTimeout(() => intro.remove(), total + 1200);
  }
  if (intro) {
    document.body.classList.add("locked");
    intro.addEventListener("click", openInvite);
    intro.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") openInvite(); });
  } else {
    startReveals();
    startPetals();
  }
})();
