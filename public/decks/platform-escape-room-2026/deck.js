(() => {
  "use strict";

  const slides = [...document.querySelectorAll(".slide")];
  const currentEl = document.getElementById("current-slide");
  const progressEl = document.getElementById("progress-fill");
  const notesPanel = document.getElementById("notes-panel");
  const notesBody = document.getElementById("notes-body");
  const timelines = new Map();
  let currentIndex = 0;
  let transition = null;
  let reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let touchStartX = 0;

  const clamp = (n) => Math.max(0, Math.min(slides.length - 1, n));

  function requestedIndex() {
    const query = new URLSearchParams(location.search).get("slide");
    const hash = location.hash.match(/^#slide-(\d+)$/);
    return clamp((Number.parseInt(query || hash?.[1] || "1", 10) || 1) - 1);
  }

  function updateScale() {
    const scale = Math.min(innerWidth / 1920, innerHeight / 1080);
    document.documentElement.style.setProperty("--scale", scale.toFixed(6));
  }

  function primePaths(slide) {
    slide.querySelectorAll("[data-draw]").forEach((path) => {
      let length = 1000;
      try {
        length = path.getTotalLength();
      } catch {}
      path.dataset.length = length;
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });
  }

  function buildTimeline(slide) {
    primePaths(slide);
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out", duration: 0.5 } });
    const header = slide.querySelector("header");
    const reveals = [...slide.querySelectorAll(".reveal")];
    const paths = [...slide.querySelectorAll("[data-draw]")];
    if (header) tl.fromTo(header, { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0 }, 0);
    if (paths.length) tl.to(paths, { strokeDashoffset: 0, duration: 0.95, stagger: 0.07 }, 0.12);
    if (reveals.length)
      tl.fromTo(
        reveals,
        { autoAlpha: 0, y: 26, rotate: -1 },
        { autoAlpha: 1, y: 0, rotate: 0, stagger: 0.07 },
        0.16,
      );
    if (slide.classList.contains("cover")) {
      tl.fromTo(
        ".hero-image",
        { scale: 1.08, x: 24 },
        { scale: 1, x: 0, duration: 1.25 },
        0,
      ).fromTo(
        ".price-sticker",
        { scale: 0, rotate: -28 },
        { scale: 1, rotate: 8, duration: 0.6, ease: "back.out(1.8)" },
        0.65,
      );
    }
    timelines.set(slide, tl);
  }

  function renderNotes() {
    notesBody.replaceChildren();
    const tpl = slides[currentIndex].querySelector(".speaker-notes");
    if (tpl) notesBody.append(tpl.content.cloneNode(true));
  }

  function updateChrome() {
    currentEl.textContent = String(currentIndex + 1);
    progressEl.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;
    history.replaceState(null, "", `#slide-${currentIndex + 1}`);
    document.title = `${currentIndex + 1}/30 · 社群平台密室逃脫`;
    renderNotes();
  }

  function closePops(except) {
    document.querySelectorAll(".note-pop").forEach((pop) => {
      if (pop === except) return;
      pop.dataset.open = "";
      gsap.to(pop, { autoAlpha: 0, y: 12, scale: 0.97, duration: reducedMotion ? 0 : 0.2 });
    });
  }

  function playAmbient(slide) {
    gsap.killTweensOf(slide.querySelectorAll(".packet, .conveyor"));
    if (reducedMotion) return;
    const packet = slide.querySelector(".packet");
    if (packet) {
      gsap.to(packet, {
        keyframes: [
          { x: 490, y: 0 },
          { x: 250, y: 300 },
          { x: 0, y: 0 },
        ],
        duration: 5.5,
        repeat: -1,
        ease: "none",
      });
    }
    const conveyor = slide.querySelector(".conveyor");
    if (conveyor)
      gsap.to(conveyor, { x: -120, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
  }

  function setActive(index, direction = 1) {
    const next = clamp(index);
    if (next === currentIndex && slides[currentIndex].classList.contains("is-active")) return;
    if (transition) transition.progress(1).kill();
    closePops();
    const oldSlide = slides[currentIndex];
    const newSlide = slides[next];
    currentIndex = next;
    slides.forEach((slide) => {
      if (slide !== oldSlide && slide !== newSlide) {
        slide.classList.remove("is-active");
        gsap.set(slide, { display: "none", autoAlpha: 0, x: 0 });
      }
    });
    newSlide.classList.add("is-active");
    gsap.set(newSlide, {
      display: "block",
      autoAlpha: reducedMotion ? 1 : 0,
      x: reducedMotion ? 0 : direction * 55,
    });
    const pageTl = timelines.get(newSlide);
    primePaths(newSlide);
    if (reducedMotion) {
      oldSlide.classList.remove("is-active");
      gsap.set(oldSlide, { display: "none", autoAlpha: 0, x: 0 });
      pageTl?.progress(1).pause();
    } else {
      pageTl?.pause(0);
      transition = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(oldSlide, { autoAlpha: 0, x: direction * -42, duration: 0.24 }, 0)
        .to(newSlide, { autoAlpha: 1, x: 0, duration: 0.38 }, 0.08)
        .add(() => {
          oldSlide.classList.remove("is-active");
          gsap.set(oldSlide, { display: "none", x: 0 });
          pageTl?.restart();
          playAmbient(newSlide);
        }, 0.18)
        .eventCallback("onComplete", () => {
          transition = null;
        });
    }
    updateChrome();
  }

  function go(delta) {
    const next = clamp(currentIndex + delta);
    if (next !== currentIndex) setActive(next, delta > 0 ? 1 : -1);
  }

  function toggleNotes(force) {
    const open =
      typeof force === "boolean" ? force : notesPanel.getAttribute("aria-hidden") === "true";
    notesPanel.setAttribute("aria-hidden", String(!open));
    gsap.to(notesPanel, {
      autoAlpha: open ? 1 : 0,
      x: open ? 0 : 22,
      duration: reducedMotion ? 0 : 0.26,
    });
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.();
  }

  function bindInteractions() {
    document.addEventListener("click", (event) => {
      const noteTrigger = event.target.closest("[data-note]");
      if (noteTrigger) {
        const pop = document.getElementById(noteTrigger.dataset.note);
        if (!pop) return;
        const opening = !pop.dataset.open;
        closePops(opening ? pop : undefined);
        if (opening) {
          pop.dataset.open = "1";
          gsap.fromTo(
            pop,
            { autoAlpha: 0, y: 20, scale: 0.95 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: reducedMotion ? 0 : 0.3,
              ease: "back.out(1.5)",
            },
          );
        }
        return;
      }
      if (event.target.closest(".note-pop>button")) {
        closePops();
        return;
      }
      if (!event.target.closest(".note-pop")) closePops();
    });

    document.querySelector('[data-action="print-receipt"]')?.addEventListener("click", () => {
      gsap.to("#platform-receipt", {
        autoAlpha: 1,
        y: 0,
        rotate: 1,
        duration: reducedMotion ? 0 : 0.9,
        ease: "power3.out",
      });
    });

    document.querySelector('[data-action="inventory"]')?.addEventListener("click", (event) => {
      const card = event.target.closest(".inventory-card");
      if (!card) return;
      card.classList.toggle("gone");
      const gone = document.querySelectorAll(".inventory-card.gone").length;
      document.getElementById("inventory-result").textContent = gone
        ? `已移除 ${gone} 項。共同生活少了一塊，平台的退出成本浮現了。`
        : "平台保存的同時，也取得了刪除、降權、改價與改規則的能力。";
      gsap.fromTo("#inventory-result", { scale: 0.98 }, { scale: 1, duration: 0.25 });
    });

    document.querySelector('[data-action="fake-exits"]')?.addEventListener("click", (event) => {
      const door = event.target.closest("button");
      if (!door) return;
      const messages = {
        "刪除 App": "你休息了，關係仍留在原地。",
        換一個平台: "新房間更漂亮，社交圖譜仍由房東保管。",
        買會員: "帳單改善服務，治理權尚未出現。",
        全部上鏈: "資料分散了，組織與維護還沒完成。",
        "交給 AI 管理": "處置變快了，申訴與責任仍要有人承擔。",
      };
      document.getElementById("door-message").textContent = messages[door.textContent.trim()];
      gsap.fromTo(
        door,
        { x: -8 },
        { x: 8, repeat: reducedMotion ? 0 : 5, yoyo: true, duration: 0.06, clearProps: "x" },
      );
    });

    document.querySelector('[data-action="role-switch"]')?.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      button.parentElement
        .querySelectorAll("button")
        .forEach((b) => b.classList.toggle("active", b === button));
    });

    document.querySelector('[data-action="quadrants"]')?.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      gsap.fromTo(
        button,
        { scale: 0.94, rotate: -1 },
        { scale: 1, rotate: 0, duration: 0.35, ease: "back.out(1.8)" },
      );
      button.querySelector("small").textContent = "還要看另外三格";
    });

    document.querySelector(".five-questions")?.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      const details = {
        誰制定規則: "規則來源、修訂程序與參與者要公開。",
        誰提出證據: "使用者回報、自動訊號與外部情報需要標示來源。",
        誰執行處置: "權限範圍、處置尺度與執行紀錄要能追查。",
        誰可以申訴: "受影響者需要明確期限、窗口與重新檢視。",
        誰檢視結果: "社群、獨立機構或多方治理需要看見整體影響。",
      };
      document.getElementById("answer-screen").textContent = details[button.dataset.answer];
      gsap.fromTo(
        "#answer-screen",
        { rotateX: 80, transformOrigin: "50% 0" },
        { rotateX: 0, duration: 0.35 },
      );
    });

    document.getElementById("balance-range")?.addEventListener("input", (event) => {
      const angle = (Number(event.target.value) - 50) / 5;
      gsap.to(".balance-arm", { rotate: angle, duration: 0.22, transformOrigin: "50% 50%" });
    });

    document.querySelector('[data-action="case-strip"]')?.addEventListener("click", (event) => {
      const card = event.target.closest("button");
      if (!card) return;
      gsap.fromTo(
        card,
        { rotateY: 0 },
        { rotateY: 360, duration: reducedMotion ? 0 : 0.7, transformPerspective: 800 },
      );
    });

    document.querySelector('[data-action="escape-map"]')?.addEventListener("click", (event) => {
      const key = event.target.closest("button");
      if (!key) return;
      key.classList.toggle("active");
      gsap.fromTo(".exit-node", { scale: 0.92 }, { scale: 1, duration: 0.35, ease: "back.out(2)" });
    });

    document.querySelector('[data-action="fediverse"]')?.addEventListener("click", (event) => {
      const node = event.target.closest("button");
      if (!node) return;
      gsap.fromTo(node, { scale: 0.86 }, { scale: 1, duration: 0.38, ease: "elastic.out(1,.45)" });
    });

    document.querySelector('[data-action="money-ring"]')?.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      gsap.fromTo(
        button,
        { backgroundColor: "#b9d63c", color: "#17130f", scale: 1.15 },
        { backgroundColor: "#1e5b41", color: "#f7efdc", scale: 1, duration: 0.6 },
      );
      gsap.fromTo(
        ".money-ring div",
        { scale: 0.9 },
        { scale: 1, duration: 0.4, ease: "back.out(2)" },
      );
    });

    ["defense-stack", "stack-layers"].forEach((name) => {
      document.querySelector(`[data-action="${name}"]`)?.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;
        button.classList.toggle("active");
        gsap.fromTo(button, { x: -15 }, { x: 0, duration: 0.28 });
      });
    });

    document.querySelector('[data-action="escape-checklist"]')?.addEventListener("change", () => {
      const count = document.querySelectorAll(".escape-checklist input:checked").length;
      gsap.to("#lock-fill", {
        width: `${count * 20}%`,
        duration: reducedMotion ? 0 : 0.4,
        ease: "power2.out",
      });
      document.getElementById("lock-label").textContent =
        count === 5 ? "5 / 5　出口已解鎖" : `${count} / 5　出口上鎖`;
      if (count === 5)
        gsap.fromTo(
          ".lock-meter",
          { rotate: -1 },
          {
            rotate: 1,
            repeat: reducedMotion ? 0 : 5,
            yoyo: true,
            duration: 0.08,
            clearProps: "rotate",
          },
        );
    });

    document.querySelector('[data-action="final-keys"]')?.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      button.parentElement
        .querySelectorAll("button")
        .forEach((b) => b.classList.toggle("active", b === button));
      document.getElementById("final-choice").textContent =
        `你帶走了「${button.textContent}」這把鑰匙`;
      gsap.fromTo(
        ".tear-hole",
        { scale: 0.72, rotate: -5 },
        { scale: 1, rotate: 0, duration: reducedMotion ? 0 : 0.7, ease: "elastic.out(1,.5)" },
      );
    });
  }

  function diagnostics() {
    return slides.map((slide, i) => {
      const bounds = slide.getBoundingClientRect();
      const overflows = [...slide.querySelectorAll("h1,h2,h3,p,img,figure,button,.sourcebar")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return (
            r.right > bounds.right + 2 ||
            r.bottom > bounds.bottom + 2 ||
            r.left < bounds.left - 2 ||
            r.top < bounds.top - 2
          );
        })
        .map((el) => ({
          tag: el.tagName,
          className: el.className,
          text: el.textContent?.trim().slice(0, 40),
        }));
      return { slide: i + 1, overflows };
    });
  }

  function bindNavigation() {
    document.getElementById("prev").addEventListener("click", () => go(-1));
    document.getElementById("next").addEventListener("click", () => go(1));
    document.getElementById("notes-toggle").addEventListener("click", () => toggleNotes());
    document.getElementById("notes-close").addEventListener("click", () => toggleNotes(false));
    document.getElementById("fullscreen").addEventListener("click", toggleFullscreen);
    addEventListener("keydown", (event) => {
      if (["ArrowRight", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        go(1);
      } else if (["ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        go(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        setActive(0, -1);
      } else if (event.key === "End") {
        event.preventDefault();
        setActive(slides.length - 1, 1);
      } else if (event.key.toLowerCase() === "n") toggleNotes();
      else if (event.key.toLowerCase() === "f") toggleFullscreen();
      else if (event.key === "Escape") {
        toggleNotes(false);
        closePops();
      }
    });
    addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.changedTouches[0].clientX;
      },
      { passive: true },
    );
    addEventListener(
      "touchend",
      (event) => {
        const delta = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 70) go(delta < 0 ? 1 : -1);
      },
      { passive: true },
    );
    let frame = 0;
    addEventListener("resize", () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateScale);
    });
  }

  async function init() {
    updateScale();
    if (document.fonts?.ready) await document.fonts.ready;
    const mm = gsap.matchMedia();
    mm.add(
      {
        reduce: "(prefers-reduced-motion: reduce)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        reducedMotion = Boolean(context.conditions.reduce);
        return () => {
          reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
        };
      },
    );
    slides.forEach(buildTimeline);
    bindNavigation();
    bindInteractions();
    currentIndex = requestedIndex();
    slides.forEach((slide, i) => {
      const active = i === currentIndex;
      slide.classList.toggle("is-active", active);
      gsap.set(slide, { display: active ? "block" : "none", autoAlpha: active ? 1 : 0 });
    });
    const active = slides[currentIndex];
    if (reducedMotion || new URLSearchParams(location.search).has("static"))
      timelines.get(active)?.progress(1).pause();
    else {
      timelines.get(active)?.restart();
      playAmbient(active);
    }
    updateChrome();
    window.goToSlide = (number) => setActive(clamp(Number(number) - 1), 1);
    window.getDeckDiagnostics = diagnostics;
    window.__deckReady = true;
    dispatchEvent(new CustomEvent("deckready"));
  }

  init().catch((error) => {
    console.error("Deck initialization failed", error);
    slides[0].classList.add("is-active");
  });
})();
