(() => {
  "use strict";

  const slides = Array.from(document.querySelectorAll(".slide"));
  const currentEl = document.getElementById("current-slide");
  const notesPanel = document.getElementById("notes-panel");
  const notesBody = document.getElementById("notes-body");
  const timelines = new Map();
  let currentIndex = 0;
  let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let transition = null;

  const clampIndex = (value) => Math.max(0, Math.min(slides.length - 1, value));

  function requestedIndex() {
    const query = new URLSearchParams(window.location.search).get("slide");
    const hash = window.location.hash.match(/^#slide-(\d+)$/);
    const raw = query || (hash ? hash[1] : "1");
    return clampIndex((Number.parseInt(raw, 10) || 1) - 1);
  }

  function updateScale() {
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    document.documentElement.style.setProperty("--deck-scale", scale.toFixed(6));
  }

  function pathLength(path) {
    try {
      return path.getTotalLength();
    } catch {
      return 0;
    }
  }

  function primeDrawPaths(slide) {
    const paths = Array.from(slide.querySelectorAll("[data-draw]"));
    paths.forEach((path) => {
      const length = Number(path.dataset.pathLength) || pathLength(path);
      path.dataset.pathLength = String(length);
      path.classList.remove("draw-complete");
      gsap.set(path, {
        strokeDasharray: `${length} ${length}`,
        strokeDashoffset: length,
      });
    });
  }

  function finalizeDrawPaths(slide) {
    const paths = Array.from(slide.querySelectorAll("[data-draw]"));
    paths.forEach((path) => path.classList.add("draw-complete"));
    if (paths.length) gsap.set(paths, { clearProps: "strokeDasharray,strokeDashoffset" });
  }

  function buildTimeline(slide) {
    const tl = gsap.timeline({
      paused: true,
      defaults: { duration: 0.45, ease: "power2.out" },
    });
    const titleTargets = slide.matches(".slide-cover")
      ? slide.querySelectorAll(".slide-title > span")
      : slide.querySelectorAll(".slide-title");
    const allReveals = Array.from(slide.querySelectorAll(".reveal"));
    const reveals = allReveals.filter((element) => !(element instanceof SVGElement));
    const svgReveals = allReveals.filter((element) => element instanceof SVGElement);
    const nodes = Array.from(slide.querySelectorAll(".node"));
    const drawPaths = Array.from(slide.querySelectorAll("[data-draw]"));

    drawPaths.forEach((path) => {
      path.dataset.pathLength = String(pathLength(path));
    });
    primeDrawPaths(slide);

    tl.addLabel("title", 0)
      .fromTo(
        titleTargets,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, stagger: 0.08, immediateRender: false },
        "title",
      )
      .addLabel("diagram", 0.22);

    if (drawPaths.length) {
      tl.to(
        drawPaths,
        {
          strokeDashoffset: 0,
          duration: 0.78,
          stagger: 0.035,
          onComplete: () => finalizeDrawPaths(slide),
        },
        "diagram",
      );
    }
    if (nodes.length) {
      tl.fromTo(
        nodes,
        { autoAlpha: 0 },
        { autoAlpha: 1, stagger: 0.075, immediateRender: false },
        "diagram+=0.16",
      );
    }

    tl.addLabel("copy", 0.3);
    if (reveals.length) {
      tl.fromTo(
        reveals,
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, stagger: 0.055, immediateRender: false },
        "copy",
      );
    }
    if (svgReveals.length) {
      tl.fromTo(
        svgReveals,
        { autoAlpha: 0 },
        { autoAlpha: 1, stagger: 0.055, immediateRender: false },
        "copy",
      );
    }

    if (slide.matches(".slide-cover")) {
      tl.fromTo(
        slide.querySelector(".agent-gate"),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.38, immediateRender: false },
        "diagram+=0.48",
      );
    }

    timelines.set(slide, tl);
    return tl;
  }

  function setSlideEndState(slide) {
    const tl = timelines.get(slide);
    if (tl) tl.progress(1).pause();
    const paths = slide.querySelectorAll("[data-draw]");
    const visibleTargets = slide.querySelectorAll(
      ".reveal, .node, .slide-title, .slide-title > span, .agent-gate",
    );
    const positionedTargets = slide.querySelectorAll(
      ".reveal:not(svg):not(g), .slide-title, .slide-title > span",
    );
    if (paths.length) finalizeDrawPaths(slide);
    if (visibleTargets.length) gsap.set(visibleTargets, { autoAlpha: 1 });
    if (positionedTargets.length) gsap.set(positionedTargets, { x: 0, y: 0 });
  }

  function renderNotes() {
    const template = slides[currentIndex].querySelector(".speaker-notes");
    notesBody.replaceChildren();
    if (template) notesBody.appendChild(template.content.cloneNode(true));
  }

  function updateChrome() {
    currentEl.textContent = String(currentIndex + 1);
    renderNotes();
    const hash = `#slide-${currentIndex + 1}`;
    if (window.location.hash !== hash) history.replaceState(null, "", hash);
    document.title = `${currentIndex + 1}/8 · Democratizing Taiwan’s Digital Civic Infrastructure`;
  }

  function showImmediate(index) {
    currentIndex = clampIndex(index);
    slides.forEach((slide, i) => {
      const active = i === currentIndex;
      slide.classList.toggle("is-active", active);
      gsap.set(slide, {
        display: active ? "block" : "none",
        autoAlpha: active ? 1 : 0,
        x: 0,
      });
      if (active) setSlideEndState(slide);
    });
    updateChrome();
  }

  function goTo(index, direction = 0) {
    const nextIndex = clampIndex(index);
    if (nextIndex === currentIndex) return;

    if (transition) {
      transition.progress(1).kill();
      transition = null;
    }

    const oldSlide = slides[currentIndex];
    const newSlide = slides[nextIndex];
    const travel = direction || (nextIndex > currentIndex ? 1 : -1);
    currentIndex = nextIndex;

    slides.forEach((slide) => {
      if (slide !== oldSlide && slide !== newSlide) {
        slide.classList.remove("is-active");
        gsap.set(slide, { display: "none", autoAlpha: 0, x: 0 });
      }
    });

    timelines.forEach((tl, slide) => {
      if (slide !== newSlide) tl.pause();
    });

    newSlide.classList.add("is-active");
    gsap.set(newSlide, {
      display: "block",
      autoAlpha: reducedMotion ? 1 : 0,
      x: reducedMotion ? 0 : travel * 42,
    });

    if (reducedMotion) {
      oldSlide.classList.remove("is-active");
      gsap.set(oldSlide, { display: "none", autoAlpha: 0, x: 0 });
      setSlideEndState(newSlide);
      updateChrome();
      return;
    }

    const pageTl = timelines.get(newSlide);
    pageTl.pause(0);
    primeDrawPaths(newSlide);
    transition = gsap.timeline({ defaults: { ease: "power2.out" } });
    transition
      .to(oldSlide, { autoAlpha: 0, x: -travel * 30, duration: 0.24 }, 0)
      .to(newSlide, { autoAlpha: 1, x: 0, duration: 0.34 }, 0.08)
      .add(() => {
        oldSlide.classList.remove("is-active");
        gsap.set(oldSlide, { display: "none", x: 0 });
      }, 0.35)
      .add(() => pageTl.restart(), 0.12)
      .eventCallback("onComplete", () => {
        transition = null;
      });

    updateChrome();
  }

  function toggleNotes(force) {
    const open = typeof force === "boolean" ? force : !notesPanel.classList.contains("is-open");
    notesPanel.classList.toggle("is-open", open);
    notesPanel.setAttribute("aria-hidden", String(!open));
    if (open) notesPanel.scrollTop = 0;
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  function beforePrint() {
    if (transition) transition.progress(1).kill();
    slides.forEach((slide) => {
      slide.classList.add("is-active");
      gsap.set(slide, { display: "block", autoAlpha: 1, x: 0 });
      setSlideEndState(slide);
    });
  }

  function afterPrint() {
    slides.forEach((slide, i) => {
      const active = i === currentIndex;
      slide.classList.toggle("is-active", active);
      gsap.set(slide, {
        display: active ? "block" : "none",
        autoAlpha: active ? 1 : 0,
        x: 0,
      });
    });
  }

  function diagnostics() {
    return slides.map((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const overflow = Array.from(slide.querySelectorAll("h1, h2, h3, p, figure, svg"))
        .map((element) => ({ element, rect: element.getBoundingClientRect() }))
        .filter(
          ({ rect: child }) =>
            child.right > rect.right + 1 ||
            child.bottom > rect.bottom + 1 ||
            child.left < rect.left - 1 ||
            child.top < rect.top - 1,
        )
        .map(({ element, rect: child }) => ({
          tag: element.tagName,
          className: element.className?.baseVal || element.className || "",
          left: Math.round(child.left - rect.left),
          top: Math.round(child.top - rect.top),
          right: Math.round(child.right - rect.left),
          bottom: Math.round(child.bottom - rect.top),
        }));
      return { slide: index + 1, overflow };
    });
  }

  function bindEvents() {
    document.getElementById("prev").addEventListener("click", () => goTo(currentIndex - 1, -1));
    document.getElementById("next").addEventListener("click", () => goTo(currentIndex + 1, 1));
    document.getElementById("notes-toggle").addEventListener("click", () => toggleNotes());
    document.getElementById("notes-close").addEventListener("click", () => toggleNotes(false));
    document.getElementById("fullscreen").addEventListener("click", toggleFullscreen);

    document.addEventListener("keydown", (event) => {
      if (["ArrowRight", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        goTo(currentIndex + 1, 1);
      } else if (["ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        goTo(currentIndex - 1, -1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0, -1);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(slides.length - 1, 1);
      } else if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        toggleNotes();
      } else if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        toggleFullscreen();
      } else if (event.key === "Escape") {
        toggleNotes(false);
      }
    });

    let resizeFrame = 0;
    window.addEventListener("resize", () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(updateScale);
    });
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
  }

  async function init() {
    updateScale();
    if (document.fonts?.ready) await document.fonts.ready;

    const motionMedia = gsap.matchMedia();
    motionMedia.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        allowMotion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        reducedMotion = Boolean(context.conditions.reduceMotion);
        return () => {
          reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        };
      },
    );

    slides.forEach(buildTimeline);
    bindEvents();
    currentIndex = requestedIndex();

    slides.forEach((slide, i) => {
      const active = i === currentIndex;
      slide.classList.toggle("is-active", active);
      gsap.set(slide, {
        display: active ? "block" : "none",
        autoAlpha: active ? 1 : 0,
        x: 0,
      });
    });

    if (reducedMotion || new URLSearchParams(window.location.search).has("static")) {
      showImmediate(currentIndex);
    } else {
      const activeSlide = slides[currentIndex];
      gsap.set(activeSlide, { autoAlpha: 1 });
      timelines.get(activeSlide).restart();
      updateChrome();
    }

    window.goToSlide = (number) => goTo(clampIndex(Number(number) - 1));
    window.getDeckDiagnostics = diagnostics;
    window.__deckReady = true;
    window.dispatchEvent(new CustomEvent("deckready"));
  }

  init().catch((error) => {
    console.error("Deck initialization failed", error);
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === 0));
  });
})();
