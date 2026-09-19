/* GSAP slide and process timelines; all source content remains readable without JS. */
(() => {
  "use strict";
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)];
  const slides = $$(".slide"),
    data = JSON.parse($("#deck-data").textContent),
    dialog = $("#dialog");
  const mobile = matchMedia("(max-width:800px)"),
    reduced = matchMedia("(prefers-reduced-motion:reduce)");
  let current = 0,
    reading = mobile.matches,
    transition = null,
    process = null,
    entry = null,
    observer = null,
    toastTimer;
  const esc = (s) =>
    String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  function scale() {
    const w = innerWidth - 40,
      h = innerHeight - 126;
    document.documentElement.style.setProperty("--scale", Math.min(w / 1600, h / 900));
  }
  function resetMotion() {
    transition?.kill();
    process?.kill();
    entry?.kill();
    if (window.gsap) gsap.set(slides, { clearProps: "opacity,visibility,transform" });
  }
  function finishContent(s) {
    if (!window.gsap) return;
    gsap.set(s.querySelectorAll(".flow-step,header,.slide-body>*,.engraving,.ornament-rule"), {
      clearProps: "opacity,visibility,transform",
    });
    gsap.set(s.querySelectorAll(".route"), {
      clearProps: "strokeDasharray,strokeDashoffset,opacity",
    });
  }
  function animateFlow(s) {
    process?.kill();
    const nodes = [...s.querySelectorAll(".flow-step")];
    const paths = [...s.querySelectorAll(".route")];
    if (!nodes.length || reading || reduced.matches || !window.gsap) {
      finishContent(s);
      return;
    }
    gsap.set(nodes, { autoAlpha: 1, x: 0, y: 0 });
    paths.forEach((p) => {
      const length = p.getTotalLength();
      gsap.set(p, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
    });
    process = gsap.timeline({ defaults: { duration: 0.42, ease: "power2.out" } });
    const kind = s.querySelector("[data-diagram]")?.dataset.diagram;
    if (s.querySelector("[data-parallel]")) {
      paths.forEach((p, i) =>
        process.to(p, { strokeDashoffset: 0, duration: 0.65, ease: "power1.inOut" }, i * 0.08),
      );
      process.fromTo(nodes, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, stagger: 0.11 }, 0.36);
    } else {
      nodes.forEach((node, i) => {
        const t = i * 0.58;
        const dy = kind === "up" ? 20 : kind === "cycle" ? (i === 0 ? -12 : i === 2 ? 12 : 0) : 14;
        const dx = kind === "cycle" ? (i === 1 ? 15 : i === 3 ? -15 : 0) : 0;
        process.fromTo(node, { autoAlpha: 0, x: dx, y: dy }, { autoAlpha: 1, x: 0, y: 0 }, t);
        if (paths[i])
          process.to(
            paths[i],
            { strokeDashoffset: 0, duration: 0.54, ease: "power1.inOut" },
            t + 0.18,
          );
      });
    }
  }
  function animateEntry(s) {
    entry?.kill();
    finishContent(s);
    if (reading || reduced.matches || !window.gsap) return;
    const heading = s.querySelector("header");
    const body = [...s.querySelectorAll(".slide-body> :not(.flow-wrap)")];
    entry = gsap.timeline({ defaults: { duration: 0.65, ease: "power2.out" } });
    if (heading) entry.fromTo(heading, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0 }, 0);
    if (body.length)
      entry.fromTo(body, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, stagger: 0.06 }, 0.1);
    const rules = [...s.querySelectorAll(".ornament-rule")];
    if (rules.length)
      entry.fromTo(
        rules,
        { scaleX: 0.7, autoAlpha: 0 },
        { scaleX: 1, autoAlpha: 1, stagger: 0.08 },
        0.25,
      );
    animateFlow(s);
  }
  function updateUI() {
    const n = current + 1;
    $("#counter").value = `${n} / ${slides.length}`;
    $("#prev").disabled = current === 0;
    $("#next").disabled = current === slides.length - 1;
    $("#progress").style.transform = `scaleX(${n / slides.length})`;
    document.title = `${String(n).padStart(2, "0")} · ${data.slides[current].title}｜無國界的遊牧`;
  }
  function hash(n) {
    history.replaceState(null, "", "#" + (n + 1));
  }
  function show(n, { fromHash = false, scroll = true } = {}) {
    n = Math.max(0, Math.min(slides.length - 1, Number(n) || 0));
    const old = slides[current],
      next = slides[n];
    const direction = n >= current ? 1 : -1;
    resetMotion();
    finishContent(old);
    slides.forEach((s, i) => {
      s.classList.toggle("active", i === n);
      s.inert = !reading && i !== n;
      if (reading) s.removeAttribute("aria-hidden");
      else s.setAttribute("aria-hidden", String(i !== n));
    });
    current = n;
    updateUI();
    if (!fromHash) hash(n);
    if (reading) {
      if (scroll)
        next.scrollIntoView({ behavior: reduced.matches ? "instant" : "smooth", block: "start" });
      return;
    }
    if (!reduced.matches && window.gsap && old !== next) {
      transition = gsap.fromTo(
        next,
        { autoAlpha: 0, x: n % 2 ? direction * 18 : 0, y: n % 2 ? 0 : direction * 14 },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          clearProps: "opacity,visibility,transform",
        },
      );
    }
    animateEntry(next);
    // Move focus away from controls or links in an outgoing, now inert slide.
    if (old !== next && old.contains(document.activeElement))
      $("#stage").focus({ preventScroll: true });
  }
  function setReading(value) {
    resetMotion();
    reading = value;
    document.body.classList.toggle("reading", reading);
    document.body.classList.toggle("stage", !reading);
    $("#reading").setAttribute("aria-pressed", String(reading));
    $("#reading").textContent = reading ? "投影 R" : "閱讀 R";
    slides.forEach(finishContent);
    observer?.disconnect();
    show(current, { scroll: false });
    scale();
    if (reading) {
      observer = new IntersectionObserver(
        (entries) => {
          if (dialog.open) return;
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible.length) {
            current = Number(visible[0].target.dataset.slide) - 1;
            updateUI();
            hash(current);
          }
        },
        { rootMargin: "-15% 0px -45% 0px", threshold: [0, 0.1, 0.3, 0.5] },
      );
      slides.forEach((s) => observer.observe(s));
      slides[current].scrollIntoView({ block: "start" });
    }
  }
  function open(title, html, cls = "") {
    dialog.className = cls;
    $("#dialog-title").textContent = title;
    $("#dialog-content").innerHTML = html;
    if (!dialog.open) dialog.showModal();
    $("#dialog-close").focus();
  }
  function sourceHTML(id) {
    const s = data.sources[id];
    return `<div class="source-entry"><p>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a>` : esc(s.title)}</p><small>${esc(s.detail)}</small></div>`;
  }
  function index() {
    open(
      "目錄 · 43 頁",
      `<ul class="index-list">${data.slides.map((s, i) => `<li><button data-go="${i}"><span>${String(i + 1).padStart(2, "0")}</span>${esc(s.title)}</button></li>`).join("")}</ul><p><a href="sources.html">完整來源與圖像說明 ↗</a></p>`,
    );
  }
  function notes() {
    const s = data.slides[current];
    open(
      `講者筆記 · ${current + 1} · ${s.title}`,
      `<p>${esc(s.notes || "本頁沿投影片內容展開。")}</p>${s.sources.map(sourceHTML).join("")}`,
    );
  }
  function toast(message) {
    clearTimeout(toastTimer);
    $("#toast").textContent = message;
    $("#toast").style.display = "block";
    toastTimer = setTimeout(() => ($("#toast").style.display = "none"), 5000);
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen)
        await document.documentElement.requestFullscreen();
      else toast("此瀏覽器未提供網頁全螢幕，可使用瀏覽器的全螢幕功能。");
    } catch {
      toast("全螢幕未能開啟，可使用瀏覽器的全螢幕功能。");
    }
  }
  $("#prev").onclick = () => show(current - 1);
  $("#next").onclick = () => show(current + 1);
  $("#reading").onclick = () => {
    if (reading && mobile.matches) {
      toast("手機採用直式閱讀，橫向或加寬視窗後可切換投影。");
      return;
    }
    setReading(!reading);
  };
  $("#fullscreen").onclick = fullscreen;
  $("#notes").onclick = notes;
  $("#index-button").onclick = index;
  $("#dialog-close").onclick = () => dialog.close();
  $("#help").onclick = () =>
    open(
      "操作與閱讀",
      `<p>← → 或空白鍵：換頁<br>Home / End：第一頁／最後一頁<br>G：目錄　N：講者筆記<br>R：閱讀／投影　F：全螢幕<br>Esc：關閉註解或視窗</p><p>點有「註」的詞語讀解釋；點圖片可放大。流程會依序出現，可按「重播流程」。手機自動採用閱讀模式。</p><p><a href="sources.html">來源、圖像授權歸屬與番外篇頁碼對照 ↗</a></p>`,
    );
  document.addEventListener("click", (e) => {
    const t = e.target.closest(
      '[data-term],[data-source-slide],[data-go],[data-replay],[data-image],a[href^="#"]',
    );
    if (!t) return;
    if (t.dataset.term) {
      const [title, text, source] = data.terms[t.dataset.term];
      open(title, `<p>${esc(text)}</p>${sourceHTML(source)}`);
    } else if (t.dataset.sourceSlide) {
      const s = data.slides[Number(t.dataset.sourceSlide) - 1];
      open(
        "來源與延伸 · " + s.title,
        s.sources.map(sourceHTML).join("") + '<p><a href="sources.html">完整來源目錄 ↗</a></p>',
      );
    } else if (t.dataset.go !== undefined) {
      dialog.close();
      show(Number(t.dataset.go));
    } else if (t.hasAttribute("data-replay")) animateFlow(t.closest(".slide"));
    else if (t.dataset.image)
      open(
        "圖像",
        `<img src="${esc(t.dataset.image)}" alt="${esc(t.dataset.caption)}"><p><small>${esc(t.dataset.caption)}</small></p>`,
        "image-dialog",
      );
    else if (t.hash && /^#\d+$/.test(t.hash)) {
      e.preventDefault();
      show(Number(t.hash.slice(1)) - 1);
    }
  });
  dialog.addEventListener("click", (e) => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
      dialog.close();
  });
  document.addEventListener("keydown", (e) => {
    if (
      dialog.open ||
      e.altKey ||
      e.ctrlKey ||
      e.metaKey ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)
    )
      return;
    const key = e.key.toLowerCase();
    if (e.target.closest("button,a") && [" ", "enter"].includes(key)) return;
    if (["arrowright", "pagedown"].includes(key) || (!reading && key === " ")) {
      e.preventDefault();
      show(current + 1);
    } else if (["arrowleft", "pageup"].includes(key)) {
      e.preventDefault();
      show(current - 1);
    } else if (key === "home") {
      e.preventDefault();
      show(0);
    } else if (key === "end") {
      e.preventDefault();
      show(slides.length - 1);
    } else if (key === "g") {
      e.preventDefault();
      index();
    } else if (key === "n") {
      e.preventDefault();
      notes();
    } else if (key === "f") {
      e.preventDefault();
      fullscreen();
    } else if (key === "r") {
      e.preventDefault();
      $("#reading").click();
    }
  });
  let touch = null;
  $("#stage").addEventListener(
    "touchstart",
    (e) => {
      if (reading || e.target.closest("button,a")) return;
      touch = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    },
    { passive: true },
  );
  $("#stage").addEventListener(
    "touchend",
    (e) => {
      if (!touch || reading) return;
      const dx = e.changedTouches[0].clientX - touch.x,
        dy = e.changedTouches[0].clientY - touch.y;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
      touch = null;
    },
    { passive: true },
  );
  addEventListener("hashchange", () =>
    show(Number(location.hash.slice(1)) - 1, { fromHash: true }),
  );
  addEventListener("resize", scale);
  document.addEventListener("fullscreenchange", () => {
    $("#fullscreen").textContent = document.fullscreenElement ? "離開全螢幕 F" : "全螢幕 F";
    scale();
  });
  mobile.addEventListener("change", () => setReading(mobile.matches));
  reduced.addEventListener("change", () => {
    resetMotion();
    slides.forEach(finishContent);
    show(current, { scroll: false });
  });
  current = Math.max(0, Math.min(slides.length - 1, (Number(location.hash.slice(1)) || 1) - 1));
  setReading(reading);
  window.nomadDeck = {
    get current() {
      return current + 1;
    },
    get reading() {
      return reading;
    },
    show: (n) => show(n - 1),
  };
})();
